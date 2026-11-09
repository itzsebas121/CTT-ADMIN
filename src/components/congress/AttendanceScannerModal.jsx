import { useState, useEffect, useRef, useCallback } from "react";
import {
  XMarkIcon,
  QrCodeIcon,
  CameraIcon,
  BoltIcon,
  BoltSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import api from "../../api/api";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { toast } from "react-toastify";

// Generador de audio nativo con Web Audio API (cero dependencias de archivos de audio)
const playChime = (type) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;

    if (type === "success") {
      // Tono de dos notas ascendente brillante (D5 587.33Hz -> A5 880Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.09);
      gain2.gain.setValueAtTime(0.3, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.35);
    } else {
      // Tono de advertencia / error grave con diente de sierra
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(170, now + 0.28);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    console.warn("AudioContext error:", err);
  }
};

// Disparador de vibración háptica para dispositivos móviles
const triggerHaptic = (type) => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      if (type === "success") {
        navigator.vibrate(100);
      } else {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Dispositivo no soporta o no permite vibración
    }
  }
};

export default function AttendanceScannerModal({
  isOpen,
  onClose,
  congressId,
  sessions = [],
  selectedSession = null,
  onAttendanceRecorded = null,
}) {
  const { isDark } = useDashboardTheme();

  // Estados del modal
  const [activeMode, setActiveMode] = useState("camera"); // "camera" | "usb"
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [processingScan, setProcessingScan] = useState(false);
  const [lastScanResult, setLastScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [liveSessionCount, setLiveSessionCount] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Linterna y cámaras
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  // Referencias para la cámara y buffer de teclado USB
  const html5QrCodeRef = useRef(null);
  const scannerContainerId = "reader-attendance-camera-box";
  const lastKeyTimeRef = useRef(0);
  const keyBufferRef = useRef("");

  // Sincronizar sesión seleccionada inicial
  useEffect(() => {
    if (selectedSession && (selectedSession.id_sesion || selectedSession.id)) {
      setSelectedSessionId(String(selectedSession.id_sesion || selectedSession.id));
    } else if (sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(String(sessions[0].id_sesion || sessions[0].id || 1));
    }
  }, [selectedSession, sessions]);

  // Obtener conteo en vivo de la sesión actual
  const fetchSessionAttendance = useCallback(async (sessId) => {
    if (!congressId || !sessId) return;
    try {
      const res = await api.get(`/congresses/${congressId}/attendance/session/${sessId}`);
      if (Array.isArray(res.data)) {
        setLiveSessionCount(res.data.length);
      } else if (res.data && typeof res.data === "object") {
        setLiveSessionCount(res.data.total ?? res.data.count ?? (res.data.attendees?.length || 0));
      }
    } catch {
      // Endpoint opcional en backend
    }
  }, [congressId]);

  useEffect(() => {
    if (isOpen && selectedSessionId) {
      fetchSessionAttendance(selectedSessionId);
    }
  }, [isOpen, selectedSessionId, fetchSessionAttendance]);

  // Limpiar instancia de cámara
  const stopCameraScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Aviso al detener escáner:", err);
      } finally {
        html5QrCodeRef.current = null;
        setIsCameraActive(false);
        setIsTorchOn(false);
        setHasTorch(false);
      }
    }
  }, []);

  // Procesar código escaneado (común para Cámara y USB)
  const processAttendanceScan = useCallback(
    async (codePayload, scanSource = "Cámara") => {
      const code = String(codePayload || "").trim();
      if (!code) return;

      if (!selectedSessionId) {
        toast.warning("Seleccione una sesión antes de escanear asistencia.");
        return;
      }

      setProcessingScan(true);
      const scanTimestamp = new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      try {
        const payload = {
          qr_payload: code,
          id_sesion: parseInt(selectedSessionId, 10),
        };

        const res = await api.post(`/congresses/${congressId}/attendance/scan`, payload);

        // Feedback positivo
        playChime("success");
        triggerHaptic("success");

        const attendeeName =
          res.data?.attendee_name || res.data?.nombre || "Participante Verificado";
        const tariffType = res.data?.tariff_type || res.data?.tarifa || "ESTUDIANTE_UTA";
        const totalSessions = res.data?.total_sessions_attended ?? 1;

        const successResult = {
          status: "success",
          attendee_name: attendeeName,
          tariff_type: tariffType,
          total_sessions_attended: totalSessions,
          timestamp: scanTimestamp,
          code,
          source: scanSource,
          message: "Asistencia registrada exitosamente",
        };

        setLastScanResult(successResult);
        setScanHistory((prev) => [successResult, ...prev.slice(0, 14)]);
        setLiveSessionCount((prev) => (prev !== null ? prev + 1 : 1));

        toast.success(`Asistencia registrada: ${attendeeName}`);

        if (onAttendanceRecorded) {
          onAttendanceRecorded({
            ...res.data,
            sessionId: selectedSessionId,
            qr_payload: code,
          });
        }
      } catch (err) {
        const statusCode = err.response?.status;
        const errorDetail =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Error al procesar el pase de asistencia.";

        playChime("error");
        triggerHaptic("error");

        if (statusCode === 409) {
          // Conflicto de duplicidad
          const conflictResult = {
            status: "conflict",
            message: errorDetail || "Asistencia ya registrada previamente en esta sesión",
            timestamp: scanTimestamp,
            code,
            source: scanSource,
          };
          setLastScanResult(conflictResult);
          setScanHistory((prev) => [conflictResult, ...prev.slice(0, 14)]);
          toast.warn(errorDetail);
        } else {
          // Otro error de validación
          const errorResult = {
            status: "error",
            message: errorDetail,
            timestamp: scanTimestamp,
            code,
            source: scanSource,
          };
          setLastScanResult(errorResult);
          setScanHistory((prev) => [errorResult, ...prev.slice(0, 14)]);
          toast.error(errorDetail);
        }
      } finally {
        // Pausa de enfriamiento de 1.2 segundos para evitar rebotes de lectura
        setTimeout(() => {
          setProcessingScan(false);
        }, 1200);
      }
    },
    [congressId, selectedSessionId, onAttendanceRecorded]
  );

  // Iniciar la cámara QR
  const startCameraScanner = useCallback(async () => {
    if (!isOpen || activeMode !== "camera") return;

    await stopCameraScanner();
    setCameraError(null);

    const container = document.getElementById(scannerContainerId);
    if (!container) return;

    try {
      // Listar cámaras disponibles si no se han obtenido
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          setAvailableCameras(cameras);
        }
      } catch {
        // Fallback si getCameras no es soportado
      }

      const scanner = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.333,
      };

      const cameraSource = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: "environment" };

      await scanner.start(
        cameraSource,
        config,
        (decodedText) => {
          if (!processingScan) {
            processAttendanceScan(decodedText, "Cámara");
          }
        },
        () => {
          // Ignorar errores de frames sin código
        }
      );

      setIsCameraActive(true);

      // Verificar capacidades de linterna/torch
      try {
        const trackCaps = scanner.getRunningTrackCameraCapabilities();
        if (trackCaps && typeof trackCaps.torchFeature === "function") {
          setHasTorch(trackCaps.torchFeature().isSupported());
        } else {
          const track = scanner.getRunningTrackCapabilities?.();
          setHasTorch(Boolean(track && "torch" in track));
        }
      } catch {
        setHasTorch(false);
      }
    } catch (err) {
      console.warn("Fallo al iniciar cámara:", err);
      setCameraError(
        "No se pudo acceder a la cámara. Compruebe los permisos del navegador o use el Modo Lector USB / Teclado."
      );
      setIsCameraActive(false);
    }
  }, [isOpen, activeMode, selectedCameraId, processingScan, processAttendanceScan, stopCameraScanner]);

  // Manejador del botón linterna
  const handleToggleTorch = async () => {
    if (!html5QrCodeRef.current || !hasTorch) return;
    try {
      const nextTorch = !isTorchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setIsTorchOn(nextTorch);
    } catch (err) {
      console.warn("Error al alternar linterna:", err);
    }
  };

  // Ciclo de vida para arrancar o detener la cámara
  useEffect(() => {
    if (isOpen && activeMode === "camera") {
      const timer = setTimeout(() => {
        startCameraScanner();
      }, 150);
      return () => {
        clearTimeout(timer);
        stopCameraScanner();
      };
    } else {
      stopCameraScanner();
    }
  }, [isOpen, activeMode, selectedCameraId, startCameraScanner, stopCameraScanner]);

  // MODO USB SCANNER: Captura global de teclado con cadencia rápida (<80ms) terminada en Enter
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowKeyDown = (e) => {
      // Si el foco está en un input o textarea distinto al de manual scanner, no interceptar
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      const activeId = document.activeElement ? document.activeElement.id : "";
      if (
        (activeTag === "INPUT" || activeTag === "TEXTAREA") &&
        activeId !== "attendance-manual-input"
      ) {
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastKeyTimeRef.current;

      if (e.key === "Enter") {
        if (keyBufferRef.current.length >= 3 && (timeDiff < 100 || activeMode === "usb")) {
          e.preventDefault();
          const capturedCode = keyBufferRef.current.trim();
          keyBufferRef.current = "";
          processAttendanceScan(capturedCode, "Pistola USB");
        } else {
          keyBufferRef.current = "";
        }
        return;
      }

      // Ignorar teclas modificadoras
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
        return;
      }

      // Cadencia típica de pistola óptica (< 80ms entre caracteres)
      if (timeDiff > 80 && keyBufferRef.current.length > 0 && activeMode !== "usb") {
        keyBufferRef.current = e.key;
      } else {
        keyBufferRef.current += e.key;
      }
      lastKeyTimeRef.current = now;
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isOpen, activeMode, processAttendanceScan]);

  // Manejo de envío manual de código
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processAttendanceScan(manualCode.trim(), "Entrada Manual");
    setManualCode("");
  };

  if (!isOpen) return null;

  const currentSessionObj = sessions.find(
    (s) => String(s.id_sesion || s.id) === String(selectedSessionId)
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#16161a] rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] shadow-2xl border border-black/[0.08] dark:border-white/[0.08] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra móvil para deslizar / Bottom Sheet handle */}
        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Encabezado limpio y directo (Cero badges decorativos sobre el título) */}
        <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <QrCodeIcon className="w-5 h-5 text-[#00345e] dark:text-blue-400 shrink-0" />
              <span>Control de Asistencia a Sesión</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Escaneo con cámara móvil trasera o lector óptico USB de recepción
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Sesión y Conteo en Vivo */}
        <div className="px-5 py-3 bg-zinc-50 dark:bg-white/[0.02] border-b border-black/[0.06] dark:border-white/[0.08] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="w-full sm:w-2/3">
              <label
                htmlFor="session-select"
                className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1"
              >
                Sesión del Cronograma
              </label>
              <select
                id="session-select"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 text-xs font-medium rounded-lg border border-black/[0.1] dark:border-white/[0.15] bg-white dark:bg-[#1f1f23] text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00345e] dark:focus:ring-blue-500 cursor-pointer"
              >
                {sessions.length > 0 ? (
                  sessions.map((s, idx) => (
                    <option key={s.id_sesion || s.id || idx} value={s.id_sesion || s.id || idx}>
                      {s.titulo_sesion || `Sesión #${idx + 1}`} ({s.fecha || "Fecha"} -{" "}
                      {s.hora_inicio || "--:--"})
                    </option>
                  ))
                ) : (
                  <option value="1">Sesión Principal del Congreso</option>
                )}
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              {currentSessionObj?.lugar && (
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <BuildingOffice2Icon className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{currentSessionObj.lugar}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00345e]/10 dark:bg-blue-950/40 border border-[#00345e]/20 dark:border-blue-800/40 text-[#00345e] dark:text-blue-300">
                <UserIcon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold font-mono">
                  {liveSessionCount !== null ? liveSessionCount : 0}
                </span>
                <span className="text-[11px] font-medium">Asistentes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de Modo: Cámara vs Lector USB */}
        <div className="px-5 pt-3 pb-1 shrink-0">
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-white/[0.04] rounded-xl border border-black/[0.05] dark:border-white/[0.05]">
            <button
              type="button"
              onClick={() => setActiveMode("camera")}
              className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMode === "camera"
                  ? "bg-white dark:bg-[#25252b] text-[#00345e] dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <DevicePhoneMobileIcon className="w-4 h-4" />
              <span>Cámara Móvil / Webcam</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("usb")}
              className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMode === "usb"
                  ? "bg-white dark:bg-[#25252b] text-[#00345e] dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <ComputerDesktopIcon className="w-4 h-4" />
              <span>Lector USB / Pistola 2D</span>
            </button>
          </div>
        </div>

        {/* Cuerpo Principal del Modal con Scroll */}
        <div className="px-5 py-3 space-y-4 overflow-y-auto flex-1">
          {/* MODO CÁMARA */}
          {activeMode === "camera" && (
            <div className="space-y-3">
              {/* Contenedor del Visor de Cámara */}
              <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video sm:aspect-[4/3] max-h-[280px] sm:max-h-[310px] flex items-center justify-center shadow-inner border border-black/10 dark:border-white/10">
                <div id={scannerContainerId} className="w-full h-full" />

                {/* Overlays de control de cámara (Linterna y Cambio de Cámara) */}
                {isCameraActive && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-2 z-10">
                    {hasTorch && (
                      <button
                        type="button"
                        onClick={handleToggleTorch}
                        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isTorchOn
                            ? "bg-amber-400 text-zinc-900 shadow-lg ring-2 ring-amber-300"
                            : "bg-black/50 text-white hover:bg-black/70"
                        }`}
                        title={isTorchOn ? "Apagar linterna" : "Encender linterna"}
                      >
                        {isTorchOn ? (
                          <BoltIcon className="w-5 h-5" />
                        ) : (
                          <BoltSlashIcon className="w-5 h-5" />
                        )}
                      </button>
                    )}

                    {availableCameras.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const currentIdx = availableCameras.findIndex(
                            (c) => c.id === selectedCameraId
                          );
                          const nextIdx = (currentIdx + 1) % availableCameras.length;
                          setSelectedCameraId(availableCameras[nextIdx].id);
                        }}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-all cursor-pointer"
                        title="Cambiar cámara"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Indicador de escaneo en progreso */}
                {processingScan && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-2" />
                    <p className="text-xs font-semibold text-white">Validando credencial QR...</p>
                  </div>
                )}
              </div>

              {cameraError ? (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2.5">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-200">
                    <p className="font-semibold">Aviso de Cámara</p>
                    <p className="mt-0.5">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveMode("usb")}
                      className="mt-2 text-xs font-bold text-[#00345e] dark:text-blue-300 underline cursor-pointer"
                    >
                      Cambiar a Modo Lector USB / Entrada Manual
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center">
                  Enfoque el código QR del carnet digital o PDF del participante dentro del recuadro.
                </p>
              )}
            </div>
          )}

          {/* MODO PISTOLA USB / MANUAL */}
          {activeMode === "usb" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-dashed border-[#00345e]/40 dark:border-blue-500/40 bg-[#00345e]/5 dark:bg-blue-950/20 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#00345e]/10 dark:bg-blue-900/40 text-[#00345e] dark:text-blue-300 flex items-center justify-center mx-auto">
                  <ComputerDesktopIcon className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    Lector de Código de Barras / QR USB Activo
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 max-w-md mx-auto">
                    Apunte la pistola física al carnet impreso o pantalla del estudiante. El código
                    se capturará automáticamente sin necesidad de seleccionar ningún campo.
                  </p>
                </div>
              </div>

              {/* Entrada de respaldo manual */}
              <form onSubmit={handleManualSubmit} className="space-y-1.5">
                <label
                  htmlFor="attendance-manual-input"
                  className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
                >
                  O Ingrese Código Manualmente
                </label>
                <div className="flex gap-2">
                  <input
                    id="attendance-manual-input"
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Ej. UTA-FISEI-PASS-12-1 o cédula..."
                    className="flex-1 min-h-[44px] px-3.5 py-2 text-xs font-mono rounded-lg border border-black/[0.1] dark:border-white/[0.15] bg-white dark:bg-[#1f1f23] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#00345e] dark:focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={processingScan || !manualCode.trim()}
                    className="min-h-[44px] px-4 py-2 bg-[#00345e] hover:bg-[#002848] dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    {processingScan ? "Verificando..." : "Registrar"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TARJETA DE RESULTADO DEL ÚLTIMO ESCANEO */}
          {lastScanResult && (
            <div className="animate-in fade-in zoom-in-95 duration-150">
              {lastScanResult.status === "success" && (
                <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 flex items-start gap-3 shadow-xs">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Asistencia Confirmada
                      </p>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                        {lastScanResult.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1 truncate">
                      {lastScanResult.attendee_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 uppercase font-mono">
                        {lastScanResult.tariff_type}
                      </span>
                      <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                        Total asistencias:{" "}
                        <strong className="font-bold">
                          {lastScanResult.total_sessions_attended}
                        </strong>
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        (Vía {lastScanResult.source})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {lastScanResult.status === "conflict" && (
                <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/90 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 flex items-start gap-3 shadow-xs">
                  <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                        Asistencia Ya Registrada Previamente
                      </p>
                      <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 shrink-0">
                        {lastScanResult.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 dark:text-amber-200 mt-1">
                      {lastScanResult.message}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                      Código: {lastScanResult.code}
                    </p>
                  </div>
                </div>
              )}

              {lastScanResult.status === "error" && (
                <div className="p-4 rounded-xl border border-red-300 dark:border-red-800/80 bg-red-50/90 dark:bg-red-950/40 text-red-950 dark:text-red-100 flex items-start gap-3 shadow-xs">
                  <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                        Error al Validar Asistencia
                      </p>
                      <span className="text-[11px] font-mono text-red-600 dark:text-red-400 shrink-0">
                        {lastScanResult.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-red-900 dark:text-red-200 mt-1">
                      {lastScanResult.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORIAL RECIENTE DE ESCANEOS EN ESTA SESIÓN */}
          {scanHistory.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Historial de Lecturas Recientes ({scanHistory.length})
                </p>
                <button
                  type="button"
                  onClick={() => setScanHistory([])}
                  className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  Limpiar historial
                </button>
              </div>

              <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05] max-h-36 overflow-y-auto rounded-lg border border-black/[0.05] dark:border-white/[0.05]">
                {scanHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 text-xs flex items-center justify-between gap-2 bg-white/40 dark:bg-white/[0.01]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.status === "success" ? (
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : item.status === "conflict" ? (
                        <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                        {item.attendee_name || item.code}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pie de acción */}
        <div className="px-5 py-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.01] flex items-center justify-between shrink-0">
          <p className="text-[11px] text-zinc-400 hidden sm:block">
            {selectedSessionId
              ? `Sesión activa: #${selectedSessionId}`
              : "Seleccione una sesión para registrar"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Finalizar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

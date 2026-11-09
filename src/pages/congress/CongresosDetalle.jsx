import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  getCongressById,
  getCongressSessions,
  getCongressSponsorships,
  getCongressStatistics,
} from "../../api/congresses";
import { getCongressEnrolledUsers } from "../../api/enrolled_users";
import api from "../../api/api";
import { resolveImageUrl } from "../../utils/helpers";
import ValidatePaymentModal from "../../components/enrollment/ValidatePaymentModal";
import AttendanceScannerModal from "../../components/congress/AttendanceScannerModal";
import FinancialDashboardTab from "../../components/congress/FinancialDashboardTab";
import PaperReviewModal from "../../components/congress/PaperReviewModal";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import { toast } from "react-toastify";

export default function CongresosDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useDashboardTheme();

  const [congress, setCongress] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [activeSessionForScanner, setActiveSessionForScanner] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general"); // "general" | "cronograma" | "patrocinadores" | "inscritos" | "finanzas" | "papers"

  const [papers, setPapers] = useState([]);
  const [selectedPaperForReview, setSelectedPaperForReview] = useState(null);
  const [isPaperReviewModalOpen, setIsPaperReviewModalOpen] = useState(false);
  const [loadingPapers, setLoadingPapers] = useState(false);

  const loadPapers = useCallback(async () => {
    if (!id) return;
    try {
      setLoadingPapers(true);
      const res = await api.get(`/congresses/${id}/papers`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.papers || res.data?.items || [];
      setPapers(list);
    } catch {
      setPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadPapers();
    }
  }, [id, loadPapers]);

  const handleOpenPaperReview = (paper) => {
    setSelectedPaperForReview(paper);
    setIsPaperReviewModalOpen(true);
  };

  const handlePaperReviewed = (updatedPaper) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === updatedPaper.id ? { ...p, ...updatedPaper } : p))
    );
  };

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCongressById(id);
        const c = data.congress || data;
        setCongress(c);

        if (Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        } else if (Array.isArray(data.sesiones)) {
          setSessions(data.sesiones);
        } else {
          try {
            const sess = await getCongressSessions(id);
            setSessions(Array.isArray(sess) ? sess : sess.sessions || sess.sesiones || []);
          } catch {
            setSessions([]);
          }
        }

        if (Array.isArray(data.sponsors)) {
          setSponsors(data.sponsors);
        } else {
          try {
            const spon = await getCongressSponsorships(id);
            setSponsors(Array.isArray(spon) ? spon : spon.sponsors || []);
          } catch {
            setSponsors([]);
          }
        }

        try {
          const st = await getCongressStatistics(id);
          setStats(st);
        } catch {
          setStats(null);
        }

        try {
          const enrolledData = await getCongressEnrolledUsers(id, 1, 50);
          setEnrollments(enrolledData?.items || []);
        } catch {
          setEnrollments([]);
        }
      } catch (err) {
        setError(err.message || "Error al cargar la información del congreso");
        toast.error("No se pudo cargar el detalle del congreso.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDetails();
    }
  }, [id]);

  const handleOpenValidation = (enr) => {
    setSelectedEnrollment(enr);
    setIsValidationModalOpen(true);
  };

  const handleStatusUpdated = (enrId, newStatus) => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === enrId ? { ...e, status: newStatus } : e))
    );
  };

  const handleOpenAttendanceScanner = (session = null) => {
    setActiveSessionForScanner(session);
    setIsAttendanceModalOpen(true);
  };

  const renderPaperStatusBadge = (st) => {
    const s = (st || "ENVIADO").toUpperCase();
    if (s === "APROBADO") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
          Aprobado
        </span>
      );
    }
    if (s === "RECHAZADO") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
          Rechazado
        </span>
      );
    }
    if (s === "EN_REVISION" || s === "EN REVISION") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
          En Revisión
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-[#00345e] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        Enviado
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-9 w-9 border-2 border-[#00345e] dark:border-blue-400 border-t-transparent mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#00345e] dark:text-blue-400">
            Cargando detalles del congreso...
          </p>
        </div>
      </div>
    );
  }

  if (error || !congress) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md mx-auto p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 flex items-center justify-center mx-auto mb-3">
            <ExclamationTriangleIcon className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-red-700 dark:text-red-300 mb-1">
            {error || "Congreso no encontrado"}
          </h2>
          <p className="text-xs text-red-600 dark:text-red-400 mb-4">
            No se pudo encontrar la información del evento solicitado.
          </p>
          <button
            onClick={() => navigate("/dashboard/congresos")}
            className="px-3.5 py-1.5 bg-[#00345e] hover:bg-[#002747] text-white font-medium text-xs rounded-lg transition cursor-pointer"
          >
            Volver a Congresos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Barra superior de navegación */}
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => navigate("/dashboard/congresos")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Congresos</span>
          </button>
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          <h1 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
            {congress.nombre}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAttendanceScanner(null)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer min-h-[44px]"
            title="Escanear asistencia por QR o lector USB"
          >
            <QrCodeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Escanear Asistencia QR</span>
            <span className="sm:hidden">Escanear</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/dashboard/congresos/${id}/editar`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#00345e] hover:bg-[#002747] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer border-0 min-h-[44px]"
          >
            <PencilSquareIcon className="w-3.5 h-3.5" />
            <span>Editar Congreso</span>
          </button>
        </div>
      </div>

      {/* Tarjeta Principal Hero */}
      <div
        className={`rounded-xl border overflow-hidden transition-colors shadow-2xs ${
          isDark ? "bg-[#16161a] border-white/[0.08]" : "bg-white border-black/[0.08]"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Portada / Afiche */}
          <div className="lg:col-span-5 bg-zinc-900 relative min-h-[240px] lg:min-h-[320px] flex items-center justify-center overflow-hidden">
            {congress.poster_cover_url ? (
              <img
                src={congress.poster_cover_url}
                alt={congress.nombre}
                className="w-full h-full object-cover max-h-[360px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="text-zinc-500 text-center p-6">
                <CalendarDaysIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Sin portada oficial</p>
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-white rounded text-[10px] font-bold uppercase tracking-wider">
                Edición {congress.edicion || "General"}
              </span>
              <span className="px-2 py-0.5 bg-[#00345e] text-white rounded text-[10px] font-bold">
                {congress.anio || 2026}
              </span>
            </div>
          </div>

          {/* Información del encabezado */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400">
                  ID #{congress.id || congress.id_congreso}
                </span>
              </div>

              <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                {congress.nombre}
              </h2>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-[#00345e] dark:text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-zinc-400 font-medium">Inauguración</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {congress.fecha_inicio || "Por definir"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4 text-[#00345e] dark:text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-zinc-400 font-medium">Clausura</p>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {congress.fecha_fin || "Por definir"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Métricas rápidas */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-center">
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {sessions.length}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase">Sesiones</p>
                </div>
                <div className="p-2.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-center">
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {sponsors.length}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase">Auspiciantes</p>
                </div>
                <div className="p-2.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] text-center">
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {stats?.total_inscriptions || stats?.inscriptions_count || 0}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase">Inscritos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de contenido */}
        <div className="border-t border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-6 bg-zinc-50/50 dark:bg-white/[0.01]">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "general"
                  ? "border-[#00345e] dark:border-blue-400 text-[#00345e] dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Descripción General
            </button>
            <button
              onClick={() => setActiveTab("cronograma")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "cronograma"
                  ? "border-[#00345e] dark:border-blue-400 text-[#00345e] dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Cronograma ({sessions.length})
            </button>
            <button
              onClick={() => setActiveTab("patrocinadores")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "patrocinadores"
                  ? "border-[#00345e] dark:border-blue-400 text-[#00345e] dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Auspiciantes ({sponsors.length})
            </button>
            <button
              onClick={() => setActiveTab("inscritos")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "inscritos"
                  ? "border-[#00345e] dark:border-blue-400 text-[#00345e] dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Inscritos ({enrollments.length})
            </button>
            <button
              onClick={() => setActiveTab("finanzas")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "finanzas"
                  ? "border-[#00345e] dark:border-blue-400 text-[#00345e] dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Resumen Financiero y LMS
            </button>
            <button
              onClick={() => setActiveTab("papers")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "papers"
                  ? "border-[#00345e] dark:border-blue-400 text-[#00345e] dark:text-blue-300"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Artículos Científicos / CFP ({papers.length})
            </button>
          </div>
        </div>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div
        className={`rounded-xl border p-4 sm:p-5 transition-colors shadow-2xs ${
          isDark ? "bg-[#16161a] border-white/[0.08]" : "bg-white border-black/[0.08]"
        }`}
      >
        {activeTab === "general" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">
                Resumen Académico
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {congress.descripcion_general || "Sin descripción registrada."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "cronograma" && (
          <div className="space-y-3">
            {/* Cabecera de gestión de asistencia */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg bg-zinc-50 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Sesiones del Cronograma
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Registre la asistencia de participantes mediante escaneo QR con cámara móvil o pistola USB
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAttendanceScanner(null)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#00345e] hover:bg-[#002848] rounded-lg transition-colors cursor-pointer min-h-[44px] shrink-0"
              >
                <QrCodeIcon className="w-4 h-4" />
                <span>Abrir Escáner de Asistencia</span>
              </button>
            </div>

            {sessions.length > 0 ? (
              sessions.map((sess, idx) => (
                <div
                  key={sess.id_sesion || idx}
                  className="p-3.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {sess.titulo_sesion || "Sesión académica"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                      <span>{sess.lugar || "Auditorio FISEI"}</span>
                      <span>·</span>
                      <span className="capitalize">Jornada {sess.jornada || "general"}</span>
                      {sess.modalidad && (
                        <>
                          <span>·</span>
                          <span className="uppercase text-[10px] font-mono">{sess.modalidad}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                      {sess.fecha} ({sess.hora_inicio} - {sess.hora_fin})
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAttendanceScanner(sess)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer min-h-[44px] shrink-0"
                      title="Escanear asistencia a esta sesión"
                    >
                      <QrCodeIcon className="w-4 h-4" />
                      <span>Escanear Asistencia</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic text-center py-6">
                No hay sesiones registradas en el cronograma.
              </p>
            )}
          </div>
        )}

        {activeTab === "patrocinadores" && (
          <div className="space-y-3">
            {sponsors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sponsors.map((sp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">
                        {sp.sponsor_name || sp.nombre || "Empresa"}
                      </p>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Categoría: {sp.categoria || "Colaborador"}
                      </p>
                    </div>
                    {sp.aporte && (
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ${Number(sp.aporte).toLocaleString()} USD
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic text-center py-6">
                No hay auspiciantes asociados a este congreso.
              </p>
            )}
          </div>
        )}

        {activeTab === "inscritos" && (
          <div className="space-y-3">
            {enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/[0.08] dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400 font-semibold">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Estudiante / Participante</th>
                      <th className="py-2.5 px-3">Correo</th>
                      <th className="py-2.5 px-3">Teléfono</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3 text-center">Estado</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                    {enrollments.map((enr) => {
                      const dateStr = enr.enrollment_date
                        ? new Date(enr.enrollment_date).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—";

                      const statusBadge =
                        enr.status === "PAGADO" || enr.status === "Pagado" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            Pagado
                          </span>
                        ) : enr.status === "ORDEN_GENERADA" || enr.status === "Generada la orden" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-[#00345e] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Orden Generada
                          </span>
                        ) : enr.status === "FACTURADO" || enr.status === "Facturado" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            Facturado
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {enr.status}
                          </span>
                        );

                      return (
                        <tr
                          key={enr.id}
                          className="hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">
                            #{enr.id}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                            {enr.user_name || `Usuario #${enr.id_user_platform}`}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300 font-mono text-[11px]">
                            {enr.user_email || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                            {enr.user_cellphone || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-400">
                            {dateStr}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {statusBadge}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenValidation(enr)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#00345e] dark:text-blue-300 bg-[#00345e]/10 dark:bg-blue-900/30 hover:bg-[#00345e]/20 rounded-md transition cursor-pointer"
                            >
                              <span>Revisar Pago</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic text-center py-8">
                No hay inscritos registrados para este congreso aún.
              </p>
            )}
          </div>
        )}

        {activeTab === "finanzas" && (
          <FinancialDashboardTab congressId={id} congress={congress} />
        )}

        {activeTab === "papers" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Call for Papers (CFP) · Convocatoria Científica
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Revisión y dictamen de artículos. Al aprobarse un artículo, el autor recibe automáticamente la tarifa preferencial de Ponente ($80).
                </p>
              </div>
              <button
                type="button"
                onClick={loadPapers}
                disabled={loadingPapers}
                className="self-start sm:self-auto px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] rounded-lg transition border border-black/[0.08] dark:border-white/[0.08] cursor-pointer"
              >
                Actualizar Lista
              </button>
            </div>

            {loadingPapers ? (
              <div className="flex items-center justify-center py-12 text-center">
                <div className="w-6 h-6 border-2 border-[#00345e] border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-xs text-zinc-400">Cargando artículos científicos...</span>
              </div>
            ) : papers.length > 0 ? (
              <>
                {/* Vista Móvil (< 640px): Tarjetas Apiladas */}
                <div className="space-y-3 sm:hidden">
                  {papers.map((p) => {
                    const pdfUrl = p.file_url ? resolveImageUrl(p.file_url) : "";
                    const dateStr = p.submitted_at
                      ? new Date(p.submitted_at).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Reciente";

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50/40 dark:bg-white/[0.02] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-zinc-400">
                              Paper #{p.id} · {dateStr}
                            </span>
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                              {p.title}
                            </h4>
                          </div>
                          <div className="shrink-0">{renderPaperStatusBadge(p.status)}</div>
                        </div>

                        <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-300">
                          <p>
                            <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                              Eje Temático:
                            </span>{" "}
                            {p.track || "General"}
                          </p>
                          {(p.author_name || p.author_email) && (
                            <p>
                              <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                                Autor:
                              </span>{" "}
                              {p.author_name || p.author_email}
                            </p>
                          )}
                          {p.keywords && (
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                              Palabras clave: {p.keywords}
                            </p>
                          )}
                        </div>

                        {p.abstract && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 bg-zinc-100/60 dark:bg-zinc-800/40 p-2.5 rounded-lg italic">
                            "{p.abstract}"
                          </p>
                        )}

                        {p.reviewer_comments && (
                          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                            <span className="font-semibold">Dictamen:</span> {p.reviewer_comments}
                          </div>
                        )}

                        <div className="pt-2 flex flex-col gap-2">
                          {pdfUrl && (
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold text-[#00345e] dark:text-blue-300 bg-[#00345e]/10 dark:bg-blue-900/30 hover:bg-[#00345e]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <DocumentTextIcon className="w-4 h-4" />
                              <span>Ver PDF del Paper</span>
                              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenPaperReview(p)}
                            className="w-full min-h-[44px] px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#00345e] hover:bg-[#002747] transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                          >
                            <DocumentCheckIcon className="w-4 h-4" />
                            <span>Dictaminar Paper</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vista Escritorio (>= 640px): Tabla Estructurada */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-black/[0.06] dark:border-white/[0.08] text-zinc-500 dark:text-zinc-400">
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px] w-14">
                          ID
                        </th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px]">
                          Artículo Científico & Eje
                        </th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px]">
                          Autor
                        </th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px] w-28">
                          Fecha
                        </th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px] text-center w-28">
                          Estado
                        </th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px] text-center w-28">
                          Documento
                        </th>
                        <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[10px] text-right w-36">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                      {papers.map((p) => {
                        const pdfUrl = p.file_url ? resolveImageUrl(p.file_url) : "";
                        const dateStr = p.submitted_at
                          ? new Date(p.submitted_at).toLocaleDateString("es-EC", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Reciente";

                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="py-3 px-3 font-mono text-zinc-400 text-[11px]">
                              #{p.id}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {p.title}
                              </div>
                              <div className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-2 mt-0.5">
                                <span className="inline-flex items-center gap-1 font-medium text-[#00345e] dark:text-blue-400">
                                  <TagIcon className="w-3 h-3" />
                                  {p.track || "General"}
                                </span>
                                {p.keywords && <span>· {p.keywords}</span>}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300">
                              <div className="font-medium">
                                {p.author_name || `Usuario #${p.id_user_platform || "—"}`}
                              </div>
                              {p.author_email && (
                                <div className="text-[11px] font-mono text-zinc-400">
                                  {p.author_email}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                              {dateStr}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {renderPaperStatusBadge(p.status)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {pdfUrl ? (
                                <a
                                  href={pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00345e] dark:text-blue-300 hover:underline"
                                >
                                  <DocumentTextIcon className="w-3.5 h-3.5" />
                                  <span>Ver PDF</span>
                                </a>
                              ) : (
                                <span className="text-zinc-400 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleOpenPaperReview(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-[#00345e] hover:bg-[#002747] rounded-lg transition cursor-pointer min-h-[36px]"
                              >
                                <DocumentCheckIcon className="w-3.5 h-3.5" />
                                <span>Dictaminar Paper</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="p-8 text-center space-y-2">
                <DocumentTextIcon className="w-10 h-10 mx-auto text-zinc-400 opacity-60" />
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  No se han recibido postulaciones de artículos científicos aún
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Los artículos enviados por los participantes a través del portal público CTT-WEB aparecerán aquí para revisión del comité editorial.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <ValidatePaymentModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        enrollment={selectedEnrollment}
        onStatusUpdated={handleStatusUpdated}
      />

      <AttendanceScannerModal
        isOpen={isAttendanceModalOpen}
        onClose={() => {
          setIsAttendanceModalOpen(false);
          setActiveSessionForScanner(null);
        }}
        congressId={id}
        sessions={sessions}
        selectedSession={activeSessionForScanner}
      />

      <PaperReviewModal
        isOpen={isPaperReviewModalOpen}
        onClose={() => {
          setIsPaperReviewModalOpen(false);
          setSelectedPaperForReview(null);
        }}
        paper={selectedPaperForReview}
        congressId={id}
        onSuccess={handlePaperReviewed}
      />
    </div>
  );
}

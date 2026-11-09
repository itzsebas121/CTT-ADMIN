import { useState } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { updateEnrollmentStatus } from "../../api/enrolled_users";
import { resolveImageUrl } from "../../utils/helpers";
import { toast } from "react-toastify";

export default function ValidatePaymentModal({
  isOpen,
  onClose,
  enrollment,
  onStatusUpdated,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !enrollment) return null;

  const receiptUrl = enrollment.payment_order_url
    ? resolveImageUrl(enrollment.payment_order_url)
    : "";

  const isPdf =
    receiptUrl.toLowerCase().endsWith(".pdf") ||
    receiptUrl.toLowerCase().includes("/pdf/");

  const handleUpdate = async (newStatus, label) => {
    try {
      setLoading(true);
      await updateEnrollmentStatus(enrollment.id, newStatus);
      toast.success(`Inscripción #${enrollment.id} actualizada a: ${label}`);
      if (onStatusUpdated) {
        onStatusUpdated(enrollment.id, newStatus);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || "Error al actualizar estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#16161a] rounded-xl w-full max-w-3xl p-5 sm:p-6 shadow-2xl border border-black/[0.08] dark:border-white/[0.08] transition-colors max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera limpia y directa */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Validación de Comprobante de Pago
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Inscripción #{enrollment.id} · {enrollment.user_name || "Participante"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido en 2 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 overflow-y-auto flex-1">
          {/* Columna Izquierda: Visor del Comprobante */}
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                Comprobante Adjunto
              </span>
              {receiptUrl && (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#00345e] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Abrir original</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="flex-1 min-h-[260px] rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-zinc-50 dark:bg-black/20 overflow-hidden flex items-center justify-center p-2">
              {!receiptUrl ? (
                <div className="text-center p-4">
                  <DocumentTextIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs text-zinc-400 font-medium">
                    El participante aún no ha subido el comprobante bancario.
                  </p>
                </div>
              ) : isPdf ? (
                <iframe
                  src={receiptUrl}
                  title="Comprobante PDF"
                  className="w-full h-full min-h-[300px] rounded border-0"
                />
              ) : (
                <img
                  src={receiptUrl}
                  alt="Comprobante de Pago"
                  className="max-h-[320px] max-w-full object-contain rounded shadow-2xs"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* Columna Derecha: Datos del Estudiante y Facturación SRI */}
          <div className="space-y-3.5 text-xs">
            {/* Tarifa y Estado Actual */}
            <div className="p-3 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Tarifa / Rol:</span>
                <span className="font-bold text-zinc-900 dark:text-white uppercase">
                  {enrollment.tariff_type || "General"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Monto Esperado:</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  ${Number(enrollment.amount || 0).toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Estado Actual:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {enrollment.status}
                </span>
              </div>
            </div>

            {/* Datos Personales */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#00345e] dark:text-blue-400" />
                <span>Datos del Participante</span>
              </p>
              <div className="p-2.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] space-y-1 text-[11px]">
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Nombre:</strong>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">{enrollment.user_name}</span>
                </p>
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Correo:</strong>{" "}
                  <span className="font-mono text-zinc-600 dark:text-zinc-400">{enrollment.user_email}</span>
                </p>
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Teléfono:</strong>{" "}
                  <span className="font-mono text-zinc-600 dark:text-zinc-400">{enrollment.user_cellphone || "—"}</span>
                </p>
              </div>
            </div>

            {/* Datos de Facturación SRI */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-3.5 h-3.5 text-[#00345e] dark:text-blue-400" />
                <span>Datos de Facturación (SRI)</span>
              </p>
              <div className="p-2.5 rounded-lg border border-black/[0.05] dark:border-white/[0.06] space-y-1 text-[11px]">
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Cédula / RUC:</strong>{" "}
                  <span className="font-mono text-zinc-600 dark:text-zinc-400">
                    {enrollment.billing_identification || enrollment.user_identification || "Consumidor Final"}
                  </span>
                </p>
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Razón Social:</strong>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {enrollment.billing_name || enrollment.user_name}
                  </span>
                </p>
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Dirección:</strong>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {enrollment.billing_address || "Ambato, Ecuador"}
                  </span>
                </p>
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Correo Factura:</strong>{" "}
                  <span className="font-mono text-zinc-600 dark:text-zinc-400">
                    {enrollment.billing_email || enrollment.user_email}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Acciones */}
        <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleUpdate("INTERESADO", "Rechazado (Pendiente comprobante)")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/40 transition cursor-pointer disabled:opacity-50"
            >
              <XCircleIcon className="w-4 h-4" />
              <span>Rechazar</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleUpdate("FACTURADO", "Facturado")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#00345e] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/70 rounded-lg border border-blue-200 dark:border-blue-900/40 transition cursor-pointer disabled:opacity-50"
            >
              <DocumentCheckIcon className="w-4 h-4" />
              <span>Marcar Facturado</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleUpdate("PAGADO", "Aprobado / Pagado")}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-2xs transition cursor-pointer disabled:opacity-50 border-0"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span>Aprobar Pago</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


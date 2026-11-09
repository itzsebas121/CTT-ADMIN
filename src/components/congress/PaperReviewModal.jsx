import { useState, useEffect } from "react";
import {
  XMarkIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import api from "../../api/api";
import { resolveImageUrl } from "../../utils/helpers";
import { toast } from "react-toastify";

export default function PaperReviewModal({
  isOpen,
  onClose,
  paper,
  congressId,
  onSuccess,
}) {
  const [status, setStatus] = useState("APROBADO");
  const [reviewerComments, setReviewerComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paper) {
      setStatus(
        paper.status === "APROBADO" || paper.status === "RECHAZADO"
          ? paper.status
          : "APROBADO"
      );
      setReviewerComments(paper.reviewer_comments || "");
    }
  }, [paper, isOpen]);

  if (!isOpen || !paper) return null;

  const pdfUrl = paper.file_url ? resolveImageUrl(paper.file_url) : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!congressId || !paper.id) {
      toast.error("Datos incompletos para dictaminar el artículo.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        status,
        reviewer_comments: reviewerComments.trim(),
      };

      const res = await api.put(
        `/congresses/${congressId}/papers/${paper.id}/review`,
        payload
      );

      toast.success(
        `Artículo #${paper.id} dictaminado como: ${
          status === "APROBADO" ? "Aprobado (Ponente)" : "Rechazado"
        }`
      );

      if (onSuccess) {
        onSuccess(res?.data || { ...paper, ...payload });
      }
      onClose();
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Error al procesar dictamen del artículo";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#16161a] rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] shadow-2xl border border-black/[0.08] dark:border-white/[0.08] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra táctil para Bottom Sheet en smartphone */}
        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Encabezado limpio y directo (Cero badges decorativos) */}
        <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <DocumentCheckIcon className="w-5 h-5 text-[#00345e] dark:text-blue-400 shrink-0" />
              <span>Dictaminar Artículo Científico (CFP)</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Evaluación académica y asignación arancelaria para ponentes
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

        {/* Contenido con scroll */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Metadatos del Paper */}
          <div className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02] space-y-3">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Paper #{paper.id} · Eje: {paper.track || "General"}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white mt-1 leading-snug">
                {paper.title}
              </h3>
            </div>

            {/* Autor y Palabras clave */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
              {(paper.author_name || paper.author_email) && (
                <div className="flex items-center gap-1.5 font-medium">
                  <UserIcon className="w-3.5 h-3.5 text-[#00345e] dark:text-blue-400" />
                  <span>{paper.author_name || paper.author_email}</span>
                </div>
              )}
              {paper.keywords && (
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <TagIcon className="w-3.5 h-3.5" />
                  <span>{paper.keywords}</span>
                </div>
              )}
            </div>

            {/* Resumen / Abstract */}
            {paper.abstract && (
              <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Resumen / Abstract:
                </p>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed max-h-32 overflow-y-auto">
                  {paper.abstract}
                </p>
              </div>
            )}

            {/* Enlace al Documento PDF */}
            {pdfUrl && (
              <div className="pt-2 flex items-center justify-between">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#00345e] dark:text-blue-400 bg-[#00345e]/10 dark:bg-blue-950/40 hover:bg-[#00345e]/20 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Abrir Documento PDF del Artículo</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Aviso Mandatorio de Asignación de Tarifa Ponente */}
          <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <InformationCircleIcon className="w-5 h-5 text-[#00345e] dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Regla de Acreditación Arancelaria:</p>
              <p className="leading-relaxed">
                Al aprobarse, el autor recibirá automáticamente la tarifa preferencial de Ponente ($80).
              </p>
            </div>
          </div>

          {/* Selección de Decisión / Dictamen */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Resolución del Comité Editorial:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setStatus("APROBADO")}
                className={`min-h-[44px] p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  status === "APROBADO"
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                    : "bg-zinc-50 dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Aprobar Artículo</p>
                    <p className="text-[11px] opacity-80">Tarifa Ponente ($80)</p>
                  </div>
                </div>
                {status === "APROBADO" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setStatus("RECHAZADO")}
                className={`min-h-[44px] p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  status === "RECHAZADO"
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-300 ring-2 ring-rose-500/20"
                    : "bg-zinc-50 dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:border-rose-500/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <XCircleIcon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Rechazar Artículo</p>
                    <p className="text-[11px] opacity-80">No cumple directrices</p>
                  </div>
                </div>
                {status === "RECHAZADO" && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Observaciones y Retroalimentación */}
          <div className="space-y-1.5">
            <label
              htmlFor="paper-reviewer-comments"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Comentarios y Observaciones del Revisor (visibles para el autor)
            </label>
            <textarea
              id="paper-reviewer-comments"
              rows={3}
              value={reviewerComments}
              onChange={(e) => setReviewerComments(e.target.value)}
              placeholder="Escriba las observaciones del dictamen, sugerencias técnicas o motivos de la resolución..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-[#00345e] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Botones de acción ergonómicos */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#00345e] hover:bg-[#002747] active:bg-[#001f38] transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando Dictamen...</span>
                </>
              ) : (
                <span>Confirmar Dictamen</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

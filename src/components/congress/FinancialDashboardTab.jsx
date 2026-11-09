import { useState, useEffect, useCallback } from "react";
import {
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MicrophoneIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useDashboardTheme } from "../../context/DashboardThemeContext";

export default function FinancialDashboardTab({ congressId, congress }) {
  const { isDark } = useDashboardTheme();
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);
  const [isSyncingMoodle, setIsSyncingMoodle] = useState(false);

  const loadFinancialData = useCallback(async () => {
    if (!congressId) return;
    try {
      setLoading(true);
      setError(null);
      let res;
      try {
        res = await api.get(`/congresses/${congressId}/financial-summary`);
      } catch (firstErr) {
        if (firstErr.response?.status === 404) {
          res = await api.get(`/congresses-new/${congressId}/financial-summary`);
        } else {
          throw firstErr;
        }
      }
      setFinancialData(res.data);
    } catch (err) {
      console.error("Error al cargar resumen financiero:", err);
      setError(
        err.response?.data?.detail ||
          "No se pudo cargar el resumen financiero del congreso."
      );
    } finally {
      setLoading(false);
    }
  }, [congressId]);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  // 1-Click Descarga Nómina Moodle CSV
  const handleDownloadMoodleCsv = async () => {
    try {
      setIsDownloadingCsv(true);
      let res;
      try {
        res = await api.get(`/congresses/${congressId}/export/moodle-csv`, {
          responseType: "blob",
        });
      } catch (firstErr) {
        if (firstErr.response?.status === 404) {
          res = await api.get(
            `/congresses-new/${congressId}/export/moodle-csv`,
            {
              responseType: "blob",
            }
          );
        } else {
          throw firstErr;
        }
      }

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `moodle_enrollments_congreso_${congressId}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Nómina Moodle (CSV) descargada exitosamente.");
    } catch (err) {
      console.error("Error al descargar nómina Moodle:", err);
      toast.error(
        err.response?.data?.detail ||
          "Error al descargar la nómina oficial para Moodle LMS."
      );
    } finally {
      setIsDownloadingCsv(false);
    }
  };

  // Sincronización directa vía REST API Moodle
  const handleSyncMoodle = async () => {
    try {
      setIsSyncingMoodle(true);
      let res;
      try {
        res = await api.post(`/congresses/${congressId}/sync/moodle`);
      } catch (firstErr) {
        if (firstErr.response?.status === 404) {
          try {
            res = await api.post(`/congresses-new/${congressId}/sync/moodle`);
          } catch (secErr) {
            if (secErr.response?.status === 404) {
              res = await api.post(`/congresses/${congressId}/moodle/sync`);
            } else {
              throw secErr;
            }
          }
        } else {
          throw firstErr;
        }
      }

      toast.success(
        res.data?.message ||
          "Sincronización con Moodle LMS completada satisfactoriamente."
      );
    } catch (err) {
      console.error("Error al sincronizar con Moodle:", err);
      if (
        err.response?.status === 501 ||
        err.response?.status === 404 ||
        err.response?.status === 400
      ) {
        toast.info(
          err.response?.data?.detail ||
            "Servidor Moodle: Token API institucional no configurado en entorno. Utilice la exportación oficial en CSV para sincronización masiva."
        );
      } else {
        toast.error(
          err.response?.data?.detail ||
            "Error al intentar sincronizar automáticamente con Moodle LMS."
        );
      }
    } finally {
      setIsSyncingMoodle(false);
    }
  };

  // Cálculos y normalización de métricas
  const totalRevenue = Number(financialData?.total_revenue || 0);
  const totalBudget = Number(
    financialData?.total_budget ||
      (congress?.cupo_maximo ? congress.cupo_maximo * 50 : 5000)
  );
  const conversionRate = Number(financialData?.conversion_rate || 0);

  // Desglose de tarifas (Estudiante UTA $20, Profesional $50, Ponente $80)
  const breakdown = financialData?.tariffs_breakdown || {};

  const estudianteRaw =
    breakdown.estudiante_uta || breakdown.estudiante || 0;
  const estudianteAmount =
    typeof estudianteRaw === "object"
      ? Number(estudianteRaw.amount || estudianteRaw.total || 0)
      : Number(estudianteRaw || 0);
  const estudianteCount =
    typeof estudianteRaw === "object" && estudianteRaw.count !== undefined
      ? Number(estudianteRaw.count)
      : Math.round(estudianteAmount / 20);

  const profesionalRaw = breakdown.profesional || 0;
  const profesionalAmount =
    typeof profesionalRaw === "object"
      ? Number(profesionalRaw.amount || profesionalRaw.total || 0)
      : Number(profesionalRaw || 0);
  const profesionalCount =
    typeof profesionalRaw === "object" && profesionalRaw.count !== undefined
      ? Number(profesionalRaw.count)
      : Math.round(profesionalAmount / 50);

  const ponenteRaw = breakdown.ponente || 0;
  const ponenteAmount =
    typeof ponenteRaw === "object"
      ? Number(ponenteRaw.amount || ponenteRaw.total || 0)
      : Number(ponenteRaw || 0);
  const ponenteCount =
    typeof ponenteRaw === "object" && ponenteRaw.count !== undefined
      ? Number(ponenteRaw.count)
      : Math.round(ponenteAmount / 80);

  const budgetProgress =
    totalBudget > 0 ? Math.min(100, (totalRevenue / totalBudget) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00345e] dark:border-blue-400 border-t-transparent" />
        <p className="text-xs font-semibold text-[#00345e] dark:text-blue-400">
          Cargando métricas financieras y estado LMS...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado Directo y Limpio (Sin cápsulas ni adornos superficiales según AGENTS.md) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
            Resumen Financiero y LMS
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Métricas de recaudación institucional, desglose de aranceles educativos y sincronización académica con Moodle LMS.
          </p>
        </div>

        <button
          type="button"
          onClick={loadFinancialData}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer min-h-[44px] ${
            isDark
              ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-white/10"
              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
          }`}
          title="Actualizar métricas financieras"
        >
          <ArrowPathIcon className="w-4 h-4 text-zinc-500" />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadFinancialData}
            className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer ml-3"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Grid de 5 Tarjetas KPI Responsivas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Recaudado / Balance vs Meta */}
        <div
          className={`sm:col-span-2 lg:col-span-2 p-4 sm:p-5 rounded-xl border transition-all ${
            isDark
              ? "bg-zinc-900/50 border-white/[0.08]"
              : "bg-white border-black/[0.08] shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Recaudado
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#00345e]/10 dark:bg-blue-400/10 text-[#00345e] dark:text-blue-300 flex items-center justify-center">
              <BanknotesIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-mono">
              ${totalRevenue.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              USD
            </span>
          </div>

          {/* Barra de progreso balance vs meta */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                Balance vs Meta Institucional
              </span>
              <span className="font-mono text-zinc-900 dark:text-white font-semibold">
                {budgetProgress.toFixed(1)}% (${totalBudget.toLocaleString("es-EC", { minimumFractionDigits: 2 })} meta)
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#00345e] dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, budgetProgress))}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Tarifa Estudiante UTA ($20) */}
        <div
          className={`p-4 sm:p-5 rounded-xl border transition-all ${
            isDark
              ? "bg-zinc-900/50 border-white/[0.08]"
              : "bg-white border-black/[0.08] shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Estudiante UTA ($20)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <AcademicCapIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-mono">
              ${estudianteAmount.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {estudianteCount}
              </span>{" "}
              inscritos confirmados
            </p>
          </div>
        </div>

        {/* KPI 3: Tarifa Profesional ($50) */}
        <div
          className={`p-4 sm:p-5 rounded-xl border transition-all ${
            isDark
              ? "bg-zinc-900/50 border-white/[0.08]"
              : "bg-white border-black/[0.08] shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Profesional ($50)
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BriefcaseIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-mono">
              ${profesionalAmount.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                {profesionalCount}
              </span>{" "}
              inscritos confirmados
            </p>
          </div>
        </div>

        {/* KPI 4: Tarifa Ponente ($80) */}
        <div
          className={`p-4 sm:p-5 rounded-xl border transition-all ${
            isDark
              ? "bg-zinc-900/50 border-white/[0.08]"
              : "bg-white border-black/[0.08] shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Tarifa Ponente ($80)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MicrophoneIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-mono">
              ${ponenteAmount.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                {ponenteCount}
              </span>{" "}
              ponentes aprobados
            </p>
          </div>
        </div>

        {/* KPI 5: Tasa de Conversión */}
        <div
          className={`sm:col-span-2 lg:col-span-3 p-4 sm:p-5 rounded-xl border transition-all flex flex-col justify-between ${
            isDark
              ? "bg-zinc-900/50 border-white/[0.08]"
              : "bg-white border-black/[0.08] shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                Tasa de Conversión
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
                Porcentaje de postulantes e interesados con orden generada convertidos a estado pagado o facturado.
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#00345e] dark:text-blue-300 flex items-center justify-center shrink-0">
              <ChartBarIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00345e] dark:text-blue-400 font-mono">
              {conversionRate.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
              Efectividad de Matrícula
            </span>
          </div>
        </div>
      </div>

      {/* Moodle LMS Exporter Section */}
      <div
        className={`p-5 sm:p-6 rounded-xl border transition-all ${
          isDark
            ? "bg-zinc-900/30 border-white/[0.08]"
            : "bg-zinc-50/80 border-black/[0.08]"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              Exportador y Sincronización Moodle LMS
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Descargue la nómina de estudiantes matriculados en formato oficial CSV (username, firstname, lastname, email, course1, role1) para matriculación por lotes en el campus virtual o ejecute la sincronización directa vía API institucional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Botón 1-Click Descargar Nómina Moodle CSV */}
            <button
              type="button"
              onClick={handleDownloadMoodleCsv}
              disabled={isDownloadingCsv}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00345e] hover:bg-[#002747] text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer min-h-[44px] disabled:opacity-50"
              title="Descargar nómina de matriculados en formato CSV oficial para Moodle"
            >
              {isDownloadingCsv ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowDownTrayIcon className="w-4 h-4" />
              )}
              <span>Descargar Nómina Moodle (CSV)</span>
            </button>

            {/* Botón Sincronizar con Moodle API */}
            <button
              type="button"
              onClick={handleSyncMoodle}
              disabled={isSyncingMoodle}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer min-h-[44px] disabled:opacity-50 ${
                isDark
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-white/10"
                  : "bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300 shadow-2xs"
              }`}
              title="Sincronizar usuarios matriculados directamente mediante la API de Moodle"
            >
              {isSyncingMoodle ? (
                <div className="w-4 h-4 border-2 border-[#00345e] dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CloudArrowUpIcon className="w-4 h-4 text-[#00345e] dark:text-blue-400" />
              )}
              <span>Sincronizar con Moodle API</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



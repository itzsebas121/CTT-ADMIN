import { useState, useEffect } from "react";
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
} from "@heroicons/react/24/outline";
import {
  getCongressById,
  getCongressSessions,
  getCongressSponsorships,
  getCongressStatistics,
} from "../../api/congresses";
import { getCongressEnrolledUsers } from "../../api/enrolled_users";
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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general"); // "general" | "cronograma" | "patrocinadores" | "inscritos"

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

        <button
          onClick={() => navigate(`/dashboard/congresos/${id}/editar`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00345e] hover:bg-[#002747] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer border-0"
        >
          <PencilSquareIcon className="w-3.5 h-3.5" />
          <span>Editar Congreso</span>
        </button>
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
            {sessions.length > 0 ? (
              sessions.map((sess, idx) => (
                <div
                  key={sess.id_sesion || idx}
                  className="p-3 rounded-lg border border-black/[0.05] dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">
                      {sess.titulo_sesion || "Sesión académica"}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {sess.lugar || "Auditorio FISEI"} · Jornada {sess.jornada || "mañana"}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300 shrink-0">
                    {sess.fecha} ({sess.hora_inicio} - {sess.hora_fin})
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
                      <th className="py-2.5 px-3 text-right">Estado</th>
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
                          <td className="py-2.5 px-3 text-right">
                            {statusBadge}
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
      </div>
    </div>
  );
}

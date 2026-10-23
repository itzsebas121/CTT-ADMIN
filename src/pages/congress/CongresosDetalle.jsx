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
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  getCongressById,
  getCongressSessions,
  getCongressSponsorships,
  getCongressStatistics,
} from "../../api/congresses";
import { toast } from "react-toastify";

export default function CongresosDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [congress, setCongress] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCongressById(id);
        const c = data.congress || data;
        setCongress(c);

        // Si ya vienen sessions o sponsors en data
        if (Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        } else {
          try {
            const sess = await getCongressSessions(id);
            setSessions(Array.isArray(sess) ? sess : sess.sessions || []);
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

        // Estadísticas opcionales
        try {
          const st = await getCongressStatistics(id);
          setStats(st);
        } catch {
          setStats(null);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-primary text-base font-medium">Cargando detalles del congreso...</p>
        </div>
      </div>
    );
  }

  if (error || !congress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {error || "Congreso no encontrado"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            No se pudo encontrar la información del evento solicitado.
          </p>
          <button
            onClick={() => navigate("/dashboard/congresos")}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Volver a la lista de congresos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard/congresos")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver a Congresos
          </button>

          <button
            onClick={() => navigate(`/dashboard/congresos/${id}/editar`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Editar Congreso
          </button>
        </div>

        {/* Tarjeta Principal Hero */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Portada / Póster */}
            <div className="lg:col-span-5 bg-gray-900 relative min-h-[280px] lg:min-h-[380px] flex items-center justify-center overflow-hidden">
              {congress.poster_cover_url ? (
                <img
                  src={congress.poster_cover_url}
                  alt={congress.nombre}
                  className="w-full h-full object-cover max-h-[420px]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-gray-500 text-center p-6">
                  <CalendarDaysIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin portada disponible</p>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-wide">
                  Edición {congress.edicion}
                </span>
                <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold tracking-wide shadow-sm">
                  {congress.anio}
                </span>
              </div>
            </div>

            {/* Información del encabezado */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    <SparklesIcon className="w-3.5 h-3.5" /> Evento Académico
                  </span>
                  <span className="text-xs text-gray-400">ID #{congress.id}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {congress.nombre}
                </h1>

                {/* Fechas */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Inauguración</p>
                      <p className="font-semibold text-gray-800">{congress.fecha_inicio || "Por definir"}</p>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Clausura</p>
                      <p className="font-semibold text-gray-800">{congress.fecha_fin || "Por definir"}</p>
                    </div>
                  </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <p className="text-xl font-bold text-gray-900">{sessions.length}</p>
                    <p className="text-xs text-gray-500 font-medium">Sesiones</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <p className="text-xl font-bold text-gray-900">{sponsors.length}</p>
                    <p className="text-xs text-gray-500 font-medium">Auspiciantes</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <p className="text-xl font-bold text-gray-900">
                      {stats?.total_inscriptions || stats?.inscriptions_count || 0}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Inscritos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pestañas de contenido */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 sm:px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("general")}
                className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Descripción General
              </button>
              <button
                onClick={() => setActiveTab("cronograma")}
                className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "cronograma"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Cronograma ({sessions.length})
              </button>
              <button
                onClick={() => setActiveTab("patrocinadores")}
                className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "patrocinadores"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Patrocinadores ({sponsors.length})
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 sm:p-8">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Acerca de este Congreso</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {congress.descripcion_general || "No se ha proporcionado una descripción detallada."}
              </p>
            </div>
          )}

          {activeTab === "cronograma" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Sesiones y Ponencias</h3>
                <span className="text-xs text-gray-400 font-medium">
                  {sessions.length} programadas
                </span>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-base font-semibold">Sin sesiones programadas</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Puedes agregar sesiones editando el congreso.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((sess, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-md">
                          {sess.jornada || "Sesión"}
                        </span>
                        <div className="flex items-center text-xs text-gray-500 font-mono gap-1">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span>{sess.hora_inicio} - {sess.hora_fin}</span>
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-gray-900">
                        {sess.titulo_sesion}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200/60">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                          {sess.fecha}
                        </span>
                        {sess.lugar && (
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            {sess.lugar}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "patrocinadores" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Auspiciantes y Patrocinadores</h3>
                <span className="text-xs text-gray-400 font-medium">
                  {sponsors.length} entidades
                </span>
              </div>

              {sponsors.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BuildingOffice2Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-base font-semibold">Sin patrocinadores asignados</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Puedes vincular empresas colaboradoras desde la edición del congreso.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {sponsors.map((sp, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">
                          {sp.categoria || "Patrocinador"}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">
                          {sp.sponsor?.nombre || `Patrocinador #${sp.id_sponsor}`}
                        </p>
                        {sp.aporte && (
                          <p className="text-xs text-gray-400 mt-0.5">Aporte: ${sp.aporte}</p>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-bold">
                        {sp.categoria ? sp.categoria[0] : "P"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

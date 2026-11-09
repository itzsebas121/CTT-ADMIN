import { useEffect, useState, useCallback } from "react";
import { EyeIcon, PencilSquareIcon, TrashIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Table, ConfirmDialog } from "../components/ui";
import { TablePageLayout } from "../components/layout";
import {
  getCongresses,
  deleteCongress,
  getCongressYears,
} from "../api/congresses";
import { toast } from "react-toastify";

const headers = ["ID", "Portada", "Congreso", "Edición", "Año", "Fechas", "Acciones"];

export default function Congresos() {
  const [congresses, setCongresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [yearFilter, setYearFilter] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCongress, setDeletingCongress] = useState(null);

  const navigate = useNavigate();

  // Cargar años disponibles para filtros
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await getCongressYears();
        if (Array.isArray(years) && years.length > 0) {
          setAvailableYears(years.map(String));
        } else {
          // Años por defecto si la base aún no tiene años registrados
          const currentYear = new Date().getFullYear();
          setAvailableYears([
            String(currentYear),
            String(currentYear + 1),
            String(currentYear - 1),
          ]);
        }
      } catch {
        const currentYear = new Date().getFullYear();
        setAvailableYears([String(currentYear), String(currentYear + 1)]);
      }
    };
    fetchYears();
  }, []);

  const loadCongresses = useCallback(
    async (
      pageRequested = 1,
      pageSizeRequested = pageSize,
      year = yearFilter,
      query = searchQuery
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getCongresses({
          page: pageRequested,
          pageSize: pageSizeRequested,
          year: year,
          searchTerm: query,
          orderBy: "fecha_inicio",
          orderDesc: true,
        });

        const list = Array.isArray(response)
          ? response
          : response?.congresses || response?.data?.congresses || response?.data || [];
        const respTotal =
          response?.total ?? (Array.isArray(response) ? response.length : 0);
        const respPageSize = response?.page_size ?? pageSizeRequested;
        const respTotalPages =
          response?.total_pages ??
          Math.max(1, Math.ceil(respTotal / respPageSize));

        const transformed = list.map((c) => ({
          ID: c.id_congreso ?? c.id_congress ?? c.id,
          Portada: (
            <div className="w-14 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-black/[0.08] dark:border-white/10 overflow-hidden flex items-center justify-center shrink-0">
              {c.poster_cover_url && !c.poster_cover_url.includes("example.com") ? (
                <img
                  src={c.poster_cover_url}
                  alt={c.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <CalendarDaysIcon className="w-5 h-5 text-zinc-400" />
              )}
            </div>
          ),
          Congreso: (
            <div className="max-w-xs">
              <span className="font-semibold text-zinc-900 dark:text-white block truncate" title={c.nombre}>
                {c.nombre}
              </span>
              <span
                className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-1 mt-0.5"
                title={c.descripcion_general}
              >
                {c.descripcion_general || "Sin descripción"}
              </span>
            </div>
          ),
          Edición: (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#00345e]/10 dark:bg-blue-400/20 text-[#00345e] dark:text-blue-300">
              {c.edicion || "General"}
            </span>
          ),
          Año: <span className="font-medium text-zinc-700 dark:text-zinc-300">{c.anio}</span>,
          Fechas: (() => {
            const isPast = c.fecha_fin ? new Date(c.fecha_fin + "T23:59:59") < new Date() : false;
            return (
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                <div>{c.fecha_inicio || "Por definir"}</div>
                <div className="text-zinc-400 dark:text-zinc-500">al {c.fecha_fin || "Por definir"}</div>
                {isPast ? (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                    Concluido
                  </span>
                ) : (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    Vigente
                  </span>
                )}
              </div>
            );
          })(),
          Acciones: (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const id = c.id_congreso ?? c.id_congress ?? c.id;
                  if (id) navigate(`/dashboard/congresos/${id}`);
                }}
                className="p-1.5 text-zinc-500 hover:text-[#00345e] dark:hover:text-blue-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
                title="Ver detalles"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const id = c.id_congreso ?? c.id_congress ?? c.id;
                  if (id) navigate(`/dashboard/congresos/${id}/editar`);
                }}
                className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors cursor-pointer"
                title="Editar congreso"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setDeletingCongress({ ...c, _id: c.id_congreso ?? c.id_congress ?? c.id });
                  setShowDeleteConfirm(true);
                }}
                className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                title="Eliminar congreso"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ),
          _original: c,
        }));

        setCongresses(transformed);
        setTotal(respTotal);
        setPage(pageRequested);
        setPageSize(respPageSize);
        setTotalPages(respTotalPages);
      } catch (err) {
        setError(err.message);
        toast.error(`Error al cargar congresos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, yearFilter, searchQuery]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCongresses(1, pageSize, yearFilter, searchQuery);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, yearFilter]);

  const handleFilterChange = (filterColumn, value) => {
    if (filterColumn === "Año") {
      setYearFilter(value === "All" || !value ? null : value);
    }
  };

  const handleDeleteCongress = async () => {
    if (!deletingCongress) return;
    try {
      setLoading(true);
      if (!deletingCongress._id) {
        throw new Error("El congreso no tiene un ID válido.");
      }
      await deleteCongress(deletingCongress._id);
      toast.success("Congreso eliminado exitosamente");
      setShowDeleteConfirm(false);
      setDeletingCongress(null);
      await loadCongresses(page, pageSize, yearFilter, searchQuery);
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const dynamicFilters = {
    ...(availableYears.length > 0 ? { Año: availableYears } : {}),
  };

  return (
    <TablePageLayout
      title="Gestión de Congresos"
      description="Administra el catálogo de congresos, conferencias académicas y eventos tecnológicos"
      action={
        <button
          onClick={() => navigate("/dashboard/congresos/crear")}
          className="inline-flex items-center justify-center px-4 py-2 bg-[#00345e] hover:bg-[#002747] active:bg-[#001f38] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-xs cursor-pointer border-0 gap-1.5"
        >
          <span className="text-base leading-none">+</span>
          <span>Crear Congreso</span>
        </button>
      }
    >
      <div className="mb-4">
        <Table
          headers={headers}
          data={congresses}
          filters={dynamicFilters}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          loading={loading}
          onPageChange={(newPage) =>
            loadCongresses(newPage, pageSize, yearFilter, searchQuery)
          }
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            loadCongresses(1, newSize, yearFilter, searchQuery);
          }}
          onFilterChange={handleFilterChange}
          onSearchChange={(val) => setSearchQuery(val)}
          onReload={() =>
            loadCongresses(page, pageSize, yearFilter, searchQuery)
          }
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2 px-1 mb-4">{error}</div>
      )}

      {/* Diálogo de Confirmación para Eliminar */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingCongress(null);
        }}
        onConfirm={handleDeleteCongress}
        title="¿Eliminar congreso?"
        message={`¿Estás seguro de que deseas eliminar el congreso "${deletingCongress?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </TablePageLayout>
  );
}

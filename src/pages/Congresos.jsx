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
            <div className="w-14 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
              {c.poster_cover_url ? (
                <img
                  src={c.poster_cover_url}
                  alt={c.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          ),
          Congreso: (
            <div className="max-w-xs">
              <span className="font-semibold text-gray-900 block truncate" title={c.nombre}>
                {c.nombre}
              </span>
              <span
                className="text-gray-400 text-xs line-clamp-1 mt-0.5"
                title={c.descripcion_general}
              >
                {c.descripcion_general || "Sin descripción"}
              </span>
            </div>
          ),
          Edición: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              Edición {c.edicion}
            </span>
          ),
          Año: <span className="font-medium text-gray-700">{c.anio}</span>,
          Fechas: (
            <div className="text-xs text-gray-600 font-mono">
              <div>{c.fecha_inicio || "Por definir"}</div>
              <div className="text-gray-400">al {c.fecha_fin || "Por definir"}</div>
            </div>
          ),
          Acciones: (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const id = c.id_congreso ?? c.id_congress ?? c.id;
                  if (id) navigate(`/dashboard/congresos/${id}`);
                }}
                className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Ver detalles"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const id = c.id_congreso ?? c.id_congress ?? c.id;
                  if (id) navigate(`/dashboard/congresos/${id}/editar`);
                }}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar congreso"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setDeletingCongress({ ...c, _id: c.id_congreso ?? c.id_congress ?? c.id });
                  setShowDeleteConfirm(true);
                }}
                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar congreso"
              >
                <TrashIcon className="w-5 h-5" />
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
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Crear Congreso
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

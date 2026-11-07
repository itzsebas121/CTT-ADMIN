import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Table } from "../components/ui";
import { TablePageLayout } from "../components/layout";
import { getEnrolledUsers } from "../api/enrolled_users";
import { getCourseById } from "../api/courses";
import { resolveImageUrl } from "../utils/helpers";
import { useDashboardTheme } from "../context/DashboardThemeContext";

const headers = ["id", "nombre", "email", "celular", "estado", "fecha_inscripcion", "acciones"];

const API_ENROLLMENT_STATUSES = [
  "Interesado",
  "Generada la orden",
  "Pagado",
  "Facturado",
  "Anulado",
];

const filtersConfig = {
  estado: API_ENROLLMENT_STATUSES,
};

export default function Inscritos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course_id } = useParams();
  const { isDark } = useDashboardTheme();

  const parsedCourseId = parseInt(course_id, 10);
  const isValidCourseId = !isNaN(parsedCourseId) && parsedCourseId > 0;

  const [course, setCourse] = useState(location.state?.courseName || "");
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  // Cargar título del curso si no viene por location.state
  useEffect(() => {
    if (isValidCourseId && !course) {
      getCourseById(parsedCourseId)
        .then((data) => {
          if (data?.title) setCourse(data.title);
        })
        .catch(() => {});
    }
  }, [isValidCourseId, parsedCourseId, course]);

  // Cargar lista de estudiantes inscritos
  const loadEnrolledUsers = useCallback(
    async (targetPage = 1, targetPageSize = pageSize, query = searchQuery, status = statusFilter) => {
      if (!isValidCourseId) {
        setLoading(false);
        setError("Identificador de curso no válido.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getEnrolledUsers(
          parsedCourseId,
          targetPage,
          targetPageSize,
          query,
          status
        );

        const enrollments = response?.items || [];
        const transformedUsers = enrollments.map((enrollment) => {
          const formattedDate = enrollment.enrollment_date
            ? new Date(enrollment.enrollment_date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—";

          return {
            id: enrollment.id,
            nombre: (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className={`font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                  {enrollment.user_name || "Sin nombre"}
                </span>
              </div>
            ),
            email: enrollment.user_email || "—",
            celular: enrollment.user_cellphone || "—",
            estado: enrollment.status || "Interesado",
            fecha_inscripcion: formattedDate,
            acciones: (
              <div className="flex items-center justify-end gap-2">
                {enrollment.payment_order_url ? (
                  <a
                    href={resolveImageUrl(enrollment.payment_order_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-8 px-2.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 border text-xs font-medium ${
                      isDark
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-white/10"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border-zinc-200"
                    }`}
                    title="Ver orden o comprobante de pago"
                  >
                    <DocumentTextIcon className="h-4 w-4 text-[#00345e] dark:text-blue-400" />
                    <span>Comprobante</span>
                  </a>
                ) : (
                  <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    Sin comprobante
                  </span>
                )}
              </div>
            ),
          };
        });

        setEnrolledUsers(transformedUsers);

        const respTotal = response?.pagination?.total ?? response?.total ?? 0;
        const respTotalPages = response?.pagination?.total_pages ?? response?.total_pages ?? Math.max(1, Math.ceil(respTotal / targetPageSize));
        setTotal(respTotal);
        setTotalPages(respTotalPages);
        setPage(targetPage);
        setPageSize(targetPageSize);
      } catch (err) {
        setError(err.message || "Error al cargar los estudiantes inscritos.");
      } finally {
        setLoading(false);
      }
    },
    [isValidCourseId, parsedCourseId, pageSize, searchQuery, statusFilter, isDark]
  );

  // Efecto con debounce para búsqueda y cambios de filtro de estado
  useEffect(() => {
    if (!isValidCourseId) return;

    const timer = setTimeout(() => {
      loadEnrolledUsers(1, pageSize, searchQuery, statusFilter);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, isValidCourseId, pageSize]);

  // Manejo de paginación
  const handlePageChange = (newPage) => {
    loadEnrolledUsers(newPage, pageSize, searchQuery, statusFilter);
  };

  const handlePageSizeChange = (newSize) => {
    loadEnrolledUsers(1, newSize, searchQuery, statusFilter);
  };

  // Manejo de búsqueda en tiempo real
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Manejo de filtros por columna
  const handleFilterChange = (column, value) => {
    if (column.toLowerCase() === "estado") {
      const selected = value === "All" || !value ? null : value;
      setStatusFilter(selected);
    }
  };

  const handleReload = () => {
    loadEnrolledUsers(page, pageSize, searchQuery, statusFilter);
  };

  if (!isValidCourseId) {
    return (
      <TablePageLayout
        title="Inscritos"
        description="Identificador de curso no válido"
        action={
          <button
            type="button"
            onClick={() => navigate("/dashboard/cursos")}
            className={`group inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              isDark
                ? "bg-[#16161a] hover:bg-zinc-800 text-zinc-200 hover:text-white border-white/[0.08]"
                : "bg-white hover:bg-zinc-100 text-zinc-800 hover:text-[#00345e] border-zinc-200 shadow-xs"
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4 text-[#00345e] dark:text-blue-400" />
            <span>Volver a Cursos</span>
          </button>
        }
      >
        <div className={`p-8 text-center rounded-xl border ${
          isDark ? "bg-[#16161a] border-white/[0.08]" : "bg-white border-black/[0.08]"
        }`}>
          <p className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
            No se ha especificado un curso válido. Por favor, selecciona un curso del catálogo.
          </p>
        </div>
      </TablePageLayout>
    );
  }

  return (
    <TablePageLayout
      title="Inscritos"
      description={course ? `Estudiantes inscritos en: ${course}` : `Estudiantes inscritos (Curso #${parsedCourseId})`}
      action={
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`group inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
            isDark
              ? "bg-[#16161a] hover:bg-zinc-800 text-zinc-200 hover:text-white border-white/[0.08] hover:border-white/[0.18] shadow-xs"
              : "bg-white hover:bg-zinc-100 text-zinc-800 hover:text-[#00345e] border-zinc-200 hover:border-zinc-300 shadow-xs"
          }`}
          title="Regresar a la página anterior"
        >
          <ArrowLeftIcon className="h-4 w-4 text-[#00345e] dark:text-blue-400 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Volver</span>
        </button>
      }
    >
      <Table
        headers={headers}
        data={enrolledUsers}
        filters={filtersConfig}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        loading={loading}
        loadingContent={loading}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReload={handleReload}
      />
      {error && (
        <div className={`p-3.5 rounded-lg border text-xs sm:text-sm font-medium mt-3 ${
          isDark ? "bg-red-950/40 border-red-800/40 text-red-300" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {error}
        </div>
      )}
    </TablePageLayout>
  );
}

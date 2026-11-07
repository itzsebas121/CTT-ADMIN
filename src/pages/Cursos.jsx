import { useEffect, useState, useMemo } from "react";
import {
  getCourses,
  getCoursesByCategory,
  searchCourses,
} from "../api/courses";
import { EyeIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import { Table } from "../components/ui";
import { TablePageLayout } from "../components/layout";
import { useDashboardTheme } from "../context/DashboardThemeContext";

const headers = ["id", "titulo", "horas", "estado", "acciones"];

const filters = {
  estado: ["Activo", "Cerrado"],
};

export default function Cursos() {
  const [rawCourses, setRawCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categorySelected, setCategorySelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isDark } = useDashboardTheme();
  const navigate = useNavigate();

  const loadCourses = async (
    category = "Todos",
    pageRequested = 1,
    pageSizeRequested = pageSize,
    status = statusFilter,
    query = searchQuery,
  ) => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // Si hay búsqueda, usar el endpoint de búsqueda
      if (query && query.trim().length > 0) {
        response = await searchCourses(
          query.trim(),
          pageRequested,
          pageSizeRequested,
          status,
        );
      } else {
        // Si no hay búsqueda, usar la lógica existente
        response =
          category && category !== "Todos"
            ? await getCoursesByCategory(
              category,
              pageRequested,
              pageSizeRequested,
              status,
            )
            : await getCourses(pageRequested, pageSizeRequested, status);
      }

      // Manejar ambos formatos de respuesta
      const coursesArray = Array.isArray(response)
        ? response
        : response?.courses || [];
      const respTotal =
        response?.total ?? (Array.isArray(response) ? response.length : 0);
      const respPageSize = response?.page_size ?? pageSizeRequested;
      const respTotalPages =
        response?.total_pages ??
        Math.max(1, Math.ceil(respTotal / respPageSize));

      setRawCourses(coursesArray);
      setTotal(respTotal);
      setPage(pageRequested);
      setPageSize(respPageSize);
      setTotalPages(respTotalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const courses = useMemo(() => {
    return rawCourses.map((course) => ({
      titulo: course.title,
      estado: (() => {
        const s = String(course.status || "").toLowerCase();
        if (s === "activo") return "Activo";
        if (s === "inactivo") return "Cerrado";
        return s ? s[0].toUpperCase() + s.slice(1) : "";
      })(),
      horas: course.requirements?.hours?.total?.toString() || "0",
      id: course.id,
      acciones: (
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <button
            type="button"
            onClick={() => course?.id && navigate(`/dashboard/cursos/${course.id}`)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-white/10'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border-zinc-200 shadow-xs'
            }`}
            title="Ver detalles"
            aria-label="Ver detalles"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => course?.id && navigate(`/dashboard/cursos/${course.id}/editar`)}
            className={`h-8 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
              isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border-white/10'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border-zinc-200 shadow-xs'
            }`}
            title="Editar curso"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() =>
              course?.id &&
              navigate(`/dashboard/cursos/${course.id}/inscritos`, {
                state: { courseName: course.title }
              })
            }
            className={`h-8 px-3 text-xs font-semibold text-white rounded-lg transition-all shadow-xs cursor-pointer border-0 ${
              isDark
                ? 'bg-[#00345e] hover:bg-[#004f8c] active:bg-[#002747] border border-blue-400/30'
                : 'bg-[#00345e] hover:bg-[#002747] active:bg-[#001f38]'
            }`}
            title="Ver estudiantes inscritos"
          >
            Inscritos
          </button>
        </div>
      ),
    }));
  }, [rawCourses, isDark, navigate]);

  // Efecto para manejar la búsqueda con debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCourses(
        categorySelected || "Todos",
        1,
        pageSize,
        statusFilter,
        searchQuery,
      );
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleFilterChange = (filterColumn, value) => {
    if (filterColumn === "estado") {
      // Mapear valores de UI a valores de API
      let statusValue = null;
      if (value === "Activo") {
        statusValue = "activo";
      } else if (value === "Cerrado") {
        statusValue = "inactivo";
      }

      setStatusFilter(statusValue);
      // Resetear a página 1 cuando cambia el filtro
      loadCourses(
        categorySelected || "Todos",
        1,
        pageSize,
        statusValue,
        searchQuery,
      );
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleReload = () => {
    loadCourses(
      categorySelected || "Todos",
      page,
      pageSize,
      statusFilter,
      searchQuery
    );
  };

  return (
    <TablePageLayout
      title="Gestión de Cursos"
      description="Administra el catálogo de cursos disponibles"
      action={
        <button
          type="button"
          onClick={() => navigate("/dashboard/cursos/crear/editar")}
          className="h-9 px-3.5 bg-[#00345e] hover:bg-[#002747] active:bg-[#001f38] text-white text-xs font-semibold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
        >
          <span className="text-base leading-none font-bold">+</span>
          <span>Crear Nuevo Curso</span>
        </button>
      }
    >
      <Table
        headers={headers}
        data={courses}
        filters={filters}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        loading={loading}
        onPageChange={(newPage) =>
          loadCourses(
            categorySelected || "Todos",
            newPage,
            pageSize,
            statusFilter,
            searchQuery,
          )
        }
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          loadCourses(
            categorySelected || "Todos",
            1,
            newSize,
            statusFilter,
            searchQuery,
          );
        }}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReload={handleReload}
      />
      {error && <div className="text-red-500 text-sm mt-2 px-1">{error}</div>}
    </TablePageLayout>
  );
}

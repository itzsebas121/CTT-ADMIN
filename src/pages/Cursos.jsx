import { useEffect, useState } from "react";
import {
  getCourses,
  getCoursesByCategory,
  searchCourses,
} from "../api/courses";
import { EyeIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import { Table } from "../components/ui";
import { TablePageLayout } from "../components/layout";
import AOS from "aos";
import "aos/dist/aos.css";

const headers = ["id", "titulo", "horas", "estado", "acciones"];

const filters = {
  estado: ["Activo", "Cerrado"],
};

export default function Cursos() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categorySelected, setCategorySelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        console.log('Courses response:', response);
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

      // Transformar los datos de la API para que coincidan con la estructura esperada por CardCourse
      const transformedCourses = coursesArray.map((course) => ({
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
          <div className="flex gap-2">
            <button onClick={() => navigate(`/dashboard/cursos/${course.id}`)}>
              <EyeIcon className="h-5 w-5 inline-block" />
            </button>
            <button
              onClick={() => navigate(`/dashboard/cursos/${course.id}/editar`)}
            >
              Editar
            </button>
            <button
              onClick={() =>
                navigate(`/dashboard/cursos/${course.id}/inscritos`, {
                  state: { courseName: course.title }
                })
              }
            >
              Inscritos
            </button>
          </div>
        ),
      }));
      setCourses(transformedCourses);
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

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
    AOS.refresh();
    // loadCourses() removed to prevent double fetch since searchQuery effect triggers it
  }, []);

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
          onClick={() => navigate("/dashboard/cursos/crear/editar")}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Crear Nuevo Curso
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

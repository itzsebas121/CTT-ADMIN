import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { Table } from "../components/ui";
import { TablePageLayout } from "../components/layout";
import { getEnrolledUsers, searchEnrolledUsers } from "../api/enrolled_users";
import { getCourseById } from "../api/courses";


const headers = ["id", "Nombre", "email", "Estado", "fecha de inscripcion"];

export default function Inscritos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(location.state?.courseName || "");
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const { course_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Effect to trigger load when debounced query changes
  useEffect(() => {
    if (course_id) {
      loadEnrrolledUsers(course_id, 1, pageSize, debouncedSearchQuery);
    }   
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (course_id) {
      loadEnrrolledUsers(course_id, page, pageSize, debouncedSearchQuery);
    }
  }, [course_id]);

  const loadEnrrolledUsers = async (courseId, currentPage, currentPageSize, query) => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (query && query.trim().length > 0) {
        response = await searchEnrolledUsers(courseId, query);
      } else {
        response = await getEnrolledUsers(courseId);
      }
      const enrollments = response.enrollments || [];
      const transformedCourses = enrollments.map((enrollment) => ({
        id: enrollment.id,
        Nombre: enrollment.user_name,
        email: enrollment.user_email,
        Estado: enrollment.status,
        "fecha de inscripcion": new Date(enrollment.enrollment_date).toLocaleDateString(),
      }));
      setEnrolledUsers(transformedCourses);
      setTotal(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / currentPageSize));
      setCourse(course || "");

    } catch (err) {
      setError(err.message || "Error al cargar los inscritos.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadEnrrolledUsers(course_id, newPage, pageSize, debouncedSearchQuery);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
    loadEnrrolledUsers(course_id, 1, newSize, debouncedSearchQuery);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Debounce effect will handle the load
  };
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReload = () => {
    loadEnrrolledUsers(course_id, page, pageSize, debouncedSearchQuery);
  };

  return (
    <TablePageLayout
      title="Inscritos"
      description={course ? `Estudiantes inscritos en: ${course}` : "Lista de estudiantes inscritos"}
      action={
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 text-gray-400" />
          Volver
        </button>
      }
    >
      <Table
        headers={headers}
        data={enrolledUsers}
        filters={filters}
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
      {error && <div className="text-red-500 text-sm mt-2 px-1">{error}</div>}
    </TablePageLayout>
  );
}

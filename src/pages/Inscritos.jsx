import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { Table } from "../components/ui";
import { getEnrolledUsers } from "../api/enrolled_users";
import { getCourseById } from "../api/courses";


const headers = ["id", "Nombre", "email","Estado", "fecha de inscripcion"];

export default function Inscritos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(location.state?.courseName || "");
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const {course_id} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (course_id){
        loadEnrrolledUsers(course_id, page, pageSize, searchQuery);
    }
  },[]);

  const loadEnrrolledUsers = async (courseId, currentPage, currentPageSize) => {
    try {
        setLoading(true);
        setError(null);
        const response = await getEnrolledUsers(courseId);
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

    }catch (err) {
        setError(err.message || "Error al cargar los inscritos.");
    } finally {
        setLoading(false);
    }
  };

    const handlePageChange = (newPage) => {
    setPage(newPage);
    loadEnrrolledUsers(course_id,newPage, pageSize, searchQuery);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
    loadEnrrolledUsers(course_id, 1, newSize, searchQuery);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
    loadEnrrolledUsers(course_id, 1, pageSize, query);
  };
    const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  return (
     <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Inscritos</h1>
        <h3 className="text-2xl font-bold mb-4">{course}</h3>

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
        />
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}

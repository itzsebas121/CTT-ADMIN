import api from "./api";

/**
 * Obtiene la lista paginada y filtrada de usuarios inscritos en un curso.
 * Endpoint: GET /api/v1/enrollments/course/{course_id}
 *
 * @param {number|string} courseId - ID del curso
 * @param {number} [page=1] - Página actual
 * @param {number} [pageSize=10] - Tamaño de página
 * @param {string} [searchTerm=""] - Búsqueda por nombre, email o teléfono
 * @param {string|null} [status=null] - Filtro de estado
 */
export const getEnrolledUsers = async (
  courseId,
  page = 1,
  pageSize = 10,
  searchTerm = "",
  status = null
) => {
  const params = {
    page,
    page_size: pageSize,
  };

  if (searchTerm && searchTerm.trim().length > 0) {
    params.search_term = searchTerm.trim();
  }

  if (status && status !== "All") {
    params.enrollment_status = status;
  }

  const response = await api.get(`/enrollments/course/${courseId}`, { params });
  return response.data;
};

/**
 * Búsqueda delegada que utiliza el endpoint oficial paginado con `search_term`.
 * Mantiene total compatibilidad sin errores 404.
 */
export const searchEnrolledUsers = async (
  courseId,
  query,
  page = 1,
  pageSize = 10,
  status = null
) => {
  return getEnrolledUsers(courseId, page, pageSize, query, status);
};

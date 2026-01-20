import api from "./api";

export const getEnrolledUsers = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/enrollments/course/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

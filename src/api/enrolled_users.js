import api from "./api";

export const getEnrolledUsers = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/enrollments/course/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Enrolled Users Response:", response.data);
  return response.data;
};

export const searchEnrolledUsers = async (courseId, query) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/enrollments/course/${courseId}/search`, {
    params: { query },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

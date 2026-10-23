import api from './api';

const formatApiError = (error, defaultMsg = 'Error en la solicitud') => {
    if (error.code === 'ECONNABORTED') {
        return new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
    }
    if (error.response) {
        const detail = error.response.data?.detail;
        const msg = typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
            ? detail.map(d => d.msg || (d.loc ? `${d.loc.slice(-1)[0]}: ${d.msg}` : JSON.stringify(d))).join(', ')
            : error.response.data?.message || defaultMsg;
        return new Error(`Error ${error.response.status}: ${msg}`);
    }
    return new Error(`Error de red: ${error.message}`);
};

export const getCourses = async (page = 1, pageSize = 10, status = null) => {
    try {
        const params = {
            page,
            page_size: pageSize
        };
        
        if (status) {
            params.status = status;
        }
        
        const response = await api.get('/courses', { params });
        const data = response.data;

        if (!data.courses) {
            throw new Error('No se encontraron cursos en la respuesta de la API');
        }
        return data;
    } catch (error) {
        throw formatApiError(error, 'Error al obtener cursos');
    }
};

export const getCoursesByCategory = async (category, page = 1, pageSize = 10, status = null) => {
    try {
        const params = {
            page,
            page_size: pageSize
        };
        
        if (status) {
            params.status = status;
        }
        
        const response = await api.get(`/courses/category/${encodeURIComponent(category)}`, { params });
        const data = response.data;

        if (!data.courses) {
            throw new Error('No se encontraron cursos en la respuesta de la API');
        }

        return data;
    } catch (error) {
        throw formatApiError(error, 'Error al obtener cursos por categoría');
    }
};

export const getCourseById = async (courseId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/courses/${courseId}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        throw formatApiError(error, 'Error al obtener detalle del curso');
    }
};

export const getCoursesByHoursRange = async (minHours, maxHours) => {
    try {
        const response = await api.get(`/courses/hours-range/?min_hours=${minHours}&max_hours=${maxHours}`);
        const data = response.data;

        if (!data.courses) {
            throw new Error('No se encontraron cursos en la respuesta de la API');
        }

        return data.courses;
    } catch (error) {
        throw formatApiError(error, 'Error al filtrar cursos por horas');
    }
};

export const createCourse = async (courseData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.post('/courses', courseData, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        throw formatApiError(error, 'Error al crear el curso');
    }
};

export const updateCourse = async (courseId, courseData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.patch(`/courses/${courseId}`, courseData, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        throw formatApiError(error, 'Error al actualizar el curso');
    }
};

export const uploadImage = async (file) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/images/upload', formData, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw formatApiError(error, 'Error al subir imagen');
    }
};

export const deleteImage = async (imageUrl) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/images/delete?image_url=${encodeURIComponent(imageUrl)}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        throw formatApiError(error, 'Error al eliminar imagen');
    }
};

export const searchCourses = async (query, page = 1, pageSize = 10, status = null) => {
    try {
        const params = {
            query,
            page,
            page_size: pageSize
        };
        
        if (status) {
            params.status = status;
        }
        
        const response = await api.get('/courses/search', { params });
        const data = response.data;

        if (!data.courses) {
            throw new Error('No se encontraron cursos en la respuesta de la API');
        }
        return data;
    } catch (error) {
        throw formatApiError(error, 'Error al buscar cursos');
    }
};

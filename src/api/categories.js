import api from './api';
export const createCategory = async (categoryData) => {
    console.log('Creating category with data:', categoryData);
    const token = localStorage.getItem('token');
    const response = await api.post('/categories', categoryData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}
export const getAllCategories = async (page = 1, pageSize = 10, status_filter = null) => {
    try {
        const token = localStorage.getItem('token');
        const params = {
            page,
            page_size: pageSize,
            include_inactive: true
        };

        // Solo agregar status si se proporciona
        if (status_filter) {
            params.status_filter = status_filter;
        }

        const response = await api.get('/categories', {
            params,
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
        );
        const data = response.data;
        console.log('Respuesta completa de la API:', data);
        return data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
        }
        if (error.response) {
            console.error('Error response:', error.response.data);
            throw new Error(`Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`);
        }
        throw new Error(`Error de red: ${error.message}`);
    }
}
export const uploadCategorySVG = async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/svg/upload', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
export const updateCategory = async (categoryId, categoryData) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/categories/${categoryId}`, categoryData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
export const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}
export const searchCategories = async (query, page = 1, pageSize = 10, status_filter = null) => {
    try {
        const token = localStorage.getItem('token');
        const params = {
            search: query,
            page,
            page_size: pageSize,
            include_inactive: true
        };

        if (status_filter) {
            params.status_filter = status_filter;
        }

        const response = await api.get(`/categories`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
        }
        if (error.response) {
            throw new Error(`Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`);
        }
        throw new Error(`Error de red: ${error.message}`);
    }
}
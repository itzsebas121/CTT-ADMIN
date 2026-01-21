import api from './api';
export const createCategory = async (categoryData)=>{
    console.log('Creating category with data:', categoryData);
    const token = localStorage.getItem('token');
    const response = await api.post('/categories', categoryData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
}
export const getAllCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/categories', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
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
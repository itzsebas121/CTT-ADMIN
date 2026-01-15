import api from './api';
export const createCategory = async (categoryData)=>{
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
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

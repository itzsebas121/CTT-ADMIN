import api from './api';

const BANNER_ENDPOINT = '/posts';

/**
 * Obtener la configuración actual de banners
 */
export const getBanners = async () => {
  try {
    const response = await api.get(BANNER_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error al obtener banners:', error);
    throw new Error(error.response?.data?.message || 'Error al cargar la configuración de banners');
  }
};

/**
 * Actualizar la configuración de banners
 * @param {Object} bannerData - Datos de los banners (banner, banner2, banner3)
 */
export const updateBanners = async (bannerData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(BANNER_ENDPOINT, bannerData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar banners:', error);
    throw new Error(error.response?.data?.message || 'Error al actualizar la configuración de banners');
  }
};

import api from './api';

/**
 * Obtener todas las categorías de congresos con paginación y filtros
 * @param {number} page
 * @param {number} pageSize
 * @param {string|null} status_filter - 'activo' | 'inactivo'
 * @param {boolean} include_inactive
 */
export const getAllCongressCategories = async (
  page = 1,
  pageSize = 10,
  status_filter = null,
  include_inactive = true
) => {
  try {
    const params = {
      page,
      page_size: pageSize,
      include_inactive,
    };

    if (status_filter) {
      params.status_filter = status_filter;
    }

    const response = await api.get('/congress-categories/', { params });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
    }
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || error.response.data?.message || 'Error desconocido'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Obtener todas las categorías de congresos activas
 */
export const getEnabledCongressCategories = async () => {
  try {
    const response = await api.get('/congress-categories/enabled');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al obtener categorías activas'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Obtener una categoría de congreso por ID
 * @param {number} categoryId
 */
export const getCongressCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`/congress-categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al obtener categoría'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Obtener una categoría por su nombre
 * @param {string} name
 */
export const getCongressCategoryByName = async (name) => {
  try {
    const response = await api.get(`/congress-categories/by-name/${encodeURIComponent(name)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al obtener categoría'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Buscar categorías de congresos por término
 * @param {string} searchTerm
 */
export const searchCongressCategories = async (searchTerm) => {
  try {
    const response = await api.get(`/congress-categoriessearch/${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al buscar categorías'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Crear una nueva categoría de congreso
 * @param {Object} categoryData - { name, description, svgurl, status }
 */
export const createCongressCategory = async (categoryData) => {
  try {
    const response = await api.post('/congress-categories/', categoryData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
          : 'Error al crear categoría de congreso';
      throw new Error(message);
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Actualizar una categoría de congreso existente
 * @param {number} categoryId
 * @param {Object} categoryData - { name, description, svgurl, status }
 */
export const updateCongressCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/congress-categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
          : 'Error al actualizar categoría de congreso';
      throw new Error(message);
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Eliminar una categoría de congreso
 * @param {number} categoryId
 */
export const deleteCongressCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/congress-categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al eliminar categoría'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Subir archivo SVG para una categoría
 * @param {File} file
 */
export const uploadCongressCategorySVG = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/svg/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error al subir SVG: ${error.response.data?.detail || error.response.statusText}`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};


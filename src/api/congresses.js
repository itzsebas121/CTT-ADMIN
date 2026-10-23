import api from './api';

/**
 * Listar congresos con paginación, filtros de año y término de búsqueda
 */
export const getCongresses = async ({
  page = 1,
  pageSize = 10,
  year = null,
  searchTerm = null,
  orderBy = 'fecha_inicio',
  orderDesc = true,
} = {}) => {
  try {
    const params = {
      page,
      page_size: pageSize,
      order_by: orderBy,
      order_desc: orderDesc,
    };

    if (year !== null && year !== undefined && year !== '' && year !== 'Todos') {
      params.year = parseInt(year, 10);
    }
    if (searchTerm && searchTerm.trim().length > 0) {
      params.search_term = searchTerm.trim();
    }

    const response = await api.get('/congresses-new', { params });
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
 * Buscar congresos por término y año
 */
export const searchCongresses = async (query, year = null, limit = 20) => {
  try {
    const params = {
      query: query.trim(),
      limit,
    };
    if (year !== null && year !== undefined && year !== '' && year !== 'Todos') {
      params.year = parseInt(year, 10);
    }

    const response = await api.get('/congresses-new/search', { params });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al buscar congresos'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Obtener un congreso por ID con todas sus relaciones
 */
export const getCongressById = async (congressId) => {
  try {
    if (!congressId || congressId === 'undefined' || congressId === 'null') {
      throw new Error('ID de congreso inválido');
    }
    const response = await api.get(`/congresses-new/${congressId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al obtener congreso'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Crear un nuevo congreso
 * @param {Object} data - { congress: { nombre, edicion, anio, fecha_inicio, fecha_fin, descripcion_general, poster_cover_url }, sponsors: [], sessions: [] }
 */
export const createCongress = async (data) => {
  try {
    // Si viene directamente el objeto del congreso, envolverlo en { congress: ... }
    const payload = data.congress ? data : { congress: data, sponsors: data.sponsors || [], sessions: data.sessions || [] };
    const response = await api.post('/congresses-new', payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg || (d.loc ? `${d.loc.join('.')}: ${d.msg}` : JSON.stringify(d))).join(', ')
          : 'Error al crear congreso';
      throw new Error(message);
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Actualizar un congreso por ID
 * @param {number} congressId
 * @param {Object} data - Objeto con datos del congreso a actualizar
 */
export const updateCongress = async (congressId, data) => {
  try {
    const payload = data.congress ? data : { congress: data };
    const response = await api.patch(`/congresses-new/${congressId}`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg || (d.loc ? `${d.loc.join('.')}: ${d.msg}` : JSON.stringify(d))).join(', ')
          : 'Error al actualizar congreso';
      throw new Error(message);
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Eliminar un congreso por ID
 */
export const deleteCongress = async (congressId) => {
  try {
    if (!congressId || congressId === 'undefined' || congressId === 'null') {
      throw new Error('ID de congreso inválido');
    }
    const response = await api.delete(`/congresses-new/${congressId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al eliminar congreso'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Verificar disponibilidad de edición y año
 */
export const checkCongressEdition = async (edicion, anio, excludeCongressId = null) => {
  try {
    const params = {};
    if (excludeCongressId) {
      params.exclude_congress_id = excludeCongressId;
    }
    const response = await api.get(`/congresses-new/check-edition/${encodeURIComponent(edicion)}/${anio}`, { params });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error al verificar edición: ${error.response.data?.detail || 'Error del servidor'}`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Obtener lista de años con congresos
 */
export const getCongressYears = async () => {
  try {
    const response = await api.get('/congresses-new/years');
    return response.data;
  } catch (error) {
    if (error.response) {
      return [];
    }
    return [];
  }
};

/**
 * Obtener estadísticas de un congreso
 */
export const getCongressStatistics = async (congressId) => {
  try {
    const response = await api.get(`/congresses-new/${congressId}/statistics`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.detail || 'Error al obtener estadísticas'
        }`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Subir póster o portada para el congreso (usa /images/upload)
 */
export const uploadCongressPoster = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { message, image_url }
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error al subir imagen: ${error.response.data?.detail || error.response.statusText}`
      );
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

/**
 * Obtener sesiones del cronograma del congreso
 */
export const getCongressSessions = async (congressId) => {
  try {
    const response = await api.get(`/sessions/by-congress/${congressId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

/**
 * Obtener patrocinios del congreso
 */
export const getCongressSponsorships = async (congressId) => {
  try {
    const response = await api.get(`/sponsorships/by-congress/${congressId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

/**
 * Obtener ponentes del congreso
 */
export const getCongressSpeakers = async (congressId) => {
  try {
    const response = await api.get(`/speakers/by-congress/${congressId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};


/**
 * Obtener lista de todos los patrocinadores registrados
 */
export const getSponsorsList = async (page = 1, pageSize = 50) => {
  try {
    const response = await api.get('/sponsors', {
      params: { page, page_size: pageSize }
    });
    return response.data?.sponsors || [];
  } catch (error) {
    return [];
  }
};

/**
 * Crear un nuevo patrocinador en el catálogo general
 * @param {Object} sponsorData - { nombre, sitio_web, descripcion, logo_url }
 */
export const createSponsor = async (sponsorData) => {
  try {
    const payload = sponsorData.sponsor ? sponsorData : { sponsor: sponsorData };
    const response = await api.post('/sponsors', payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
          : 'Error al registrar patrocinador';
      throw new Error(message);
    }
    throw new Error(`Error de red: ${error.message}`);
  }
};

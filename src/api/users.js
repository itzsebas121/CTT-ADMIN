import api from './api';

/**
 * Obtiene usuarios paginados y opcionalmente filtrados por tipo.
 * @param {number} page - Número de página (por defecto 1)
 * @param {number} pageSize - Tamaño de página (por defecto 10)
 * @param {string|null} type - Tipo de usuario (opcional: Estudiante/Externo/Administrativo)
 * @returns {Promise<Object>} Respuesta con usuarios y metadatos de paginación
 */
export const getUsers = async (page = 1, pageSize = 10, type = null) => {
    try {
        const params = {
            page,
            page_size: pageSize
        };
        if (type) {
            params.type = type;
        }
        const token = localStorage.getItem('token');
        const response = await api.get('/users', {
            params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
};

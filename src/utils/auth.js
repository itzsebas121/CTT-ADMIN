/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} True si existe un token válido
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  
  if (!token || !tokenTimestamp) {
    return false;
  }
  
  // Verificar si han pasado 8 horas (28800000 ms)
  const now = Date.now();
  const elapsed = now - parseInt(tokenTimestamp, 10);
  const EIGHT_HOURS = 8 * 60 * 60 * 1000; // 8 horas en milisegundos
  
  if (elapsed > EIGHT_HOURS) {
    // Token expirado, limpiar datos
    clearAuthData();
    return false;
  }
  
  return true;
};

/**
 * Obtiene el token de autenticación almacenado
 * @returns {string|null} El token o null si no existe
 */
export const getToken = () => {
  if (!isAuthenticated()) {
    return null;
  }
  return localStorage.getItem('token');
};

/**
 * Obtiene los datos del usuario almacenados
 * @returns {Object|null} Los datos del usuario o null si no existen
 */
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getUserName = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Obtiene el usuario (alias de getUserData)
 * @returns {Object|null} Los datos del usuario o null si no existen
 */
export const getUser = () => {
  return getUserData();
};

/**
 * Guarda los datos de autenticación
 * @param {string} token - El token JWT
 * @param {Object} userData - Los datos del usuario
 */
export const saveAuthData = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};

/**
 * Limpia todos los datos de autenticación
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  localStorage.removeItem('tokenTimestamp');
};

/**
 * Obtiene el header de autenticación para requests
 * @returns {Object} Header con el token Bearer
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

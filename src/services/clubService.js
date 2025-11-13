import apiClient from './apiClient';

/**
 * Get all club types
 * @returns {Promise<Object>} Response containing array of club types
 */
export const getClubTypes = async () => {
  const response = await apiClient.get('/api/ClubType');
  return response.data;
};

/**
 * Get club type by ID
 * @param {string} id - Club type ID (UUID)
 * @returns {Promise<Object>} Response containing club type data
 */
export const getClubTypeById = async (id) => {
  const response = await apiClient.get(`/api/ClubType/${id}`);
  return response.data;
};

/**
 * Get all active club types
 * @returns {Promise<Object>} Response containing array of active club types
 */
export const getActiveClubTypes = async () => {
  const response = await apiClient.get('/api/ClubType/active');
  return response.data;
};

/**
 * Get all clubs
 * @returns {Promise<Object>} Response containing array of all clubs
 */
export const getAllClubs = async () => {
  const response = await apiClient.get('/api/Club');
  return response.data;
};

/**
 * Get club by ID
 * @param {string} id - Club ID (UUID)
 * @returns {Promise<Object>} Response containing club data
 */
export const getClubById = async (id) => {
  const response = await apiClient.get(`/api/Club/${id}`);
  return response.data;
};

/**
 * Get clubs with pagination, filtering, and sorting
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10, max: 100)
 * @param {string} params.searchTerm - Optional search term for club name, code, or description
 * @param {string} params.typeId - Optional club type ID for filtering
 * @param {boolean} params.isActive - Optional filter by active status
 * @param {string} params.sortBy - Sort field: "name" (default), "code", "createdAt", "updatedAt"
 * @param {boolean} params.sortDescending - Sort in descending order (default: false/ascending)
 * @returns {Promise<Object>} Response containing paginated clubs data
 */
export const getClubsPaginated = async (params = {}) => {
  const {
    page = 1,
    pageSize = 10,
    searchTerm,
    typeId,
    isActive,
    sortBy = 'name',
    sortDescending = false
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('pageSize', pageSize.toString());
  queryParams.append('sortBy', sortBy);
  queryParams.append('sortDescending', sortDescending.toString());

  if (searchTerm) {
    queryParams.append('searchTerm', searchTerm);
  }
  if (typeId) {
    queryParams.append('typeId', typeId);
  }
  if (isActive !== undefined && isActive !== null) {
    queryParams.append('isActive', isActive.toString());
  }

  const response = await apiClient.get(`/api/Club/paginated?${queryParams.toString()}`);
  return response.data;
};


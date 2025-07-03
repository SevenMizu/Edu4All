import apiClient from "./apiClient";

/**
 * Start (join) an existing scheduled Zoom session.
 * @param {number} sessionId
 * @returns {Promise<ZoomMeetingDetails>}
 */
export const startSession = async (sessionId) => {
  try {
    const response = await apiClient.post(`/sessions/${sessionId}/start`);
    return response.data;
  } catch (error) {
    console.error("Error starting session", error);
    throw error;
  }
};

/**
 * Schedule a new Zoom session.
 * Automatically includes the user's local timezone.
 * @param {object} sessionData
 */
export const scheduleSession = async (sessionData) => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Get the current user’s ID from localStorage
    const hostId = Number(localStorage.getItem("userId"));
    // Merge hostId and timezone into the payload
    const payload = { ...sessionData, timezone, hostId };
    const response = await apiClient.post(`/sessions/schedule`, payload);
    return response.data;
  } catch (error) {
    console.error("Error scheduling session", error);
    throw error;
  }
};

/**
 * Fetch all scheduled sessions.
 */
export const getSessions = async () => {
  try {
    const response = await apiClient.get(`/sessions/view`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions", error);
    throw error;
  }
};

/**
 * Alias for getSessions so components can import `getAllSessions`.
 */
export const getAllSessions = getSessions;

/**
 * Register (subscribe) the given user to the given session.
 * @param {number} userId
 * @param {number} sessionId
 */
export const subscribeSession = async (userId, sessionId) => {
  try {
    await apiClient.post(`/sessions/student/${userId}/${sessionId}`);
  } catch (error) {
    console.error("Error subscribing to session", error);
    throw error;
  }
};

/**
 * Fetch sessions a student has registered for.
 * @param {number} userId
 */
export const getStudentSessions = async (userId) => {
  try {
    const response = await apiClient.get(`/sessions/student/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student sessions", error);
    throw error;
  }
};

/**
 * Unsubscribe the given user from the given session.
 * @param {number} userId
 * @param {number} sessionId
 */
export const unsubscribeSession = async (userId, sessionId) => {
  try {
    await apiClient.delete(`/sessions/student/${userId}/${sessionId}`);
  } catch (error) {
    console.error("Error unsubscribing", error);
    throw error;
  }
};

/**
 * Update an existing Zoom session's metadata.
 * Automatically includes the user's local timezone if a startTime is provided.
 * @param {number} sessionId
 * @param {object} data  Partial update fields:
 *                       { topic?, agenda?, startTime?, duration?, password?, waitingRoom? }
 */
export const updateSession = async (sessionId, data) => {
  try {
    const payload = { ...data };
    if (payload.startTime) {
      payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    await apiClient.patch(`/sessions/${sessionId}`, payload);
  } catch (error) {
    console.error("Error updating session", error);
    throw error;
  }
};

/**
 * Delete a session (both Zoom + local record).
 * @param {number} sessionId
 */
export const deleteSession = async (sessionId) => {
  try {
    await apiClient.delete(`/sessions/${sessionId}`);
  } catch (error) {
    console.error("Error deleting session", error);
    throw error;
  }
};

/**
 * Search for sessions that match the given keyword.
 * Sends a GET request to the backend and returns a promise with the results.
 * @param {string} keyword - The keyword to search for in sessions.
 * @returns {Promise} Promise resolving to the list of matching sessions.
 */
export const searchSessions = (keyword) => {
  return apiClient.get(
    `/sessions/search?keyword=${encodeURIComponent(keyword)}`
  );
};


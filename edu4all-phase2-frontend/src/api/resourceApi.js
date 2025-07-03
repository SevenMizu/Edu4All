// src/api/resourceApi.js
import apiClient from "./apiClient";

/**
 * Upload multiple resources at once, plus an optional cover photo.
 * @param {{ 
 *   title: string, 
 *   description: string, 
 *   subject: string, 
 *   userId: number, 
 *   coverPhoto?: File, 
 *   files: File[] 
 * }} params
 * @returns {Promise<{ id: number, filename: string }[]>}
 */
export async function uploadResources({ title, description, subject, userId, coverPhoto, files }) {
  const formData = new FormData();
  formData.append("title",       title);
  formData.append("description", description);
  formData.append("subject",     subject);
  formData.append("userid",      String(userId));

  // append the optional cover photo
  if (coverPhoto instanceof File) {
    formData.append("coverPhoto", coverPhoto);
  }

  // append all other files
  files.forEach(f => formData.append("files", f));

  const resp = await apiClient.post("/resources", formData);
  // resp.data is ["123,foo.pdf","124,bar.png",...]
  return resp.data.map(pair => {
    const [id, filename] = pair.split(",");
    return { id: parseInt(id, 10), filename };
  });
}

/**
 * Fetch all educational resources for the current user.
 * @param {number} userId
 * @returns {Promise<Array<{ id, title, description, subject, files: string[] }>>}
 */
export async function fetchResources(userId) {
  const resp = await apiClient.get(`/resources?userid=${userId}`);
  return resp.data;
}

/**
 * Fetch one resource by its ID, including cover and files.
 * @param {number} id
 * @returns {Promise<{
 *   id: number,
 *   title: string,
 *   description: string,
 *   subject: string,
 *   coverPhotoUrl: string,
 *   files: string[]
 * }>}
 */
export async function fetchResource(id) {
  const resp = await apiClient.get(`/resources/${id}`);
  return resp.data;
}

/**
 * Update a resource’s metadata, its files, and optionally its cover photo.
 * @param {{
 *   id: number,
 *   title: string,
 *   description: string,
 *   subject: string,
 *   removedFiles: string[],   // filenames to remove
 *   newFiles: File[],         // new File objects to upload
 *   removedCover: boolean,    // whether to clear existing cover
 *   coverPhoto?: File         // new cover photo file
 * }} params
 */
export async function updateResource({
  id,
  title,
  description,
  subject,
  removedFiles,
  newFiles,
  removedCover,
  coverPhoto
}) {
  const formData = new FormData();
  formData.append("title",       title);
  formData.append("description", description);
  formData.append("subject",     subject);

  // files to delete
  formData.append("removedFiles", JSON.stringify(removedFiles));

  // flag to clear existing cover
  formData.append("removedCover", String(removedCover));

  // optional new cover photo
  if (coverPhoto instanceof File) {
    formData.append("coverPhoto", coverPhoto);
  }

  // append any new attachment files
  newFiles.forEach(f => formData.append("files", f));

  return apiClient.post(`/resources/${id}`, formData);
}

/**
 * Delete an entire resource (and its files) by ID.
 * @param {number} id
 */
export async function deleteResource(id) {
  // returns 204 No Content on success
  return apiClient.delete(`/resources/${id}`);
}

/**
 * Fetch *all* educational resources (no user filter).
 * @returns {Promise<Array<{ id, title, description, subject, cover: string, files: string[] }>>}
 */
export async function fetchAllResources() {
  const resp = await apiClient.get("/resources/all");
  return resp.data;
}
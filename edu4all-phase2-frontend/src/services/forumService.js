import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const forumService = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  getPostsByAuthor: (authorId) => api.get(`/posts/author/${authorId}`),
  searchPosts: (keyword) => api.get(`/posts/search?keyword=${keyword}`),
  createPost: (post) => api.post('/posts', post),
  updatePost: (id, post) => api.post(`/posts/${id}`, post),
  deletePost: (id) => api.delete(`/posts/${id}`),

  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
  getCommentsByAuthor: (authorId) => api.get(`/comments/author/${authorId}`),
  createComment: (comment) => api.post('/comments', comment),
  updateComment: (id, comment) => api.put(`/comments/${id}`, comment),
  deleteComment: (id) => api.delete(`/comments/${id}`)
};
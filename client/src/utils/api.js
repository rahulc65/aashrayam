const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const getToken = () => localStorage.getItem('orbit_token');

const headers = (auth = false) => {
  const h = { 'Content-Type': 'application/json' };
  if (auth) h['Authorization'] = `Bearer ${getToken()}`;
  return h;
};

export const api = {
  // Auth
  login: (data) => fetch(`${API_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  me: () => fetch(`${API_URL}/auth/me`, { headers: headers(true) }).then(r => r.json()),
  setup: (data) => fetch(`${API_URL}/auth/setup`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  // News
  getNews: () => fetch(`${API_URL}/news`).then(r => r.json()),
  getAllNews: () => fetch(`${API_URL}/news/all`, { headers: headers(true) }).then(r => r.json()),
  uploadNewsImage: (imageData) => fetch(`${API_URL}/news/upload-image`, { method: 'POST', headers: headers(true), body: JSON.stringify({ imageData }) }).then(r => r.json()),
  createNews: (data) => fetch(`${API_URL}/news`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateNews: (id, data) => fetch(`${API_URL}/news/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteNews: (id) => fetch(`${API_URL}/news/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Events
  getEvents: () => fetch(`${API_URL}/events`).then(r => r.json()),
  getAllEvents: () => fetch(`${API_URL}/events/all`, { headers: headers(true) }).then(r => r.json()),
  createEvent: (data) => fetch(`${API_URL}/events`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateEvent: (id, data) => fetch(`${API_URL}/events/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteEvent: (id) => fetch(`${API_URL}/events/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Programs
  getPrograms: () => fetch(`${API_URL}/programs`).then(r => r.json()),
  getAllPrograms: () => fetch(`${API_URL}/programs/all`, { headers: headers(true) }).then(r => r.json()),
  createProgram: (data) => fetch(`${API_URL}/programs`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateProgram: (id, data) => fetch(`${API_URL}/programs/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteProgram: (id) => fetch(`${API_URL}/programs/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Gallery
  getGallery: () => fetch(`${API_URL}/gallery`).then(r => r.json()),
  getAllGallery: () => fetch(`${API_URL}/gallery/all`, { headers: headers(true) }).then(r => r.json()),
  createGallery: (data) => fetch(`${API_URL}/gallery`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateGallery: (id, data) => fetch(`${API_URL}/gallery/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteGallery: (id) => fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Testimonials
  getTestimonials: () => fetch(`${API_URL}/testimonials`).then(r => r.json()),
  getAllTestimonials: () => fetch(`${API_URL}/testimonials/all`, { headers: headers(true) }).then(r => r.json()),
  createTestimonial: (data) => fetch(`${API_URL}/testimonials`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateTestimonial: (id, data) => fetch(`${API_URL}/testimonials/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteTestimonial: (id) => fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),
};

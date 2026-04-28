import { createClient } from '@supabase/supabase-js';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// ── Supabase client (frontend) ────────────────────────────────────────────────
// Used ONLY for Storage uploads. All other data fetching goes through the
// Express backend API as before.
const supabaseUrl  = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnon = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnon) {
  supabase = createClient(supabaseUrl, supabaseAnon);
} else {
  console.warn(
    '⚠️  REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY is not set.\n' +
    '   Image uploads will fall back to the backend server (local dev only).\n' +
    '   Add these to client/.env.local and Vercel dashboard for production.'
  );
}

const getToken = () => localStorage.getItem('orbit_token');

const headers = (auth = false) => {
  const h = { 'Content-Type': 'application/json' };
  if (auth) h['Authorization'] = `Bearer ${getToken()}`;
  return h;
};

/**
 * Resolve a stored image path/URL to a fully-qualified URL for display.
 *
 * Cases handled:
 *  - Full https:// URL (Supabase Storage, Unsplash, etc.) → returned as-is
 *  - Legacy /uploads/... path (old local uploads) → prepend backend URL
 *  - null / undefined → null
 */
export const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Legacy local path - try to serve from backend (works locally, broken on Vercel)
  const SERVER_URL = API_URL.replace(/\/api$/, '');
  if (path.startsWith('/uploads/')) return `${SERVER_URL}${path}`;
  return path;
};

/**
 * Upload an image file to Supabase Storage and return the public URL.
 *
 * WHY: Vercel's filesystem is ephemeral — files saved to disk disappear
 * after the serverless function ends. Supabase Storage is permanent and
 * serves images via a global CDN.
 *
 * The returned URL is a full https:// URL that works everywhere — locally,
 * on Vercel, and in the browser — with no path resolution needed.
 *
 * @param {File} file - The image File object from the input/drop event
 * @param {string} bucket - Supabase Storage bucket name (default: 'gallery')
 * @returns {Promise<string>} - Public CDN URL of the uploaded image
 */
export const uploadImageToSupabase = async (file, bucket = 'gallery') => {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add REACT_APP_SUPABASE_URL and ' +
      'REACT_APP_SUPABASE_ANON_KEY to your environment variables.'
    );
  }

  const ext      = file.name.split('.').pop();
  const filename = `${bucket}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
  const filePath = `${bucket}/${filename}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error('Supabase Storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL after upload.');
  }

  return urlData.publicUrl; // e.g. https://xxx.supabase.co/storage/v1/object/public/gallery/...
};

export const api = {
  // Auth
  login:  (data) => fetch(`${API_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
  me:     ()     => fetch(`${API_URL}/auth/me`,    { headers: headers(true) }).then(r => r.json()),
  setup:  (data) => fetch(`${API_URL}/auth/setup`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

  // News
  getNews:         ()        => fetch(`${API_URL}/news`).then(r => r.json()),
  getAllNews:       ()        => fetch(`${API_URL}/news/all`, { headers: headers(true) }).then(r => r.json()),
  createNews:      (data)    => fetch(`${API_URL}/news`,      { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateNews:      (id, data)=> fetch(`${API_URL}/news/${id}`,{ method: 'PUT',  headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteNews:      (id)      => fetch(`${API_URL}/news/${id}`,{ method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Events
  getEvents:       ()        => fetch(`${API_URL}/events`).then(r => r.json()),
  getAllEvents:     ()        => fetch(`${API_URL}/events/all`, { headers: headers(true) }).then(r => r.json()),
  createEvent:     (data)    => fetch(`${API_URL}/events`,       { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateEvent:     (id, data)=> fetch(`${API_URL}/events/${id}`, { method: 'PUT',  headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteEvent:     (id)      => fetch(`${API_URL}/events/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Programs
  getPrograms:     ()        => fetch(`${API_URL}/programs`).then(r => r.json()),
  getAllPrograms:   ()        => fetch(`${API_URL}/programs/all`, { headers: headers(true) }).then(r => r.json()),
  createProgram:   (data)    => fetch(`${API_URL}/programs`,       { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateProgram:   (id, data)=> fetch(`${API_URL}/programs/${id}`, { method: 'PUT',  headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteProgram:   (id)      => fetch(`${API_URL}/programs/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Gallery
  getGallery:      ()        => fetch(`${API_URL}/gallery`).then(r => r.json()),
  getAllGallery:    ()        => fetch(`${API_URL}/gallery/all`, { headers: headers(true) }).then(r => r.json()),
  createGallery:   (data)    => fetch(`${API_URL}/gallery`,       { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateGallery:   (id, data)=> fetch(`${API_URL}/gallery/${id}`, { method: 'PUT',  headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteGallery:   (id)      => fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

  // Testimonials
  getTestimonials:    ()        => fetch(`${API_URL}/testimonials`).then(r => r.json()),
  getAllTestimonials:  ()        => fetch(`${API_URL}/testimonials/all`, { headers: headers(true) }).then(r => r.json()),
  createTestimonial:  (data)    => fetch(`${API_URL}/testimonials`,       { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  updateTestimonial:  (id, data)=> fetch(`${API_URL}/testimonials/${id}`, { method: 'PUT',  headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),
  deleteTestimonial:  (id)      => fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),
};
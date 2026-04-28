import { api } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import CrudManager from '../../components/admin/CrudManager';

/* ─── NEWS ─── */
export const AdminNews = () => (
  <AdminLayout>
    <CrudManager
      title="News & Notices"
      fetchAll={api.getAllNews}
      onCreate={api.createNews}
      onUpdate={api.updateNews}
      onDelete={api.deleteNews}
      emptyMsg="No news items yet. Add your first announcement!"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'badge_text', label: 'Badge' },
        { key: 'published', label: 'Status' },
        { key: 'created_at', label: 'Date', render: r => new Date(r.created_at).toLocaleDateString() },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Exam Schedule Released' },
        { name: 'category', label: 'Category', type: 'select', options: ['General','Academic','Events','Admissions','Results','Notice'], default: 'General' },
        { name: 'badge_text', label: 'Badge Text', placeholder: 'e.g. New, Important', half: true },
        { name: 'badge_color', label: 'Badge Color', type: 'color', default: '#2D7D6F', half: true },
        { name: 'excerpt', label: 'Short Excerpt', type: 'textarea', rows: 2, placeholder: 'Brief summary shown on homepage...' },
        { name: 'content', label: 'Full Content', type: 'textarea', rows: 5, placeholder: 'Full announcement text...' },
        { name: 'image_url', label: 'Featured Image', type: 'image', placeholder: 'Upload announcement image' },
        { name: 'published', label: 'Published', type: 'toggle', default: true, onLabel: 'Published', offLabel: 'Draft' },
      ]}
    />
  </AdminLayout>
);

/* ─── EVENTS ─── */
export const AdminEvents = () => (
  <AdminLayout>
    <CrudManager
      title="Events"
      fetchAll={api.getAllEvents}
      onCreate={api.createEvent}
      onUpdate={api.updateEvent}
      onDelete={api.deleteEvent}
      emptyMsg="No events yet. Add your first upcoming event!"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'event_date', label: 'Date', render: r => r.event_date ? new Date(r.event_date).toLocaleDateString() : '—' },
        { key: 'category', label: 'Category' },
        { key: 'location', label: 'Location' },
        { key: 'is_featured', label: 'Featured', render: r => r.is_featured
          ? <span className="crud-badge crud-badge--green">Featured</span>
          : <span className="crud-badge crud-badge--gray">Regular</span> },
        { key: 'published', label: 'Status' },
      ]}
      fields={[
        { name: 'title', label: 'Event Title', required: true, placeholder: 'e.g. Annual Science Fair' },
        { name: 'category', label: 'Category', type: 'select', options: ['Academic','Cultural','Sports','Workshop','Seminar','Social','Career'], default: 'Academic' },
        { name: 'event_date', label: 'Event Date', type: 'date', required: true, half: true },
        { name: 'event_time', label: 'Event Time', placeholder: 'e.g. 10:00 AM', half: true },
        { name: 'location', label: 'Location', placeholder: 'e.g. Main Auditorium' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'What will happen at this event...' },
        { name: 'image_url', label: 'Image URL', placeholder: 'https://...' },
        { name: 'is_featured', label: 'Feature on Homepage', type: 'toggle', default: false, onLabel: 'Featured', offLabel: 'Regular' },
        { name: 'published', label: 'Published', type: 'toggle', default: true, onLabel: 'Published', offLabel: 'Draft' },
      ]}
    />
  </AdminLayout>
);

/* ─── PROGRAMS ─── */
export const AdminPrograms = () => (
  <AdminLayout>
    <CrudManager
      title="Programmes"
      fetchAll={api.getAllPrograms}
      onCreate={api.createProgram}
      onUpdate={api.updateProgram}
      onDelete={api.deleteProgram}
      emptyMsg="No programmes yet. Add your first programme!"
      columns={[
        { key: 'title', label: 'Programme' },
        { key: 'duration', label: 'Duration' },
        { key: 'normal_fee', label: 'Normal Fee' },
        { key: 'seats', label: 'Seats' },
        { key: 'sort_order', label: 'Order' },
        { key: 'published', label: 'Status' },
      ]}
      fields={[
        // Basic Info
        { name: 'title', label: 'Programme Title', required: true, placeholder: 'e.g. Business & Management' },
        { name: 'duration', label: 'Duration', placeholder: 'e.g. 3 Years', half: true },
        { name: 'sort_order', label: 'Display Order', type: 'number', default: 0, half: true },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'What this programme covers...' },
        
        // Fees Section
        { name: 'normal_fee', label: 'Normal Course Fee', placeholder: 'e.g. ₹50,000 per year', half: true },
        { name: 'addon_fee', label: 'Add-on Course Fee', placeholder: 'e.g. ₹15,000', half: true },
        
        // Additional Details
        { name: 'addon_courses', label: 'Add-on Courses (one per line)', type: 'textarea', rows: 3, placeholder: 'Industry Certification\nLeadership Training\nLanguage Programme' },
        { name: 'seats', label: 'Number of Seats', type: 'number', placeholder: 'e.g. 60', half: true },
        { name: 'tags', label: 'Tags (one per line)', type: 'textarea', rows: 2, placeholder: 'Honours Program\nJob Ready\nFuture Ready' },
        
        // Features
        { name: 'features', label: 'Key Features (one per line)', type: 'textarea', rows: 4, placeholder: 'Industry Mentorship\nLive Projects\nCareer Placement\nGlobal Exchange' },
        
        // Status
        { name: 'published', label: 'Published', type: 'toggle', default: true, onLabel: 'Published', offLabel: 'Draft' },
      ]}
    />
  </AdminLayout>
);

/* ─── GALLERY ─── */
export const AdminGallery = () => (
  <AdminLayout>
    <CrudManager
      title="Gallery"
      fetchAll={api.getAllGallery}
      onCreate={api.createGallery}
      onUpdate={api.updateGallery}
      onDelete={api.deleteGallery}
      emptyMsg="No gallery images yet. Add your first campus photo!"
      columns={[
        { key: 'image_url', label: 'Preview', render: r => {
          const raw = r.image_url || null;
          let src = null;
          if (raw) {
            if (raw.startsWith('http://') || raw.startsWith('https://')) {
              src = raw; // Supabase CDN URL or external URL — use directly
            } else if (raw.startsWith('/uploads/')) {
              const base = (process.env.REACT_APP_API_URL || 'http://localhost:4000/api').replace('/api', '');
              src = base + raw; // Legacy local upload (works locally only)
            }
          }
          return src ? <img src={src} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} /> : '—';
        }},
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'sort_order', label: 'Order' },
        { key: 'published', label: 'Status' },
      ]}
      fields={[
        { name: 'image_url', label: 'Image URL (Optional)', placeholder: 'https://images.unsplash.com/...' },
        { name: 'image_url', label: 'Upload Image File', type: 'image', placeholder: 'Drag & drop or click to upload' },
        { name: 'title', label: 'Caption / Title', placeholder: 'e.g. Students at Science Lab' },
        { name: 'category', label: 'Category', type: 'select', options: ['Campus Life','Events','Facilities','Sports','Cultural','Graduation'], default: 'Campus Life' },
        { name: 'sort_order', label: 'Display Order', type: 'number', default: 0, half: true },
        { name: 'published', label: 'Published', type: 'toggle', default: true, onLabel: 'Published', offLabel: 'Hidden' },
      ]}
    />
  </AdminLayout>
);

/* ─── TESTIMONIALS ─── */
export const AdminTestimonials = () => (
  <AdminLayout>
    <CrudManager
      title="Testimonials"
      fetchAll={api.getAllTestimonials}
      onCreate={api.createTestimonial}
      onUpdate={api.updateTestimonial}
      onDelete={api.deleteTestimonial}
      emptyMsg="No testimonials yet. Add your first student review!"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'rating', label: 'Rating', render: r => '★'.repeat(r.rating || 5) },
        { key: 'content', label: 'Review' },
        { key: 'published', label: 'Status' },
      ]}
      fields={[
        { name: 'name', label: 'Full Name', required: true, placeholder: 'Jane Smith', half: true },
        { name: 'role', label: 'Role / Programme', placeholder: 'BSc Business, Batch 2024', half: true },
        { name: 'content', label: 'Testimonial *', type: 'textarea', required: true, rows: 4, placeholder: 'What the student said about their experience...' },
        { name: 'rating', label: 'Rating (1–5)', type: 'select', options: ['5','4','3','2','1'], default: '5' },
        { name: 'avatar_url', label: 'Avatar Image URL', placeholder: 'https://...' },
        { name: 'published', label: 'Published', type: 'toggle', default: true, onLabel: 'Published', offLabel: 'Hidden' },
      ]}
    />
  </AdminLayout>
);
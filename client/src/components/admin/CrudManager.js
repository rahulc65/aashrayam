import { useState, useEffect } from 'react';
import ImageUpload from '../shared/ImageUpload';
import './CrudManager.css';

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconClipboard = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const IconLoader = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const CrudManager = ({
  title,
  fetchAll,
  onCreate,
  onUpdate,
  onDelete,
  fields,
  columns,
  emptyMsg = 'No items yet. Add your first one!',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [formImageData, setFormImageData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  const load = () => {
    setLoading(true);
    fetchAll().then(data => {
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const defaultForm = () => {
    const d = {};
    fields.forEach(f => { d[f.name] = f.default ?? ''; });
    return d;
  };

  const openCreate = () => {
    setForm(defaultForm());
    setEditItem(null);
    setModal('create');
  };

  const openEdit = (item) => {
    const f = {};
    fields.forEach(field => {
      if ((field.name === 'features' || field.name === 'addon_courses' || field.name === 'tags') && Array.isArray(item[field.name])) {
        f[field.name] = item[field.name].join('\n');
      } else {
        let value = item[field.name] ?? field.default ?? '';
        // Strip time from date fields (convert ISO datetime to date-only format)
        if (field.type === 'date' && value && typeof value === 'string' && value.includes('T')) {
          value = value.split('T')[0];
        }
        f[field.name] = value;
      }
    });
    setForm(f);
    setEditItem(item);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditItem(null);
    setFormImageData({});
  };

  const handleChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };

    // ── FIX: Upload images to Supabase Storage instead of the backend server.
    //    Vercel's filesystem is ephemeral — files saved to disk vanish after the
    //    serverless function ends. Supabase Storage is permanent and CDN-served.
    for (const fieldName of Object.keys(formImageData)) {
      if (formImageData[fieldName]) {
        try {
          const imageData = formImageData[fieldName];
          if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            // Convert data URL → Blob → File
            const fetchRes  = await fetch(imageData);
            const blob      = await fetchRes.blob();
            const ext       = blob.type.split('/')[1] || 'jpg';
            const file      = new File([blob], `image_${Date.now()}.${ext}`, { type: blob.type });

            // Upload to Supabase Storage → returns a permanent public https:// URL
            const publicUrl = await uploadImageToSupabase(file, 'gallery');
            payload[fieldName] = publicUrl; // Store full URL, not a local path
          }
        } catch (err) {
          console.error('Image upload failed:', err);
          flash('Image upload failed: ' + err.message, 'error');
          setSaving(false);
          return;
        }
      }
    }

    if (payload.features && typeof payload.features === 'string') {
      payload.features = payload.features.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (payload.addon_courses && typeof payload.addon_courses === 'string') {
      payload.addon_courses = payload.addon_courses.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (payload.tags && typeof payload.tags === 'string') {
      payload.tags = payload.tags.split('\n').map(s => s.trim()).filter(Boolean);
    }
    fields.forEach(f => {
      if (f.type === 'toggle') payload[f.name] = payload[f.name] === true || payload[f.name] === 'true';
    });

    // Remove temporary local_ markers that were just for UI
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string' && payload[key].startsWith('local_')) {
        delete payload[key];
      }
    });

    try {
      if (modal === 'create') {
        const res = await onCreate(payload);
        if (res.error) throw new Error(res.error);
        flash('Created successfully!', 'success');
      } else {
        const res = await onUpdate(editItem.id, payload);
        if (res.error) throw new Error(res.error);
        flash('Updated successfully!', 'success');
      }
      closeModal();
      load();
    } catch (err) {
      flash(err.message || 'Something went wrong', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    setDeleteId(null);
    load();
    flash('Item deleted.', 'success');
  };

  const flash = (text, type = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="crud-manager">
      <div className="crud-manager__header">
        <div>
          <h2 className="crud-manager__title">{title}</h2>
          <p className="crud-manager__count">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <IconPlus /> Add New
        </button>
      </div>

      {msg && (
        <div className={`crud-manager__flash ${msgType === 'error' ? 'crud-manager__flash--error' : ''}`}>
          <span className="crud-manager__flash-icon">
            {msgType === 'error' ? <IconAlert /> : <IconCheck />}
          </span>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="loader"><div className="spinner"></div> Loading...</div>
      ) : items.length === 0 ? (
        <div className="crud-manager__empty">
          <div className="crud-manager__empty-icon"><IconClipboard /></div>
          <p>{emptyMsg}</p>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <IconPlus /> Add First Item
          </button>
        </div>
      ) : (
        <div className="crud-manager__table-wrap">
          <table className="crud-table">
            <thead>
              <tr>
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {columns.map(c => (
                    <td key={c.key}>
                      {c.render ? c.render(item) : (
                        c.key === 'published'
                          ? <span className={`crud-badge ${item[c.key] ? 'crud-badge--green' : 'crud-badge--gray'}`}>
                              {item[c.key] ? 'Published' : 'Draft'}
                            </span>
                          : String(item[c.key] ?? '—').substring(0, 80)
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="crud-table__actions">
                      <button className="crud-btn crud-btn--edit" onClick={() => openEdit(item)}>
                        <IconEdit /> Edit
                      </button>
                      <button className="crud-btn crud-btn--delete" onClick={() => setDeleteId(item.id)}>
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="crud-modal-overlay" onClick={closeModal}>
          <div className="crud-modal" onClick={e => e.stopPropagation()}>
            <div className="crud-modal__header">
              <h3 className="crud-modal__title">
                {modal === 'create' ? 'Add New' : 'Edit'} {title.replace(/s$/, '')}
              </h3>
              <button className="crud-modal__close" onClick={closeModal}><IconClose /></button>
            </div>
            <form onSubmit={handleSubmit} className="crud-modal__form">
              {fields.map(field => (
                <div className="form-group" key={field.name}
                  style={field.half ? { display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '8px' } : {}}>
                  <label className="form-label">
                    {field.label}{field.required ? ' *' : ''}
                  </label>

                  {field.type === 'textarea' && (
                    <textarea className="form-textarea" required={field.required}
                      placeholder={field.placeholder}
                      value={form[field.name] || ''}
                      onChange={e => handleChange(field.name, e.target.value)}
                      rows={field.rows || 4}
                    />
                  )}

                  {field.type === 'select' && (
                    <select className="form-select"
                      value={form[field.name] || ''}
                      onChange={e => handleChange(field.name, e.target.value)}>
                      {field.options.map(o => (
                        <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
                      ))}
                    </select>
                  )}

                  {field.type === 'toggle' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <label className="toggle">
                        <input type="checkbox"
                          checked={!!form[field.name]}
                          onChange={e => handleChange(field.name, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                        {form[field.name] ? field.onLabel || 'Yes' : field.offLabel || 'No'}
                      </span>
                    </div>
                  )}

                  {field.type === 'color' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                      <input type="color" value={form[field.name] || '#2D7D6F'}
                        onChange={e => handleChange(field.name, e.target.value)}
                        style={{ width: 44, height: 40, border: 'none', cursor: 'pointer', borderRadius: 6 }} />
                      <input className="form-input" value={form[field.name] || ''}
                        onChange={e => handleChange(field.name, e.target.value)}
                        placeholder="#2D7D6F" style={{ flex: 1 }} />
                    </div>
                  )}

                  {field.type === 'image' && (
                    <ImageUpload
                      onImageSelect={(file, dataUrl) => {
                        setFormImageData(prev => ({ ...prev, [field.name]: dataUrl }));
                        if (dataUrl) handleChange(field.name, `local_${Date.now()}`);
                      }}
                      initialImage={(() => {
                        const _v = form[field.name];
                        if (!_v || _v.startsWith('local_')) return null;
                        if (_v.startsWith('/uploads/')) {
                          const _b = (process.env.REACT_APP_API_URL || 'http://localhost:4000/api').replace('/api', '');
                          return _b + _v;
                        }
                        return _v;
                      })()}
                      disabled={saving}
                    />
                  )}

                  {(field.type === 'text' || field.type === 'date' || field.type === 'number' || !field.type) && (
                    <input className="form-input"
                      type={field.type || 'text'}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={form[field.name] || ''}
                      onChange={e => handleChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <div className="crud-modal__footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving
                    ? <><IconLoader /> Saving...</>
                    : modal === 'create'
                      ? <><IconPlus /> Create</>
                      : <><IconSave /> Save Changes</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="crud-modal-overlay">
          <div className="crud-modal crud-modal--sm">
            <div className="crud-modal__header">
              <h3 className="crud-modal__title">Confirm Delete</h3>
              <button className="crud-modal__close" onClick={() => setDeleteId(null)}><IconClose /></button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <p style={{ color: 'var(--mid)', fontSize: 15, marginBottom: 24 }}>
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="crud-modal__footer">
                <button className="btn btn-outline btn-sm" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deleteId)}>
                  <IconTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudManager;

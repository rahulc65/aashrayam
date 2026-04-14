import { useState, useEffect } from 'react';
import './CrudManager.css';

const CrudManager = ({
  title,
  fetchAll,
  onCreate,
  onUpdate,
  onDelete,
  fields,        // array of field definitions
  columns,       // table columns to display
  emptyMsg = 'No items yet. Add your first one!',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [msg, setMsg] = useState('');

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
      if (field.name === 'features' && Array.isArray(item[field.name])) {
        f[field.name] = item[field.name].join('\n');
      } else {
        f[field.name] = item[field.name] ?? field.default ?? '';
      }
    });
    setForm(f);
    setEditItem(item);
    setModal('edit');
  };

  const closeModal = () => { setModal(null); setEditItem(null); };

  const handleChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    // Convert features textarea → array
    if (payload.features && typeof payload.features === 'string') {
      payload.features = payload.features.split('\n').map(s => s.trim()).filter(Boolean);
    }
    // Convert boolean strings
    fields.forEach(f => {
      if (f.type === 'toggle') payload[f.name] = payload[f.name] === true || payload[f.name] === 'true';
    });

    try {
      if (modal === 'create') {
        const res = await onCreate(payload);
        if (res.error) throw new Error(res.error);
        flash('✅ Created successfully!');
      } else {
        const res = await onUpdate(editItem.id, payload);
        if (res.error) throw new Error(res.error);
        flash('✅ Updated successfully!');
      }
      closeModal();
      load();
    } catch (err) {
      flash('❌ ' + (err.message || 'Something went wrong'), 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    setDeleteId(null);
    load();
    flash('🗑️ Deleted.');
  };

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="crud-manager">
      <div className="crud-manager__header">
        <div>
          <h2 className="crud-manager__title">{title}</h2>
          <p className="crud-manager__count">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add New</button>
      </div>

      {msg && (
        <div className={`crud-manager__flash ${msg.startsWith('❌') ? 'crud-manager__flash--error' : ''}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="loader"><div className="spinner"></div> Loading...</div>
      ) : items.length === 0 ? (
        <div className="crud-manager__empty">
          <div className="crud-manager__empty-icon">📋</div>
          <p>{emptyMsg}</p>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add First Item</button>
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
                      <button className="crud-btn crud-btn--edit" onClick={() => openEdit(item)}>✏️ Edit</button>
                      <button className="crud-btn crud-btn--delete" onClick={() => setDeleteId(item.id)}>🗑️</button>
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
              <h3 className="crud-modal__title">{modal === 'create' ? 'Add New' : 'Edit'} {title.replace(/s$/, '')}</h3>
              <button className="crud-modal__close" onClick={closeModal}>✕</button>
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
                  {saving ? '⏳ Saving...' : modal === 'create' ? '+ Create' : '💾 Save Changes'}
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
            </div>
            <div style={{ padding: '20px 24px' }}>
              <p style={{ color: 'var(--mid)', fontSize: 15, marginBottom: 24 }}>
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="crud-modal__footer">
                <button className="btn btn-outline btn-sm" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(deleteId)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudManager;

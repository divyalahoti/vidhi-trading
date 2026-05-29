import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const empty = { name: '', slug: '', description: '', isActive: true };

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = () => api.get('/categories/all').then(r => setCategories(r.data.data));
  useEffect(() => { fetch(); }, []);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) { await api.put(`/categories/${editId}`, form); toast.success('Category updated!'); }
      else { await api.post('/categories', form); toast.success('Category added!'); }
      setForm(empty); setEditId(null); setShowForm(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  const handleEdit = (cat) => { setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', isActive: cat.isActive }); setEditId(cat._id); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetch(); }
    catch (err) { toast.error('Error deleting'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Categories</h1>
        <button className="btn btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>+ Add Category</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, background: '#fffbf7', border: '1px solid #E8650A30' }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{editId ? 'Edit' : 'Add'} Category</div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} required />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input className="form-control" value={form.slug} onChange={set('slug')} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Description</label>
                <input className="form-control" value={form.description} onChange={set('description')} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: 30 }}>No categories yet</td></tr>
            ) : categories.map(c => (
              <tr key={c._id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: '#888', fontSize: 12 }}>{c.slug}</td>
                <td style={{ color: '#666', fontSize: 13 }}>{c.description || '—'}</td>
                <td><span className={`badge badge-${c.isActive ? 'success' : 'secondary'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-sm" style={{ background: '#f8d7da', color: '#721c24', border: 'none' }} onClick={() => handleDelete(c._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;

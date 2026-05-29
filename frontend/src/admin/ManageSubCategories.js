import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const empty = { name: '', slug: '', category: '', description: '', isActive: true };

const ManageSubCategories = () => {
  const [subs, setSubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSubs = () => api.get('/subcategories/all').then(r => setSubs(r.data.data));
  useEffect(() => {
    fetchSubs();
    api.get('/categories/all').then(r => setCategories(r.data.data));
  }, []);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) { await api.put(`/subcategories/${editId}`, form); toast.success('Updated!'); }
      else { await api.post('/subcategories', form); toast.success('Sub-category added!'); }
      setForm(empty); setEditId(null); setShowForm(false); fetchSubs();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, slug: s.slug, category: s.category?._id || s.category, description: s.description || '', isActive: s.isActive });
    setEditId(s._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/subcategories/${id}`);
    toast.success('Deleted'); fetchSubs();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Sub-categories</h1>
        <button className="btn btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>+ Add Sub-category</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, background: '#fffbf7', border: '1px solid #E8650A30' }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>{editId ? 'Edit' : 'Add'} Sub-category</div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} required />
              </div>
              <div className="form-group">
                <label>Parent Category *</label>
                <select className="form-control" value={form.category} onChange={set('category')} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input className="form-control" value={form.slug} onChange={set('slug')} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
                  <option value="true">Active</option><option value="false">Inactive</option>
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
          <thead><tr><th>Name</th><th>Parent Category</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {!subs.length ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: 30 }}>No sub-categories yet</td></tr>
            ) : subs.map(s => (
              <tr key={s._id}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td><span className="badge badge-secondary">{s.category?.name}</span></td>
                <td style={{ color: '#888', fontSize: 12 }}>{s.slug}</td>
                <td><span className={`badge badge-${s.isActive ? 'success' : 'secondary'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-sm" style={{ background: '#f8d7da', color: '#721c24', border: 'none' }} onClick={() => handleDelete(s._id)}>Delete</button>
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

export default ManageSubCategories;

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const empty = { name: '', slug: '', origin: '', description: '', website: '', isActive: true };

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = () => api.get('/brands/all').then(r => setBrands(r.data.data));
  useEffect(() => { fetch(); }, []);

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) { await api.put(`/brands/${editId}`, form); toast.success('Brand updated!'); }
      else { await api.post('/brands', form); toast.success('Brand added!'); }
      setForm(empty); setEditId(null); setShowForm(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  const handleEdit = (b) => {
    setForm({ name: b.name, slug: b.slug, origin: b.origin || '', description: b.description || '', website: b.website || '', isActive: b.isActive });
    setEditId(b._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    await api.delete(`/brands/${id}`);
    toast.success('Brand deleted'); fetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Brands</h1>
        <button className="btn btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}>+ Add Brand</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, background: '#fffbf7', border: '1px solid #E8650A30' }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>{editId ? 'Edit' : 'Add'} Brand</div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Brand Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} required />
              </div>
              <div className="form-group">
                <label>Origin / State</label>
                <input className="form-control" value={form.origin} onChange={set('origin')} placeholder="e.g. Gujarat, Maharashtra" />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input className="form-control" value={form.website} onChange={set('website')} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
                  <option value="true">Active</option><option value="false">Inactive</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Description</label>
                <input className="form-control" value={form.description} onChange={set('description')} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Brand'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>Brand</th><th>Slug</th><th>Origin</th><th>Website</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {!brands.length ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 30 }}>No brands yet</td></tr>
            ) : brands.map(b => (
              <tr key={b._id}>
                <td style={{ fontWeight: 600 }}>{b.name}</td>
                <td style={{ color: '#888', fontSize: 12 }}>{b.slug}</td>
                <td style={{ color: '#666' }}>{b.origin || '—'}</td>
                <td style={{ fontSize: 12 }}>{b.website ? <a href={b.website} target="_blank" rel="noreferrer" style={{ color: '#E8650A' }}>Visit</a> : '—'}</td>
                <td><span className={`badge badge-${b.isActive ? 'success' : 'secondary'}`}>{b.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(b)}>Edit</button>
                    <button className="btn btn-sm" style={{ background: '#f8d7da', color: '#721c24', border: 'none' }} onClick={() => handleDelete(b._id)}>Delete</button>
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

export default ManageBrands;

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', brand: '', category: '', subCategory: '', price: '', mrp: '', gstPercent: 18, unit: 'pcs', weight: '', minimumOrderQty: 1, stock: 0, sku: '', isActive: true };

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = () => api.get('/products?limit=100').then(r => setProducts(r.data.data));

  useEffect(() => {
    fetch();
    api.get('/brands/all').then(r => setBrands(r.data.data));
    api.get('/categories/all').then(r => setCategories(r.data.data));
    api.get('/subcategories/all').then(r => setSubCategories(r.data.data));
  }, []);

  const set = k => e => {
    const val = e.target.value;
    const updated = { ...form, [k]: val };
    if (k === 'category') {
      setFilteredSubs(subCategories.filter(s => (s.category?._id || s.category) === val));
      updated.subCategory = '';
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), mrp: Number(form.mrp), minimumOrderQty: Number(form.minimumOrderQty), stock: Number(form.stock), gstPercent: Number(form.gstPercent) };
      if (editId) { await api.put(`/products/${editId}`, payload); toast.success('Product updated!'); }
      else { await api.post('/products', payload); toast.success('Product added!'); }
      setForm(emptyForm); setEditId(null); setShowForm(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', brand: p.brand?._id || p.brand, category: p.category?._id || p.category, subCategory: p.subCategory?._id || p.subCategory || '', price: p.price, mrp: p.mrp || '', gstPercent: p.gstPercent, unit: p.unit, weight: p.weight || '', minimumOrderQty: p.minimumOrderQty, stock: p.stock, sku: p.sku || '', isActive: p.isActive });
    setFilteredSubs(subCategories.filter(s => (s.category?._id || s.category) === (p.category?._id || p.category)));
    setEditId(p._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted'); fetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Products</h1>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24, background: '#fffbf7', border: '1px solid #E8650A30' }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>{editId ? 'Edit' : 'Add'} Product</div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Product Name *</label>
                <input className="form-control" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label>Brand *</label>
                <select className="form-control" value={form.brand} onChange={set('brand')} required>
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" value={form.category} onChange={set('category')} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Sub-category</label>
                <select className="form-control" value={form.subCategory} onChange={set('subCategory')}>
                  <option value="">Select Sub-category</option>
                  {filteredSubs.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input className="form-control" value={form.sku} onChange={set('sku')} placeholder="e.g. SUH-BIR-50" />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input className="form-control" type="number" value={form.price} onChange={set('price')} required min="0" />
              </div>
              <div className="form-group">
                <label>MRP (₹)</label>
                <input className="form-control" type="number" value={form.mrp} onChange={set('mrp')} min="0" />
              </div>
              <div className="form-group">
                <label>GST %</label>
                <select className="form-control" value={form.gstPercent} onChange={set('gstPercent')}>
                  <option value={0}>0%</option><option value={5}>5%</option>
                  <option value={12}>12%</option><option value={18}>18%</option><option value={28}>28%</option>
                </select>
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select className="form-control" value={form.unit} onChange={set('unit')}>
                  <option value="pcs">pcs</option><option value="kg">kg</option>
                  <option value="bags">bags</option><option value="box">box</option><option value="litre">litre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Weight / Volume</label>
                <input className="form-control" value={form.weight} onChange={set('weight')} placeholder="e.g. 500g, 1L" />
              </div>
              <div className="form-group">
                <label>Min Order Qty</label>
                <input className="form-control" type="number" value={form.minimumOrderQty} onChange={set('minimumOrderQty')} min="1" />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input className="form-control" type="number" value={form.stock} onChange={set('stock')} min="0" />
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
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>MRP</th><th>MOQ</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {!products.length ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: 30 }}>No products yet</td></tr>
            ) : products.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: 600, maxWidth: 160 }}>{p.name}</td>
                <td>{p.brand?.name}</td>
                <td style={{ fontSize: 12, color: '#888' }}>{p.category?.name}</td>
                <td style={{ fontWeight: 600, color: '#B04D06' }}>₹{p.price}</td>
                <td style={{ color: '#aaa', fontSize: 12, textDecoration: 'line-through' }}>₹{p.mrp || '—'}</td>
                <td style={{ fontSize: 13 }}>{p.minimumOrderQty} {p.unit}</td>
                <td style={{ fontSize: 13 }}>{p.stock}</td>
                <td><span className={`badge badge-${p.isActive ? 'success' : 'secondary'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-sm" style={{ background: '#f8d7da', color: '#721c24', border: 'none' }} onClick={() => handleDelete(p._id)}>Del</button>
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

export default ManageProducts;

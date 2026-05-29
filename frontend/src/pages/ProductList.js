import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data));
    api.get('/brands').then(r => setBrands(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCat) params.set('category', selectedCat);
    if (selectedBrand) params.set('brand', selectedBrand);
    api.get(`/products?${params}`).then(r => { setProducts(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [search, selectedCat, selectedBrand]);

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
      <h1 className="page-title">All Products</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar filters */}
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Search</div>
            <input className="form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Category</div>
            <select className="form-control" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Brand</div>
            <select className="form-control" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        {/* Products grid */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>No products found</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

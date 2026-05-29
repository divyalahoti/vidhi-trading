import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const BRANDS = [
  { name: 'Suhana', color: '#E8650A' }, { name: 'Ramdev', color: '#1D9E75' },
  { name: 'MDH', color: '#D4537E' }, { name: 'Everest', color: '#378ADD' },
  { name: 'Patanjali', color: '#BA7517' }, { name: 'Tata Salt', color: '#639922' },
  { name: 'Fortune', color: '#533AB7' }, { name: 'Aashirvaad', color: '#993C1D' },
];

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=8').then(r => { setProducts(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #E8650A 0%, #B04D06 100%)', color: '#fff', padding: '60px 0' }}>
        <div className="container">
          <div style={{ maxWidth: 600 }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>B2B Wholesale Platform</span>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: '16px 0 12px', lineHeight: 1.2 }}>Gujarat's Trusted FMCG Distributor</h1>
            <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.7, marginBottom: 24 }}>Order in bulk from top brands — Suhana, Ramdev, MDH, Everest and more. GST invoices provided. Minimum order quantities apply.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/products" className="btn" style={{ background: '#fff', color: '#E8650A', fontWeight: 700 }}>Browse Products →</Link>
              <Link to="/register" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>Register as B2B</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {/* Stats */}
<div style={{ background: '#fff', borderBottom: '1px solid #dee2e6' }}>
  <div className="container" style={{ display: 'flex' }}>
    {[['500+', 'Products'], ['50+', 'Brands'], ['1000+', 'B2B Clients'], ['Same Day', 'Dispatch']].map(([v, l]) => (
      <div key={l} style={{ flex: 1, padding: '20px 0', textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#E8650A' }}>{v}</div>
        <div style={{ fontSize: 12, color: '#888' }}>{l}</div>
      </div>
    ))}
  </div>
</div>

{/* Login prompt banner — only show if not logged in */}
{!user && (
  <div style={{ background: '#1a1a2e', color: '#fff', padding: '14px 0' }}>
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      <div style={{ fontSize: 14 }}>
        🔒 <strong>Wholesale prices are hidden.</strong> Register as a B2B buyer to see pricing and place bulk orders.
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/login" style={{ padding: '7px 16px', background: '#E8650A', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
          Login
        </Link>
        <Link to="/register" style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, fontSize: 13, border: '1px solid rgba(255,255,255,0.3)' }}>
          Register
        </Link>
      </div>
    </div>
  </div>
)}

      <div className="container" style={{ paddingTop: 40 }}>
        {/* Brands */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Featured Brands</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
          {BRANDS.map(b => (
            <Link key={b.name} to={`/products?brand=${b.name}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fff', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#333', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = b.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#dee2e6'}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color }}></div>
              {b.name}
            </Link>
          ))}
        </div>

        {/* Products */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Popular Products</h2>
          <Link to="/products" style={{ fontSize: 13, color: '#E8650A', fontWeight: 600 }}>View All →</Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading products...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* CTA */}
        <div style={{ background: '#FDF0E6', borderRadius: 12, padding: 32, textAlign: 'center', marginTop: 48 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ready to order wholesale?</h3>
          <p style={{ color: '#666', marginBottom: 20 }}>Register your business and start ordering in bulk today.</p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 15 }}>Get Started as B2B Buyer →</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

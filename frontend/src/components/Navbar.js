import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #dee2e6', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 60, gap: 20 }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: '#E8650A', letterSpacing: -0.5 }}>
          🏪 Vidhi Trading
        </Link>
        <div style={{ flex: 1, display: 'flex', gap: 20, marginLeft: 20 }}>
          <Link to="/" style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>Home</Link>
          <Link to="/products" style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>Products</Link>
          {user && <Link to="/orders" style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>My Orders</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={{ fontSize: 14, color: '#E8650A', fontWeight: 600 }}>Admin Panel</Link>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/cart" style={{ position: 'relative', padding: '6px 14px', background: '#FDF0E6', borderRadius: 8, color: '#B04D06', fontWeight: 600, fontSize: 14 }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#E8650A', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#555' }}>Hi, {user.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

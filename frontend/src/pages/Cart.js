import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, subtotal, gst, total, updateQty, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!cartItems.length) return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <h2 style={{ marginTop: 16, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: '#888', marginBottom: 24 }}>Add products to get started</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
      <h1 className="page-title">Shopping Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Cart items */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #dee2e6', fontWeight: 600, fontSize: 14 }}>
            {cartItems.length} item(s)
          </div>
          {cartItems.map(({ product: p, quantity }) => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderBottom: '1px solid #f1f3f5' }}>
              <div style={{ width: 60, height: 60, background: '#FDF0E6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🛍️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{p.brand?.name}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Min. {p.minimumOrderQty} {p.unit}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => updateQty(p._id, quantity - 1)} style={{ width: 28, height: 28, border: '1px solid #dee2e6', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 16 }}>-</button>
                <span style={{ fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => updateQty(p._id, quantity + 1)} style={{ width: 28, height: 28, border: '1px solid #dee2e6', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
              <div style={{ fontWeight: 700, color: '#B04D06', minWidth: 70, textAlign: 'right' }}>₹{(p.price * quantity).toLocaleString('en-IN')}</div>
              <button onClick={() => removeFromCart(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: 16 }}>🗑</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Order Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
              <span style={{ color: '#666' }}>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
              <span style={{ color: '#666' }}>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
              <span style={{ color: '#666' }}>Shipping</span><span style={{ color: '#28a745', fontWeight: 600 }}>Free</span>
            </div>
            <div style={{ borderTop: '1px solid #dee2e6', marginTop: 12, paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
              <span>Total</span><span style={{ color: '#B04D06' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#888' }}>Accepted: UPI · NEFT/RTGS · Credit · COD</div>
            <button
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 16, fontSize: 15, padding: '11px 0' }}>
              {user ? '🔒 Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

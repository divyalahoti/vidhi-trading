import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div
      className="card"
      style={{ padding: '1rem', transition: 'box-shadow 0.15s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <Link to={`/products/${product._id}`}>
        <div style={{
          width: '100%', height: 120, background: '#FDF0E6', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, marginBottom: 10
        }}>
          🛍️
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
          {product.name}
        </div>

        <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
          {product.brand?.name} · {product.category?.name}
        </div>

        {/* PRICE — only show if logged in */}
        {user ? (
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#B04D06' }}>
                ₹{product.price}
              </span>
              {product.mrp && (
                <span style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>
                  ₹{product.mrp}
                </span>
              )}
              {product.mrp && (
                <span style={{ fontSize: 11, color: '#28a745', fontWeight: 600 }}>
                  {Math.round((1 - product.price / product.mrp) * 100)}% off
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              Min. order: {product.minimumOrderQty} {product.unit}
            </div>
          </div>
        ) : (
          <div style={{
            background: '#f8f9fa', border: '1px dashed #dee2e6',
            borderRadius: 8, padding: '8px 10px', marginBottom: 6, textAlign: 'center'
          }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>
              🔒 B2B Price Hidden
            </div>
            <div style={{ fontSize: 11, color: '#E8650A', fontWeight: 600 }}>
              Login to see wholesale price
            </div>
          </div>
        )}
      </Link>

      {/* ADD TO CART — only if logged in */}
      {user ? (
        <button onClick={handleAdd} className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 13, marginTop: 4 }}>
          + Add to Cart
        </button>
      ) : (
        <button onClick={() => navigate('/login')}
          style={{
            width: '100%', padding: '7px', borderRadius: 8, fontSize: 13,
            border: '1px solid #E8650A', background: 'transparent',
            color: '#E8650A', cursor: 'pointer', fontWeight: 500, marginTop: 4
          }}>
          Login to Order
        </button>
      )}
    </div>
  );
};

export default ProductCard;
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data.data);
      setQty(r.data.data.minimumOrderQty);
    });
  }, [id]);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>Loading...</div>
  );

  const handleAdd = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product, qty);
    toast.success('Added to cart!');
  };

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
      <Link to="/products" style={{ fontSize: 13, color: '#888', marginBottom: 16, display: 'inline-block' }}>
        ← Back to Products
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Product image */}
        <div style={{
          background: '#FDF0E6', borderRadius: 12, height: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100
        }}>
          🛍️
        </div>

        {/* Product info */}
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
            {product.category?.name} {product.subCategory ? `› ${product.subCategory.name}` : ''}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{product.name}</h1>

          <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
            Brand: <strong>{product.brand?.name}</strong> · SKU: {product.sku}
          </div>

          {/* PRICE SECTION */}
          {user ? (
            <div style={{
              background: '#FDF0E6', borderRadius: 10, padding: '16px 20px', marginBottom: 20
            }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Wholesale Price (B2B)</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#B04D06' }}>
                  ₹{product.price}
                </span>
                {product.mrp && (
                  <span style={{ fontSize: 16, color: '#aaa', textDecoration: 'line-through' }}>
                    MRP ₹{product.mrp}
                  </span>
                )}
                {product.mrp && (
                  <span style={{
                    background: '#d4edda', color: '#155724',
                    padding: '3px 8px', borderRadius: 6, fontSize: 13, fontWeight: 600
                  }}>
                    {Math.round((1 - product.price / product.mrp) * 100)}% off
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
                + GST {product.gstPercent}% applicable · Min. order: {product.minimumOrderQty} {product.unit}
              </div>
            </div>
          ) : (
            <div style={{
              background: '#f8f9fa', border: '2px dashed #dee2e6',
              borderRadius: 10, padding: '24px 20px', marginBottom: 20, textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                Wholesale Price Hidden
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                Register as a B2B buyer to see wholesale pricing and place bulk orders
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => navigate('/login')} className="btn btn-primary">
                  Login to See Price
                </button>
                <Link to="/register" className="btn btn-outline">
                  Register as B2B
                </Link>
              </div>
            </div>
          )}

          {/* Product details */}
          <div style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>Weight: <strong>{product.weight}</strong></div>
              <div>Unit: <strong>{product.unit}</strong></div>
              <div>Stock: <strong>{product.stock} available</strong></div>
              <div>GST: <strong>{product.gstPercent}%</strong></div>
            </div>
          </div>

          {/* QTY + ADD TO CART — only if logged in */}
          {user ? (
            <>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Qty:</label>
                <button
                  onClick={() => setQty(Math.max(product.minimumOrderQty, qty - 1))}
                  style={{ width: 32, height: 32, border: '1px solid #dee2e6', borderRadius: 8, cursor: 'pointer', background: '#fff', fontSize: 18 }}>
                  -
                </button>
                <span style={{ fontSize: 16, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{ width: 32, height: 32, border: '1px solid #dee2e6', borderRadius: 8, cursor: 'pointer', background: '#fff', fontSize: 18 }}>
                  +
                </button>
                <span style={{ fontSize: 12, color: '#888' }}>
                  (Min. {product.minimumOrderQty})
                </span>
              </div>

              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#333' }}>
                Subtotal: ₹{(product.price * qty).toLocaleString('en-IN')}
                <span style={{ fontSize: 12, color: '#888', fontWeight: 400, marginLeft: 6 }}>
                  + ₹{Math.round(product.price * qty * product.gstPercent / 100)} GST
                </span>
              </div>

              <button onClick={handleAdd} className="btn btn-primary"
                style={{ fontSize: 15, padding: '12px 28px' }}>
                🛒 Add to Cart
              </button>
            </>
          ) : (
            <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>
              Login to place bulk orders and access B2B pricing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
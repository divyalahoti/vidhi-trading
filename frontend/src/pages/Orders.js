import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const STATUS_COLORS = {
  Placed: 'warning', Confirmed: 'warning', Processing: 'warning',
  Dispatched: 'secondary', Delivered: 'success', Cancelled: 'danger'
};

const STATUS_PROGRESS = {
  Placed: 10, Confirmed: 30, Processing: 55, Dispatched: 78, Delivered: 100, Cancelled: 0
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => { setOrders(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>
  );

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 40 }}>
      <h1 className="page-title">My Orders</h1>

      {!orders.length ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 64 }}>📦</div>
          <h3 style={{ marginTop: 16, marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: '#888', marginBottom: 20 }}>Browse products and place your first bulk order</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        orders.map(o => (
          <div key={o._id} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#E8650A' }}>{o.orderId}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                  {o.items.length} item(s) · {o.paymentMethod}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#B04D06' }}>
                  ₹{o.totalAmount?.toLocaleString('en-IN')}
                </div>
                <span className={`badge badge-${STATUS_COLORS[o.orderStatus] || 'secondary'}`}
                  style={{ marginTop: 6, display: 'inline-block' }}>
                  {o.orderStatus}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            {o.orderStatus !== 'Cancelled' && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 4 }}>
                  <span>Placed</span>
                  <span>Confirmed</span>
                  <span>Processing</span>
                  <span>Dispatched</span>
                  <span>Delivered</span>
                </div>
                <div style={{ height: 6, background: '#f1f3f5', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${STATUS_PROGRESS[o.orderStatus] || 0}%`,
                    background: o.orderStatus === 'Delivered'
                      ? '#28a745'
                      : 'linear-gradient(90deg, #E8650A, #B04D06)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            )}

            {/* Items preview */}
            <div style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>
              {o.items.slice(0, 2).map((item, i) => (
                <span key={i}>
                  {item.name} × {item.quantity}
                  {i < Math.min(o.items.length, 2) - 1 ? ', ' : ''}
                </span>
              ))}
              {o.items.length > 2 && (
                <span style={{ color: '#E8650A', fontWeight: 600 }}> +{o.items.length - 2} more</span>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                to={`/orders/track/${o._id}`}
                className="btn btn-primary btn-sm"
                style={{ fontSize: 13 }}>
                📍 Track Order
              </Link>
              <Link
                to={`/orders/track/${o._id}`}
                className="btn btn-outline btn-sm"
                style={{ fontSize: 13 }}>
                View Details
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
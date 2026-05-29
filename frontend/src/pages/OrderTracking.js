import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const STEPS = [
  { key: 'Placed',      label: 'Order Placed',   icon: '🛒', desc: 'Your order has been received' },
  { key: 'Confirmed',   label: 'Confirmed',       icon: '✅', desc: 'Order confirmed by Vidhi Trading' },
  { key: 'Processing',  label: 'Processing',      icon: '⚙️', desc: 'Your order is being packed' },
  { key: 'Dispatched',  label: 'Dispatched',      icon: '🚚', desc: 'Order is on the way' },
  { key: 'Delivered',   label: 'Delivered',       icon: '📦', desc: 'Order delivered successfully' },
];

const STATUS_INDEX = {
  Placed: 0, Confirmed: 1, Processing: 2, Dispatched: 3, Delivered: 4, Cancelled: -1
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/my/${id}`)
      .then(r => { setOrder(r.data.data); setLoading(false); })
      .catch(() => { setError('Order not found'); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>Loading order...</div>
  );

  if (error) return (
    <div className="container" style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48 }}>❌</div>
      <h3 style={{ marginTop: 16 }}>{error}</h3>
      <Link to="/orders" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Orders</Link>
    </div>
  );

  const currentStep = STATUS_INDEX[order.orderStatus];
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 780 }}>

      {/* Back */}
      <Link to="/orders" style={{ fontSize: 13, color: '#888', display: 'inline-block', marginBottom: 20 }}>
        ← Back to My Orders
      </Link>

      {/* Order Header */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#E8650A' }}>{order.orderId}</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
              Payment: <strong>{order.paymentMethod}</strong> ·
              <span style={{
                marginLeft: 6,
                color: order.paymentStatus === 'Paid' ? '#28a745' : '#856404',
                fontWeight: 600
              }}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#B04D06' }}>
              ₹{order.totalAmount?.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {order.items.length} item(s) · GST included
            </div>
          </div>
        </div>
      </div>

      {/* Cancelled Banner */}
      {isCancelled && (
        <div style={{
          background: '#f8d7da', border: '1px solid #f5c6cb',
          borderRadius: 10, padding: 20, marginBottom: 20, textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>❌</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#721c24' }}>Order Cancelled</div>
          <div style={{ fontSize: 13, color: '#721c24', marginTop: 6 }}>
            This order has been cancelled. Contact us for refund queries.
          </div>
        </div>
      )}

      {/* Timeline */}
      {!isCancelled && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 28 }}>Order Status Timeline</div>

          <div style={{ position: 'relative' }}>
            {/* Progress line background */}
            <div style={{
              position: 'absolute', top: 20, left: 20,
              width: 2, height: `calc(100% - 48px)`,
              background: '#dee2e6', zIndex: 0
            }} />

            {/* Progress line fill */}
            <div style={{
              position: 'absolute', top: 20, left: 20,
              width: 2,
              height: currentStep === 0
                ? 0
                : `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 20px)`,
              background: 'linear-gradient(180deg, #E8650A, #B04D06)',
              zIndex: 1,
              transition: 'height 0.5s ease'
            }} />

            {STEPS.map((step, index) => {
              const isDone = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;

              return (
                <div key={step.key} style={{
                  display: 'flex', gap: 20, alignItems: 'flex-start',
                  marginBottom: index < STEPS.length - 1 ? 32 : 0,
                  position: 'relative', zIndex: 2
                }}>
                  {/* Circle */}
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    background: isDone ? '#28a745' : isCurrent ? '#E8650A' : '#f8f9fa',
                    border: `3px solid ${isDone ? '#28a745' : isCurrent ? '#E8650A' : '#dee2e6'}`,
                    boxShadow: isCurrent ? '0 0 0 4px rgba(232,101,10,0.15)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {isDone ? (
                      <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>✓</span>
                    ) : (
                      <span style={{ filter: isPending ? 'grayscale(1) opacity(0.4)' : 'none' }}>
                        {step.icon}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ paddingTop: 8, flex: 1 }}>
                    <div style={{
                      fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                      fontSize: 15,
                      color: isPending ? '#aaa' : isCurrent ? '#E8650A' : '#222',
                    }}>
                      {step.label}
                      {isCurrent && (
                        <span style={{
                          marginLeft: 10, fontSize: 11, background: '#FDF0E6',
                          color: '#E8650A', padding: '2px 8px', borderRadius: 20, fontWeight: 600
                        }}>
                          Current
                        </span>
                      )}
                      {isDone && (
                        <span style={{
                          marginLeft: 10, fontSize: 11, background: '#d4edda',
                          color: '#155724', padding: '2px 8px', borderRadius: 20, fontWeight: 600
                        }}>
                          Done
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>
                      {step.desc}
                    </div>
                    {/* Show timestamp for done and current steps */}
                    {(isDone || isCurrent) && (
                      <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                        {new Date(order.updatedAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Items Ordered</div>
        {order.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f1f3f5' : 'none'
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, background: '#FDF0E6', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
              }}>🛍️</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  Qty: {item.quantity} × ₹{item.price}
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: '#B04D06' }}>
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Price Breakdown</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
          <span style={{ color: '#666' }}>Subtotal</span>
          <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
          <span style={{ color: '#666' }}>GST Amount</span>
          <span>₹{order.gstAmount?.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
          <span style={{ color: '#666' }}>Shipping</span>
          <span style={{ color: '#28a745', fontWeight: 600 }}>Free</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontWeight: 700, fontSize: 17,
          borderTop: '1px solid #dee2e6', paddingTop: 12, marginTop: 4
        }}>
          <span>Total Paid</span>
          <span style={{ color: '#B04D06' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress?.street && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📍 Shipping Address</div>
          <div style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
            Pincode: {order.shippingAddress.pincode}
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderTracking;
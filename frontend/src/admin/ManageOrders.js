import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { Placed: 'warning', Confirmed: 'warning', Processing: 'warning', Dispatched: 'secondary', Delivered: 'success', Cancelled: 'danger' };
const ORDER_STATUSES = ['Placed', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetch = () => api.get('/orders').then(r => { setOrders(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const updateStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus, paymentStatus });
      toast.success('Status updated!');
      fetch();
      setSelectedOrder(null);
    } catch (err) { toast.error('Failed to update'); }
  };

  return (
    <div>
      <h1 className="page-title">All Orders</h1>

      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: 500, maxHeight: '80vh', overflow: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{selectedOrder.orderId}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Customer</div>
              <div style={{ fontSize: 13, color: '#555' }}>{selectedOrder.customer?.name} · {selectedOrder.customer?.businessName}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{selectedOrder.customer?.email} · {selectedOrder.customer?.phone}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Items</div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #f1f3f5' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>Subtotal</span><span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>GST</span><span>₹{selectedOrder.gstAmount?.toLocaleString('en-IN')}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}><span>Total</span><span style={{ color: '#B04D06' }}>₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</span></div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Update Status</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ORDER_STATUSES.map(s => (
                  <button key={s} className={`btn btn-sm ${selectedOrder.orderStatus === s ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => updateStatus(selectedOrder._id, s, s === 'Delivered' ? 'Paid' : selectedOrder.paymentStatus)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Business</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {!orders.length ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: 30 }}>No orders yet</td></tr>
              ) : orders.map(o => (
                <tr key={o._id}>
                  <td style={{ fontWeight: 700, color: '#E8650A' }}>{o.orderId}</td>
                  <td style={{ fontSize: 13 }}>{o.customer?.name}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{o.customer?.businessName}</td>
                  <td style={{ fontSize: 13 }}>{o.items.length}</td>
                  <td style={{ fontWeight: 600 }}>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                  <td><span className="badge badge-secondary">{o.paymentMethod}</span></td>
                  <td><span className={`badge badge-${STATUS_COLORS[o.orderStatus] || 'secondary'}`}>{o.orderStatus}</span></td>
                  <td style={{ fontSize: 12, color: '#888' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedOrder(o)}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;

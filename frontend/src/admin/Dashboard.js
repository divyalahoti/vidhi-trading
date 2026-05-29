import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const STATUS_COLORS = { Placed:'warning', Confirmed:'warning', Processing:'warning', Dispatched:'secondary', Delivered:'success', Cancelled:'danger' };

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(r => { setData(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading dashboard...</div>;

  const stats = [
    { label: 'Total Orders', value: data?.totalOrders || 0, icon: '🧾', color: '#E8650A' },
    { label: 'Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#28a745' },
    { label: 'Active Products', value: data?.totalProducts || 0, icon: '📦', color: '#378ADD' },
    { label: 'B2B Customers', value: data?.totalCustomers || 0, icon: '👥', color: '#533AB7' },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #dee2e6', fontWeight: 700, fontSize: 15 }}>Recent Orders</div>
        {!data?.recentOrders?.length ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No orders yet</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Business</th><th>Amount</th><th>Payment</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map(o => (
                <tr key={o._id}>
                  <td style={{ fontWeight: 600, color: '#E8650A' }}>{o.orderId}</td>
                  <td>{o.customer?.name}</td>
                  <td style={{ color: '#888', fontSize: 12 }}>{o.customer?.businessName}</td>
                  <td style={{ fontWeight: 600 }}>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                  <td><span className="badge badge-secondary">{o.paymentMethod}</span></td>
                  <td><span className={`badge badge-${STATUS_COLORS[o.orderStatus] || 'secondary'}`}>{o.orderStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

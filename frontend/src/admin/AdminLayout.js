import React, { useEffect, useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const links = [
  { to: '/admin',               label: '📊 Dashboard',      end: true },
  { to: '/admin/categories',    label: '📂 Categories' },
  { to: '/admin/subcategories', label: '📁 Sub-categories' },
  { to: '/admin/brands',        label: '🏷️ Brands' },
  { to: '/admin/products',      label: '📦 Products' },
  { to: '/admin/orders',        label: '🧾 Orders' },
  { to: '/admin/customers',     label: '👥 Customers' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showBell, setShowBell] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('readOrderIds') || '[]'); }
    catch { return []; }
  });
  const bellRef = useRef(null);

  // Fetch new orders every 30 seconds
  useEffect(() => {
    const fetchOrders = () => {
      api.get('/orders').then(r => {
        const orders = r.data.data || [];
        // Only show last 10 orders as notifications
        const recent = orders.slice(0, 10);
        setNotifications(recent);
        // Count unread
        const unread = recent.filter(o => !readIds.includes(o._id)).length;
        setUnreadCount(unread);
      }).catch(() => {});
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [readIds]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBell(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleBellClick = () => {
    setShowBell(prev => !prev);
    // Mark all as read
    const allIds = notifications.map(n => n._id);
    const merged = [...new Set([...readIds, ...allIds])];
    setReadIds(merged);
    setUnreadCount(0);
    localStorage.setItem('readOrderIds', JSON.stringify(merged));
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const STATUS_COLORS = {
    Placed: '#E8650A', Confirmed: '#378ADD', Processing: '#533AB7',
    Dispatched: '#1D9E75', Delivered: '#28a745', Cancelled: '#dc3545'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: '#1a1a2e', color: '#fff', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#E8650A' }}>🏪 Vidhi Trading</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Admin Panel</div>
        </div>
        <div style={{ padding: '12px 8px', flex: 1 }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              style={({ isActive }) => ({
                display: 'block', padding: '10px 14px', borderRadius: 8,
                fontSize: 13, fontWeight: 500, marginBottom: 4,
                color: isActive ? '#E8650A' : '#bbb',
                background: isActive ? 'rgba(232,101,10,0.15)' : 'transparent',
                transition: 'all 0.15s', textDecoration: 'none',
              })}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>{user?.email}</div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, color: '#bbb', cursor: 'pointer', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar with notification bell */}
        <div style={{ background: '#fff', borderBottom: '1px solid #dee2e6', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>

          <div style={{ fontSize: 13, color: '#888' }}>
            Welcome, <strong>{user?.name}</strong>
          </div>

          {/* Notification Bell */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <button
              onClick={handleBellClick}
              style={{
                position: 'relative', width: 40, height: 40, borderRadius: '50%',
                border: '1px solid #dee2e6', background: showBell ? '#FDF0E6' : '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, transition: 'all 0.15s'
              }}>
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: '#dc3545', color: '#fff',
                  borderRadius: '50%', width: 20, height: 20,
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #fff', animation: 'pulse 1.5s infinite'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showBell && (
              <div style={{
                position: 'absolute', top: 48, right: 0,
                width: 340, background: '#fff',
                borderRadius: 12, border: '1px solid #dee2e6',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                zIndex: 1000, overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>🔔 Notifications</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{notifications.length} recent orders</div>
                </div>

                {/* Notification list */}
                <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 13 }}>
                      No orders yet
                    </div>
                  ) : (
                    notifications.map(order => {
                      const isUnread = !readIds.includes(order._id);
                      return (
                        <div
                          key={order._id}
                          onClick={() => { navigate('/admin/orders'); setShowBell(false); }}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f8f9fa',
                            cursor: 'pointer',
                            background: isUnread ? '#fffbf7' : '#fff',
                            transition: 'background 0.15s',
                            display: 'flex', gap: 12, alignItems: 'flex-start'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={e => e.currentTarget.style.background = isUnread ? '#fffbf7' : '#fff'}
                        >
                          {/* Icon */}
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: STATUS_COLORS[order.orderStatus] + '18',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, flexShrink: 0
                          }}>
                            {order.orderStatus === 'Placed' ? '🛒'
                              : order.orderStatus === 'Confirmed' ? '✅'
                              : order.orderStatus === 'Processing' ? '⚙️'
                              : order.orderStatus === 'Dispatched' ? '🚚'
                              : order.orderStatus === 'Delivered' ? '📦' : '❌'}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                              <div style={{ fontWeight: isUnread ? 700 : 500, fontSize: 13, color: '#222' }}>
                                {order.orderId}
                              </div>
                              <div style={{ fontSize: 11, color: '#aaa', flexShrink: 0 }}>
                                {timeAgo(order.createdAt)}
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                              {order.customer?.businessName || order.customer?.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                              <span style={{
                                fontSize: 11, padding: '2px 8px', borderRadius: 20,
                                background: STATUS_COLORS[order.orderStatus] + '20',
                                color: STATUS_COLORS[order.orderStatus], fontWeight: 600
                              }}>
                                {order.orderStatus}
                              </span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#B04D06' }}>
                                ₹{order.totalAmount?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Unread dot */}
                          {isUnread && (
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8650A', flexShrink: 0, marginTop: 6 }} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f3f5', textAlign: 'center' }}>
                  <button
                    onClick={() => { navigate('/admin/orders'); setShowBell(false); }}
                    style={{ fontSize: 13, color: '#E8650A', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    View All Orders →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '28px 32px', flex: 1 }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
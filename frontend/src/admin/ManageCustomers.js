import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => api.get('/customers').then(r => { setCustomers(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const toggleActive = async (id) => {
    try { await api.put(`/customers/${id}/toggle`); toast.success('Status updated'); fetch(); }
    catch { toast.error('Error'); }
  };

  return (
    <div>
      <h1 className="page-title">B2B Customers</h1>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>Name</th><th>Business</th><th>Email</th><th>Phone</th><th>GST No.</th><th>City</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {!customers.length ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: 30 }}>No customers yet</td></tr>
              ) : customers.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.businessName || '—'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{c.email}</td>
                  <td style={{ fontSize: 13 }}>{c.phone || '—'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{c.gstNumber || '—'}</td>
                  <td style={{ fontSize: 13 }}>{c.address?.city || '—'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><span className={`badge badge-${c.isActive ? 'success' : 'danger'}`}>{c.isActive ? 'Active' : 'Blocked'}</span></td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleActive(c._id)}>
                      {c.isActive ? 'Block' : 'Activate'}
                    </button>
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

export default ManageCustomers;

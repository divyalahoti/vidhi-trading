import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', businessName:'', gstNumber:'', phone:'', city:'', state:'Gujarat', pincode:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, address: { city: form.city, state: form.state, pincode: form.pincode } });
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '30px 0' }}>
      <div style={{ width: 480, background: '#fff', borderRadius: 12, border: '1px solid #dee2e6', padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#E8650A' }}>🏪 Vidhi Trading</div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>Register as B2B Buyer</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group"><label>Full Name *</label><input className="form-control" value={form.name} onChange={set('name')} required /></div>
            <div className="form-group"><label>Email *</label><input className="form-control" type="email" value={form.email} onChange={set('email')} required /></div>
            <div className="form-group"><label>Password *</label><input className="form-control" type="password" value={form.password} onChange={set('password')} minLength={6} required /></div>
            <div className="form-group"><label>Phone *</label><input className="form-control" value={form.phone} onChange={set('phone')} required /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Business Name *</label><input className="form-control" value={form.businessName} onChange={set('businessName')} required /></div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>GST Number</label><input className="form-control" value={form.gstNumber} onChange={set('gstNumber')} placeholder="24ABCDE1234F1Z5" /></div>
            <div className="form-group"><label>City</label><input className="form-control" value={form.city} onChange={set('city')} /></div>
            <div className="form-group"><label>Pincode</label><input className="form-control" value={form.pincode} onChange={set('pincode')} /></div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: 15 }} disabled={loading}>
            {loading ? 'Registering...' : 'Create B2B Account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
          Already have an account? <Link to="/login" style={{ color: '#E8650A', fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

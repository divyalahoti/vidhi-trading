import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      if (loggedInUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <div style={{ width: 400, background: '#fff', borderRadius: 12, border: '1px solid #dee2e6', padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#E8650A' }}>🏪 Vidhi Trading</div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 6 }}>B2B FMCG Portal</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@business.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: 15 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#E8650A', fontWeight: 600 }}>Register as B2B</Link>
        </div>
        <div style={{ marginTop: 20, padding: 12, background: '#f8f9fa', borderRadius: 8, fontSize: 12, color: '#666' }}>
          <strong>Demo credentials:</strong><br />
          Admin: admin@vidhitrading.com / admin123<br />
          Customer: rajesh@hariom.com / pass123
        </div>
      </div>
    </div>
  );
};

export default Login;
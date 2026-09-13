import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await API.post('/auth/login', { email, password });
      const data = response.data;

      // Store tokens and user identifiers in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('Farmer-ID', data.farmerId || data.userId);
      localStorage.setItem('userId', data.farmerId || data.userId);
      localStorage.setItem('userName', data.userInfo?.name || 'Farmer');

      if (setUser) {
        setUser({ name: data.userInfo?.name || 'Farmer', isAuthenticated: true });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);
      const msg = error.response?.data?.message || error.response?.data?.error || 'සර්වර් එකට සම්බන්ධ වීමට නොහැක. (Failed to connect to server)';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const pageStyle = { minHeight: '100vh', backgroundImage: `url('/login.jfif')`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column' };
  const loginContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '20px' };
  const cardStyle = { backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px' };
  const inputStyle = { width: '100%', padding: '12px', margin: '5px 0 15px 0', borderRadius: '10px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '12px', backgroundColor: loading ? '#6b9e71' : '#3d7a44', color: '#fff', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' };
  const errorAlertStyle = { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={loginContainer}>
        <div style={cardStyle}>
          <h2 style={{textAlign: 'center', color: '#1c3c1c', marginBottom: '20px'}}>Welcome Back! 👋</h2>
          
          {errorMsg && <div style={errorAlertStyle}>{errorMsg}</div>}

          <form onSubmit={handleLogin} autoComplete="off">
            <label style={{fontWeight: 'bold', color: '#1c3c1c'}}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="example@gmail.com" 
              value={formData.email}
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
            
            <label style={{fontWeight: 'bold', color: '#1c3c1c'}}>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
            
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p style={{textAlign: 'center', marginTop: '15px'}}>
            Don't have an account? <span onClick={() => navigate('/register')} style={{color: '#3d7a44', cursor: 'pointer', fontWeight: 'bold'}}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', email: '', contact_no: '', address: '', password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await API.post('/auth/register', formData);
      if (response.status === 201 || response.status === 200) {
        setSuccessMsg("Registration Successful! Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      }
    } catch (error) {
      console.error("Register Error:", error);
      const msg = error.response?.data?.error || error.response?.data?.message || "ලියාපදිංචිය අසාර්ථකයි. (Registration failed)";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', margin: '5px 0 15px 0', borderRadius: '10px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '12px', backgroundColor: loading ? '#6b9e71' : '#3d7a44', color: '#fff', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' };
  const labelStyle = { fontWeight: 'bold', color: '#1c3c1c' };
  const errorAlertStyle = { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' };
  const successAlertStyle = { backgroundColor: '#dcfce7', color: '#15803d', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' };

  return (
    <div style={{ minHeight: '100vh', backgroundImage: `url('/login.jfif')`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '20px' }}>
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <h2 style={{textAlign: 'center', color: '#1c3c1c', marginBottom: '20px'}}>Create Account</h2>
          
          {errorMsg && <div style={errorAlertStyle}>{errorMsg}</div>}
          {successMsg && <div style={successAlertStyle}>{successMsg}</div>}

          <form onSubmit={handleRegister} autoComplete="off">
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="Enter your full name..." required autoComplete="no-name" />
            
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="Enter your email..." required autoComplete="no-email" />
            
            <label style={labelStyle}>Contact Number</label>
            <input type="text" name="contact_no" value={formData.contact_no} onChange={handleChange} style={inputStyle} placeholder="Enter your contact number..." required autoComplete="no-contact" />
            
            <label style={labelStyle}>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} placeholder="Enter your address..." required autoComplete="no-address" />
            
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} placeholder="Enter your password..." required autoComplete="new-password" />
            
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <p style={{textAlign: 'center', marginTop: '15px'}}>
            Already have an account? <span onClick={() => navigate('/login')} style={{color: '#3d7a44', cursor: 'pointer', fontWeight: 'bold'}}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}
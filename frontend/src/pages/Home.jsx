import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  // image layout
  const containerStyle = {
    backgroundImage: "url('/home.jpg')",
    backgroundSize: '100% 100%',     /* full screen background image */
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',  
    height: 'calc(100vh - 77px)',    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '8%',
    boxSizing: 'border-box',
    width: '100%'
  };

  const titleStyle = {
    fontSize: '46px',
    fontWeight: '900',
    color: '#0d230d',
    lineHeight: '1.2',
    margin: '0 0 20px 0',
    fontStyle: 'italic',
    fontFamily: '"Georgia", "Times New Roman", serif' 
  };

  const descStyle = {
    fontSize: '20px',
    fontWeight: '500',
    color: '#1a331a',
    maxWidth: '480px',
    lineHeight: '1.5',
    margin: '0 0 35px 0',
    fontFamily: 'sans-serif'
  };

  const registerBtnStyle = {
    backgroundColor: '#3d7a44',
    color: 'white',
    padding: '10px 36px',
    borderRadius: '16px',
    fontSize: '22px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0, width: '100%', overflow: 'hidden' }}>
      {/*Navigation bar*/}
      <Navbar />
      
      <div style={containerStyle}>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'left' }}
        >
          
          {/*Title*/}
          <h1 style={titleStyle}>
            Farmer Decision Support <br /> Web System
          </h1>
          
          {/*Description*/}
          <p style={descStyle}>
            To provide farmers with an easy and intelligent digital solution for better agricultural decision-making and sustainable farming.
          </p>
          
          {/* Register Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button 
              onClick={() => navigate('/register')} 
              style={registerBtnStyle}
            >
              Register
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
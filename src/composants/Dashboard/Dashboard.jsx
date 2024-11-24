// src/components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle your logout logic here (e.g., clear user data, call Firebase logout, etc.)
    console.log('Logging out...');
    // Redirect to login page or home page
    navigate('/'); // Adjust this path according to your routing
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Your Dashboard!</h1>
      <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

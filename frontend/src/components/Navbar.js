import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/AuthSlice';

export default function Navbar() {
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', padding: 12, background: '#333', color: '#fff', marginBottom: 16 }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: 16 }}>Home</Link>
      {isAuthenticated ? (
        <>
          <span style={{ marginRight: 12 }}>Hello, {username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginRight: 8 }}>Login</Link>
          <Link to="/signup" style={{ color: '#fff', textDecoration: 'none' }}>Sign Up</Link>
        </>
      )}
    </nav>
  );
}
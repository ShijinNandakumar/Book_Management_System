import React, { useState } from 'react';
import { useLoginMutation } from '../../app/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from './AuthSlice';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ username, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate('/');
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error.data?.message || 'Failed to login'}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      /><br/>
      <button type="submit" disabled={isLoading}>Login</button>
    </form>
  );
}
import React, { useState } from 'react';
import { useSignupMutation } from '../../app/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from './AuthSlice';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await signup({ username, password }).unwrap();
      dispatch(setCredentials(userData));
      navigate('/');
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error.data?.message || 'Failed to sign up'}</p>}
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
      <button type="submit" disabled={isLoading}>Sign Up</button>
    </form>
  );
}
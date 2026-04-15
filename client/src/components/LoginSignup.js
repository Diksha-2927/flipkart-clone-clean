import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const LoginSignup = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please fill all fields.');
      return;
    }

    if (mode === 'signup' && !name) {
      setMessage('Please enter your name to sign up.');
      return;
    }

    const user = { name: name || email.split('@')[0], email, password };
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.dispatchEvent(new Event('authChanged'));
    setMessage(mode === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
    setTimeout(() => navigate('/'), 800);
  };

  return (
    <div className="login-signup-page">
      <div className="login-card">
        <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
        <p>{mode === 'login' ? 'Login to continue shopping.' : 'Join us and start shopping instantly.'}</p>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </label>
          <button type="submit" className="primary-btn">
            {mode === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <button className="mode-switch" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}>
          {mode === 'login' ? 'Create a new account' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;

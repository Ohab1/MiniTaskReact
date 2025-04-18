import React, { useEffect, useState } from 'react';
import './AuthForm.css';
import { url } from '../constant';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { isTokenValid } from '../utils';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenValid()) {
      navigate('/home'); // ✅ Already logged in? Redirect to home
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${url}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("data", data);

      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.log("error", err);
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {loading ? (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Please wait... Logging you in 🔄</p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p>Enter your credentials to login</p>

          <div className="input-with-icon">
            <MdEmail className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="input-with-icon">
            <MdLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {error && <div className="auth-error">{error}</div>}
          <button type="submit">Login</button>

          <div className="auth-toggle-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;

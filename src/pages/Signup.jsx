import React, { useState } from 'react';
import './AuthForm.css';
import { url } from '../constant';
import { MdEmail, MdLock } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${url}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token && data.user) {
        console.log("success", data);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Sign up with your email</p>

        <div className="input-with-icon">
          <MdEmail className="input-icon" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
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

        <div className="input-with-icon">
          <MdLock className="input-icon" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(prev => !prev)}
          >
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Sign Up</button>

        <div className="auth-toggle-link">
          Already have an account? <a href="/">Login</a>
        </div>
      </form>
    </div>
  );
}

export default Signup;

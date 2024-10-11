import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';
import loginIllustration from '../assets/login-illustration.png';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    // Giriş işlemi başarılı olduğunda admin paneline yönlendir
    // Burada gerçek bir kimlik doğrulama yapılmadığı için doğrudan yönlendiriyoruz
    navigate('/admin-panel');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h2>Admin Log in Page</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Log in</button>
          </form>
        </div>
        <div className="login-right">
          <img src={loginIllustration} alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

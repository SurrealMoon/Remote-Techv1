import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore'; // authStore dosyasını içe aktarın
import './AdminLoginPage.css';
import loginIllustration from '../assets/login-illustration.png';

const AdminLoginPage = () => {
  const [username, setUsername] = useState(''); // Email yerine username kullanıyoruz
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Store'dan login işlevini alın
  const error = useAuthStore((state) => state.error); // Store'dan error durumunu alın

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);


    // Store'daki login işlevini çağır
    const isLoggedIn = await login(username, password);

    if (isLoggedIn) {
      navigate('/admin-panel'); // Başarılı girişte yönlendirme
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h2>Admin Log in Page</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Kullanıcı Adı</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className="login-right">
          <img src={loginIllustration} alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

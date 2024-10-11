import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './components/AdminLoginPage';
import AdminPanel from './components/AdminPanel';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/admin-panel/*" element={<AdminPanel />} /> {/* Yıldız ile alt rotalar */}
      </Routes>
    </Router>
  );
};

export default App;

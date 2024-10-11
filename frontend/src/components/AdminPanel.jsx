import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import ManageQuestionPackage from './ManageQuestionPackage';

const AdminPanel = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Kullanıcının oturumunu kapat
        localStorage.removeItem('user'); // Kullanıcı bilgilerini kaldır
        navigate('/'); // Giriş sayfasına yönlendirme
    };

    return (
        <div className="admin-panel">
            <div className="sidebar">
                <h2>Admin Panel</h2>
                <ul>
                    <li><a href="#manage-packages">Manage Question Packages</a></li>
                    <li><a href="#other-section">Other Section</a></li>
                    <li>
                        <a href="#logout" onClick={handleLogout}>Log Out</a>
                    </li>
                </ul>
            </div>
            <div className="main-content">
                <h1>Welcome to Admin Panel</h1>
                <ManageQuestionPackage />
            </div>
        </div>
    );
};

export default AdminPanel;

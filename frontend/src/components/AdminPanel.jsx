import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import ManageQuestionPackage from './ManageQuestionPackage';
import InterviewList from './InterviewList'; // InterviewList bileşeni
import CreateInterviewModal from './CreateInterviewModal'; // Modal bileşeni

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('manage-packages'); // Hangi bölümün aktif olduğunu tutmak için state
    const [showModal, setShowModal] = useState(false); // Modalın açılıp açılmadığını kontrol etmek için state
    const [interviews, setInterviews] = useState([]); // Interview listesi için state
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/'); // Giriş sayfasına yönlendirme
    };

    const addInterview = (newInterview) => {
        setInterviews([...interviews, newInterview]); // Yeni interview'ü listeye ekle
        setShowModal(false); // Modalı kapat
    };

    return (
        <div className="admin-panel">
            <div className="sidebar">
                <h2>Admin Panel</h2>
                <ul>
                    <li>
                        <a
                            href="#manage-packages"
                            onClick={() => setActiveSection('manage-packages')}
                        >
                            Manage Question Packages
                        </a>
                    </li>
                    <li>
                        <a
                            href="#interview-list"
                            onClick={() => setActiveSection('interview-list')}
                        >
                            Interview List
                        </a>
                    </li>
                    <li>
                        <a href="#logout" onClick={handleLogout}>
                            Log Out
                        </a>
                    </li>
                </ul>
            </div>
            <div className="main-content">
                {activeSection === 'manage-packages' && <ManageQuestionPackage />}
                
                {activeSection === 'interview-list' && (
                    <>
                        <header className="interview-header">
                            <h1>Interview List</h1>
                            <button className="add-btn" onClick={() => setShowModal(true)}>+</button>
                        </header>
                        {interviews.length === 0 ? (
                            <div>No interviews yet</div>
                        ) : (
                            <InterviewList interviews={interviews} />
                        )}
                    </>
                )}

                {showModal && <CreateInterviewModal onAddInterview={addInterview} onClose={() => setShowModal(false)} />}
            </div>
        </div>
    );
};

export default AdminPanel;

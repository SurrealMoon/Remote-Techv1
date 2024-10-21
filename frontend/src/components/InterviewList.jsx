import React, { useEffect, useState } from 'react';
import CreateInterviewModal from './CreateInterviewModal';
import './InterviewList.css';

const InterviewList = ({ onAddInterview }) => {
    const [interviews, setInterviews] = useState([]);
    const [editInterview, setEditInterview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedInterviews = JSON.parse(localStorage.getItem('interviews')) || [];
        setInterviews(storedInterviews);
        console.log('Loaded interviews from localStorage:', storedInterviews);
    }, []);

    const handleDelete = (id) => {
        const updatedInterviews = interviews.filter(interview => interview.id !== id);
        setInterviews(updatedInterviews);
        localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
    };

    const handleEdit = (interview) => {
        setEditInterview(interview);
        setIsModalOpen(true);
    };

    const handleSaveEdit = (updatedInterview) => {
        const updatedInterviews = interviews.map(interview =>
            interview.id === updatedInterview.id ? updatedInterview : interview
        );
        setInterviews(updatedInterviews);
        localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
        setEditInterview(null);
        setIsModalOpen(false);
    };

    const handleAddInterview = (newInterview) => {
        const updatedInterviews = [...interviews, newInterview];
        setInterviews(updatedInterviews);
        localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
        console.log('New interview added:', newInterview);
        setIsModalOpen(false);
    };

    return (
        <div className="interview-list-container">
            <h2>Interview List</h2>
            <button onClick={() => setIsModalOpen(true)}>Add Interview</button>
            {interviews.length > 0 ? (
                interviews.map((interview, index) => (
                    <div key={index} className="interview-card">
                        <h3>{interview.title}</h3>
                        <p>Date: {interview.date}</p>
                        <button className="see-videos-btn" onClick={() => console.log(`Viewing videos for interview ID: ${interview.id}`)}>See Videos</button>
                        <button className="edit-btn" onClick={() => handleEdit(interview)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(interview.id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p className="no-interviews">No interviews available</p>
            )}

            {/* Düzenleme modalı */}
            {editInterview && isModalOpen && (
                <CreateInterviewModal
                    onAddInterview={handleSaveEdit}
                    onClose={() => {
                        setEditInterview(null);
                        setIsModalOpen(false);
                    }}
                    initialData={editInterview}
                />
            )}

            {/* Yeni interview ekleme modalı */}
            {isModalOpen && !editInterview && (
                <CreateInterviewModal
                    onAddInterview={handleAddInterview}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default InterviewList;

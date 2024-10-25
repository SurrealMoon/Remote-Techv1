import React, { useEffect, useState } from 'react';
import CreateInterviewModal from './CreateInterviewModal';
import { useNavigate } from 'react-router-dom';
import './InterviewList.css';

const InterviewList = () => {
    const [interviews, setInterviews] = useState([]);
    const [editInterview, setEditInterview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedInterviews = JSON.parse(localStorage.getItem('interviews')) || [];
        setInterviews(storedInterviews);
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
        console.log('Adding new interview:', newInterview);
        setInterviews(updatedInterviews);
        localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
        setIsModalOpen(false);
    };

    const handleSeeVideos = (interviewId) => {
        console.log('Navigating to videos for interview:', interviewId);
        if (!interviewId) {
            console.error('No interview ID provided');
            return;
        }
        localStorage.setItem('selectedInterviewId', interviewId);
        navigate(`/videos/${interviewId}`);
    };
    

    const handleCopyLink = (interviewId) => {
        const link = `${window.location.origin}/video-recording/${interviewId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                alert('Link kopyalandı: ' + link);
            })
            .catch(err => {
                console.error('Link kopyalanamadı: ', err);
            });
    };

    return (
        <div className="interview-list-container">
            <div className="interview-list-header">
                <h2>Interview List</h2>
                <button className="create-interview-btn" onClick={() => setIsModalOpen(true)}>+ Create Interview</button>
            </div>
            {interviews.length > 0 ? (
                interviews.map((interview) => (
                    <div key={interview.id} className="interview-card">
                        <h3>{interview.title}</h3>
                        <p>Date: {interview.date}</p>
                        <button className="see-videos-btn" onClick={() => handleSeeVideos(interview.id)}>See Videos</button>
                        <button className="edit-btn" onClick={() => handleEdit(interview)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(interview.id)}>Delete</button>
                        <button className="copy-link-btn" onClick={() => handleCopyLink(interview.id)}>Copy Link</button>
                    </div>
                ))
            ) : (
                <p className="no-interviews">No interviews available</p>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <CreateInterviewModal
                    onAddInterview={editInterview ? handleSaveEdit : handleAddInterview}
                    onClose={() => {
                        setEditInterview(null);
                        setIsModalOpen(false);
                    }}
                    initialData={editInterview}
                />
            )}
        </div>
    );
};

export default InterviewList;

import React, { useEffect, useState } from 'react';
import CreateInterviewModal from './CreateInterviewModal';
import { useNavigate } from 'react-router-dom';
import './InterviewList.css';
import useInterviewStore from '../stores/useInterviewStore';

const InterviewList = () => {
  const { interviews, loadInterviews, editInterview, removeInterview, addInterview } = useInterviewStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editInterviewData, setEditInterviewData] = useState(null);
  const navigate = useNavigate();

  // Tarih formatlama fonksiyonu
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleDelete = async (id) => {
    console.log('Deleting interview with ID:', id);
    await removeInterview(id);
  };

  const handleAddInterview = async (newInterview) => {
    await addInterview(newInterview);
    setIsModalOpen(false);
  };

  const handleEdit = (interview) => {
    console.log('Editing interview with ID:', interview._id || interview.id);
    setEditInterviewData(interview);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (updatedInterview) => {
    await editInterview(updatedInterview._id, updatedInterview);
    setIsModalOpen(false);
    setEditInterviewData(null);
  };

  const handleSeeVideos = (interviewId) => {
    navigate(`/videos/${interviewId}`);
  };

  const handleCopyLink = (interviewId) => {
    const link = `${import.meta.env.VITE_INTERVIEW_URL}/video-recording/${interviewId}`;
    navigator.clipboard.writeText(link)
      .then(() => alert('Link kopyalandı: ' + link))
      .catch(err => console.error('Link kopyalanamadı: ', err));
  };

  return (
    <div className="interview-list-container">
      <div className="interview-list-header">
        <h2>Interview List</h2>
        <button className="create-interview-btn" onClick={() => setIsModalOpen(true)}>Add Interview</button>
      </div>

      {interviews.length > 0 ? (
        interviews.map((interview) => (
          <div key={interview._id} className="interview-card">
            <h3>{interview.title}</h3>
            <p className="interview-card-date">{formatDate(interview.date)}</p>
            <button onClick={() => handleSeeVideos(interview._id)}>🎬</button>
            <button onClick={() => handleEdit(interview)}>✎</button>
            <button onClick={() => handleDelete(interview._id)}>🗑</button>
            <button onClick={() => handleCopyLink(interview._id)}>🔗</button>
          </div>
        ))
      ) : (
        <p>No interviews available</p>
      )}

      {isModalOpen && (
        <CreateInterviewModal
          onAddInterview={editInterviewData ? handleSaveEdit : handleAddInterview}
          onClose={() => {
            setEditInterviewData(null);
            setIsModalOpen(false);
          }}
          initialData={editInterviewData}
        />
      )}
    </div>
  );
};

export default InterviewList;
import React, { useEffect, useState } from 'react';
import CreateInterviewModal from './CreateInterviewModal';
import { useNavigate } from 'react-router-dom';
import './InterviewList.css';
import useInterviewStore from '../stores/useInterviewStore'; // Store'u import edin

const InterviewList = () => {
  const { interviews, loadInterviews, editInterview, removeInterview, addInterview } = useInterviewStore(); // Gerekli işlevleri store'dan alın
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editInterviewData, setEditInterviewData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadInterviews(); // Bileşen yüklendiğinde mülakatları yükleyin
  }, []);

  const handleDelete = async (id) => {
    console.log('Deleting interview with ID:', id);
    await removeInterview(id); // Store'dan silme işlevini çağır
  };

  const handleAddInterview = async (newInterview) => {
    await addInterview(newInterview); // Store üzerinden yeni mülakat ekleyin
    setIsModalOpen(false); // Modalı kapat
  };

  const handleEdit = (interview) => {
    console.log('Editing interview with ID:', interview._id || interview.id); // ID değerini kontrol edin
    setEditInterviewData(interview);
    setIsModalOpen(true); // Düzenleme için modalı açın
  };

  const handleSaveEdit = async (updatedInterview) => {
    await editInterview(updatedInterview._id, updatedInterview); // Store üzerinden düzenleme işlevini çağır
    loadInterviews(); // Güncelleme sonrasında mülakatları tekrar yükleyin
    setIsModalOpen(false); // Modalı kapat
    setEditInterviewData(null);
  };

  const handleSeeVideos = (interviewId) => {
    navigate(`/videos/${interviewId}`); // Videoları görmeye yönlendir
  };

  const handleCopyLink = (interviewId) => {
    const link = `${window.location.origin}/video-recording/${interviewId}`;
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
            <p>Date: {interview.date}</p>
            <button onClick={() => handleSeeVideos(interview._id)}>See Videos</button>
            <button onClick={() => handleEdit(interview)}>Edit</button>
            <button onClick={() => handleDelete(interview._id)}>Delete</button>
            <button onClick={() => handleCopyLink(interview._id)}>Copy Link</button>
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

// src/components/SeeVideos.jsx
import React from 'react';
import './SeeVideos.css';

const SeeVideos = () => {
  // selectedInterviewId ve interviews verilerini localStorage'dan alıyoruz
  const selectedInterviewId = localStorage.getItem('selectedInterviewId');
  const interviews = JSON.parse(localStorage.getItem('interviews')) || [];
  
  console.log("Selected Interview ID:", selectedInterviewId);
  console.log("Fetched Interviews:", interviews);

  // Seçilen mülakatı interviews dizisinden buluyoruz
  const selectedInterview = interviews.find(
    interview => interview.id.toString() === selectedInterviewId?.toString()
  );

  console.log("Selected Interview:", selectedInterview);

  // Kayıtlı videoları localStorage'dan alıyoruz
  const recordedVideos = JSON.parse(localStorage.getItem('recordedVideos')) || {};
  const videos = Object.values(recordedVideos[selectedInterviewId] || {});

  if (!selectedInterview || !selectedInterview.customQuestions || selectedInterview.customQuestions.length === 0) {
    return <p>Selected interview is invalid or has no questions.</p>;
  }

  return (
    <div className="video-page">
      <h1>Videolar</h1>
      {videos.length > 0 ? (
        <div className="video-list">
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <h3>Video {index + 1}</h3>
              <video width="400" controls>
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos recorded yet.</p>
      )}
    </div>
  );
};

export default SeeVideos;

import React from 'react';
import VideoList from './VideoList';

const VideoPage = () => {
    // Seçilen mülakat ID'sini al
    const selectedInterviewId = localStorage.getItem('selectedInterviewId');
    // Mülakatları al
    const interviews = JSON.parse(localStorage.getItem('interviews')) || [];
    // Seçilen mülakatı bul
    const selectedInterview = interviews.find(interview => interview.id === Number(selectedInterviewId));

    // Eğer mülakat geçersiz veya soruları yoksa hata mesajı göster
    if (!selectedInterview || !selectedInterview.questions || selectedInterview.questions.length === 0) {
        return <p>Selected interview is invalid or has no questions.</p>;
    }

    // Kayıtlı videoları al
    const videos = JSON.parse(localStorage.getItem('recordedVideos')) || [];

    return (
        <div className="video-page">
            <h1>Videolar</h1>
            {videos.length > 0 ? (
                <VideoList videos={videos} />
            ) : (
                <p>No videos recorded yet.</p>
            )}
        </div>
    );
};

export default VideoPage;

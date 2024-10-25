import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './components/AdminLoginPage';
import AdminPanel from './components/AdminPanel';
import VideoPage from './components/VideoPage';
import InterviewRecordingPage from './components/InterviewRecordingPage'; // Video kaydetme sayfası bileşeni

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/admin-panel/*" element={<AdminPanel />} />
        <Route path="/videos/:id" element={<VideoPage />} />
        <Route path="/video-recording/:id" element={<InterviewRecordingPage />} /> {/* Video kayıt sayfası */}
      </Routes>
    </Router>
  );
};

export default App;

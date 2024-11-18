import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './components/AdminLoginPage';
import AdminPanel from './components/AdminPanel';
import SeeVideos from "./components/SeeVideos";

const App = () => {
  // Kayıt tamamlandığında yapılacak işlemler
  const handleRecordingSubmit = (recordedChunks) => {
    console.log("Recorded video chunks:", recordedChunks);
    // Kayıt işlemi ile ilgili başka işlemler burada yapılabilir.
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/admin-panel/*" element={<AdminPanel />} />
        <Route path="/videos/:id" element={<SeeVideos />} />
        <Route
          path="/video-recording/:id"
          element={<InterviewRecordingPage onSubmit={handleRecordingSubmit} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

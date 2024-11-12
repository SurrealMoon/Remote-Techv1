import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InterviewRecordingPage.css';
import { getInterviewById, getQuestionsInPackage } from '../services/interviewService';
import useCandidateStore from '../stores/useCandidateStore';

const CandidateInfoPopup = ({ onClose, interviewId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const addCandidate = useCandidateStore((state) => state.addCandidate);
  const error = useCandidateStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName && lastName && email) {
      const candidateInfo = { firstName, lastName, email, interviewId };
      try {
        await addCandidate(candidateInfo);
        onClose(candidateInfo);
      } catch (err) {
        console.error('Error adding candidate:', err);
        alert('There was an error. Please try again.');
      }
    } else {
      alert('Lütfen tüm alanları doldurun.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Kişisel Bilgilerinizi Girin</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>İsim</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label>Soyisim</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit">Onayla</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

const InterviewRecordingPage = ({ onSubmit }) => {
  const { id: interviewId } = useParams();
  console.log("Fetched interview ID:", interviewId); 
  const [interview, setInterview] = useState(null);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewData = await getInterviewById(interviewId);
        
        // Gelen mülakat verisini kaydet
        setInterview(interviewData);
        setCustomQuestions(interviewData.customQuestions || []);

        // Seçilen paket ID'sine göre soruları çekme
        if (interviewData.selectedPackage) {
          const packageQuestions = await getQuestionsInPackage(interviewData.selectedPackage);
          setQuestions(packageQuestions || []);
        }
        
      } catch (error) {
        console.error("Error fetching interview or questions:", error);
        alert("Mülakat veya soru paketi bulunamadı.");
      }
    };

    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId]);

  useEffect(() => {
    let interval;
    if (recording) {
      setTimer(0);
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data]);
          }
        };
        mediaRecorder.start();
        setRecording(true);
      })
      .catch(() => alert('Unable to access camera. Please ensure permissions are enabled.'));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setRecording(false);

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    const savedVideos = JSON.parse(localStorage.getItem('recordedVideos') || '{}');
    savedVideos[interviewId] = { videoUrl, candidateInfo };
    localStorage.setItem('recordedVideos', JSON.stringify(savedVideos));
    setRecordedChunks([]);
  };

  const handleNextQuestion = () => {
    stopRecording();
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      startRecording();
    } else if (onSubmit) {
      onSubmit(recordedChunks);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="interview-recording-page">
      {!candidateInfo && <CandidateInfoPopup onClose={setCandidateInfo} interviewId={interviewId} />}
      {candidateInfo && (
        <div className="content">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>{Math.round(progress)}%</div>
          </div>
          <div className="video-container">
            <video ref={videoRef} autoPlay muted></video>
          </div>
          <div className="info-container">
  <h3>Soru {currentQuestionIndex + 1}: {questions[currentQuestionIndex]?.questionText}</h3>
  <div className="timers">
    <div>Question Time: <span>{timer}s</span></div>
    <div>Total Time: <span>{questions.length * 120}s</span></div>
  </div>
  <div className="buttons">
    <button className="skip-button" onClick={handleNextQuestion}>Skip</button>
    <button className="start-button" onClick={recording ? stopRecording : startRecording}>
      {recording ? "Done" : "Start"}
    </button>
  </div>
</div>

        </div>
      )}
    </div>
  );
};

export default InterviewRecordingPage;

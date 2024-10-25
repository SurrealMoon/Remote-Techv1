import React, { useState, useRef, useEffect } from 'react';
import './InterviewRecordingPage.css';

const InterviewRecordingPage = ({ onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Soru paketini localStorage'dan alma
  useEffect(() => {
    const interviews = JSON.parse(localStorage.getItem('interviews'));
    const selectedInterviewId = localStorage.getItem('selectedInterviewId');

    // Mülakat verilerini kontrol et
    if (!interviews || !Array.isArray(interviews) || interviews.length === 0) {
      console.error('No interviews found in localStorage');
      alert('LocalStorage\'da mülakat bulunamadı. Lütfen bir mülakat oluşturun.');
      return;
    }

    // Seçilen mülakat ID'sini kontrol et
    if (!selectedInterviewId) {
      console.error('No selected interview ID found in localStorage');
      alert('Seçili mülakat ID\'si bulunamadı. Lütfen bir mülakat seçin.');
      return;
    }

    const selectedInterview = interviews.find(interview => interview.id === Number(selectedInterviewId));

    // Seçilen mülakatın sorularını kontrol et
    if (selectedInterview && selectedInterview.customQuestions && selectedInterview.customQuestions.length > 0) {
      setQuestions(selectedInterview.customQuestions);
    } else {
      console.error('Selected interview is invalid or has no questions');
      alert('Seçili mülakat geçersiz veya soruları yok. Lütfen geçerli bir mülakat seçin.');
    }
  }, []);

  // Timer'ı yönetmek için useEffect
  useEffect(() => {
    let interval;
    if (recording) {
      setTimer(0);
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!recording && timer > 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [recording, timer]);

  const startRecording = () => {
    // Media devices kontrolü
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Media devices are not supported in this browser.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.start();
        setRecording(true);
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        alert('Kameraya erişilemiyor. Lütfen izin verildiğinden emin olun.');
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const handleNextQuestion = () => {
    stopRecording();
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      // Kaydedilen verileri ekle
      setCurrentQuestionIndex(nextIndex);
      setRecordedChunks([]); // Yeni soru için recordedChunks'i sıfırla
      startRecording();
    } else {
      // Tüm sorular bittiğinde, son videoları gönder
      onSubmit(recordedChunks);
    }
  };

  // Eğer questions array'i boşsa veya mevcut değilse bir yüklenme mesajı göster
  if (questions.length === 0) {
    return <p>Loading selected question package...</p>;
  }

  return (
    <div className="interview-recording-page">
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{questions[currentQuestionIndex]}</p>
      <p>Timer: {timer}s</p>

      <video ref={videoRef} autoPlay muted></video>

      <div>
        {recording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
        <button onClick={handleNextQuestion} disabled={recording || timer === 0}>
          Next Question
        </button>
      </div>
    </div>
  );
};

export default InterviewRecordingPage;

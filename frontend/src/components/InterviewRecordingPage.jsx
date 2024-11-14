import { createCandidate } from '../services/candidateService';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InterviewRecordingPage.css';
import { getInterviewById, getQuestionsInPackage } from '../services/interviewService';
import useCandidateStore from '../stores/useCandidateStore';

const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append('video', file);

    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const { videoUrl } = await response.json();
            console.log('Video URL:', videoUrl); // Video URL'sini döndürür
            return videoUrl;
        } else {
            const errorText = await response.text(); // Sunucudan gelen hata mesajını al
            console.error("Server error response:", errorText);
            throw new Error('Video yüklenemedi');
        }
    } catch (error) {
        console.error("Video upload failed:", error);
        throw error;
    }
};

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
                await createCandidate(candidateInfo); 
                onClose(candidateInfo);
            } catch (err) {
                console.error('Error adding candidate:', err);
                if (err.message) {
                    alert(err.message); 
                } else {
                    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
                }
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
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [recording, setRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [showEndPopup, setShowEndPopup] = useState(false);
    const [candidateInfo, setCandidateInfo] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const interviewData = await getInterviewById(interviewId);
                const packageQuestions = await getQuestionsInPackage(interviewData.selectedPackage);
                const formattedCustomQuestions = interviewData.customQuestions.map((q, index) => ({
                    questionText: q,
                    options: [],
                    answer: null,
                    time: 1,
                    order: packageQuestions.length + index + 1,
                }));

                setQuestions([...packageQuestions, ...formattedCustomQuestions]);
            } catch (error) {
                console.error("Error fetching interview or questions:", error);
                alert("Mülakat veya soru paketi bulunamadı.");
            }
        };

        if (interviewId) fetchInterview();
    }, [interviewId]);

    useEffect(() => {
        if (!recording || showEndPopup) return;

        const currentQuestionTime = questions[currentQuestionIndex]?.time * 60 || 60;
        let localTimer = 0;

        const interval = setInterval(() => {
            localTimer++;
            setTimer(localTimer);

            if (localTimer >= currentQuestionTime) {
                clearInterval(interval);
                handleNextQuestion();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [recording, currentQuestionIndex, questions, showEndPopup]);

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

    const stopRecording = async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setRecording(false);

        const videoBlob = new Blob(recordedChunks, { type: 'video/mp4' });
        await uploadVideo(videoBlob); // Mülakat sonlandığında videoyu yükler
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setTimer(0);
        } else {
            stopRecording();
            setShowEndPopup(true);
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
                            <div>Total Time: <span>{questions.length * 60}s</span></div>
                        </div>
                        <div className="buttons">
                            <button className="skip-button" onClick={handleNextQuestion}>Next</button>
                            <button className="start-button" onClick={startRecording} disabled={showEndPopup}>
                                {recording ? "Recording..." : "Start"}
                            </button>
                        </div>
                    </div>
                    {showEndPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h2>Mülakat sonlanmıştır, katılımınız için teşekkür ederiz.</h2>
                                <button onClick={() => window.location.reload()}>Çıkış Yap</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InterviewRecordingPage;

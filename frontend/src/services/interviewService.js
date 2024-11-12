// interviewService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Mülakatları getirme
export const fetchInterviews = async () => {
    const response = await axios.get(`${API_BASE_URL}/interviews`);
    return response.data;
};

// Yeni mülakat oluşturma
export const createInterview = async (interviewData) => {
    const response = await axios.post(`${API_BASE_URL}/interviews`, interviewData);
    return response.data;
};

// Mülakat güncelleme
export const updateInterview = async (interviewId, interviewData) => {
    const response = await axios.put(`${API_BASE_URL}/interviews/${interviewId}`, interviewData);
    return response.data;
};

// Mülakat silme
export const deleteInterview = async (interviewId) => {
    const response = await axios.delete(`${API_BASE_URL}/interviews/${interviewId}`);
    return response.data;
};

// ID'ye göre mülakat getirme
export const getInterviewById = async (interviewId) => {
    const response = await axios.get(`${API_BASE_URL}/interviews/${interviewId}`);
    return response.data;
};

// Soru paketindeki soruları ID ile getirme
export const getQuestionsInPackage = async (packageId) => {
    const response = await axios.get(`${API_BASE_URL}/question-packages/${packageId}/questions`);
    return response.data;
};

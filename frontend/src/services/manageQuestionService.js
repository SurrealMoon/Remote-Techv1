// src/services/manageQuestionService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/question-packages';

// Soru ekleme
export const addQuestion = async (packageId, questionData) => {
    const response = await axios.post(`${API_BASE_URL}/${packageId}/questions`, questionData);
    return response.data;
};

// Soru güncelleme
export const updateQuestion = async (packageId, questionId, questionData) => {
    const response = await axios.put(`${API_BASE_URL}/${packageId}/questions/${questionId}`, questionData);
    return response.data;
};

// Soru silme
export const deleteQuestion = async (packageId, questionId) => {
    const response = await axios.delete(`${API_BASE_URL}/${packageId}/questions/${questionId}`);
    return response.data;
};

// Soruları sıralama (isteğe bağlı)
export const reorderQuestions = async (packageId, questions) => {
    const response = await axios.put(`${API_BASE_URL}/${packageId}/questions/reorder`, { questions });
    return response.data;
};

// Soruları paket kimliğine göre getirme
export const fetchQuestions = async (packageId) => {
    const response = await axios.get(`${API_BASE_URL}/${packageId}/questions`);
    return response.data;
};

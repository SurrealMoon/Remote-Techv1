// src/services/manageQuestionService.js
import axios from 'axios';


// Soru ekleme
export const addQuestion = async (packageId, questionData) => {
    const response = await axios.post(`/question-packages/${packageId}/questions`, questionData);
    return response.data;
};

// Soru güncelleme
export const updateQuestion = async (packageId, questionId, questionData) => {
    const response = await axios.put(`/question-packages/${packageId}/questions/${questionId}`, questionData);
    return response.data;
};

// Soru silme
export const deleteQuestion = async (packageId, questionId) => {
    const response = await axios.delete(`/question-packages/${packageId}/questions/${questionId}`);
    return response.data;
};

// Soruları sıralama (isteğe bağlı)
export const reorderQuestions = async (packageId, questions) => {
    const response = await axios.put(`/question-packages/${packageId}/questions/reorder`, { questions });
    return response.data;
};

// Soruları paket kimliğine göre getirme
export const fetchQuestions = async (packageId) => {
    const response = await axios.get(`/question-packages/${packageId}/questions`);
    return response.data;
};

// src/services/questionPackageService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/question-packages';

// Soru paketlerini çekme
export const fetchQuestionPackages = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

// Tüm paketleri listeleme
export const getQuestionPackages = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

// Yeni bir soru paketi oluşturma
export const createQuestionPackage = async (data) => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
};

// Soru paketini güncelleme
export const updateQuestionPackage = async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

// Soru paketini silme
export const deleteQuestionPackage = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};

// src/services/questionPackageService.js

import axios from 'axios';

// Soru paketlerini çekme
export const fetchQuestionPackages = async () => {
    const response = await axios.get("/question-packages");
    return response.data;
};

// Tüm paketleri listeleme
export const getQuestionPackages = async () => {
    const response = await axios.get("/question-packages");
    return response.data;
};

// Yeni bir soru paketi oluşturma
export const createQuestionPackage = async (data) => {
    const response = await axios.post("/question-packages", data);
    return response.data;
};

// Soru paketini güncelleme
export const updateQuestionPackage = async (id, data) => {
    const response = await axios.put(`/question-packages/${id}`, data);
    return response.data;
};

// Soru paketini silme
export const deleteQuestionPackage = async (id) => {
    await axios.delete(`/question-packages/${id}`);
};

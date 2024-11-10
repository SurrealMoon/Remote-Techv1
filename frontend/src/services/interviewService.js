import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/interviews';

// Mülakatları getirme
export const fetchInterviews = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

// Yeni mülakat oluşturma
export const createInterview = async (interviewData) => {
    const response = await axios.post(API_BASE_URL, interviewData);
    return response.data;
};

// Mülakat güncelleme
export const updateInterview = async (interviewId, interviewData) => {
    const response = await axios.put(`${API_BASE_URL}/${interviewId}`, interviewData);
    return response.data;
};

// Mülakat silme
export const deleteInterview = async (interviewId) => {
    const response = await axios.delete(`${API_BASE_URL}/${interviewId}`);
    return response.data;
};

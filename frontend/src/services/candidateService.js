import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Backend URL’iniz

// Aday bilgilerini kaydeden işlev
export const createCandidate = async (candidateData) => {
    const response = await axios.post(`${API_BASE_URL}/candidates`, candidateData);
    return response.data;
};

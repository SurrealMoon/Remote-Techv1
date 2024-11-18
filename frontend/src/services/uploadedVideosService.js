import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/uploaded-videos'; // Backend base URL

export const getVideosByInterview = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Hatası:', error);
    if (error.response?.status === 404) {
      return []; // 404 durumunda boş liste
    }
    throw new Error('Videolar alınırken bir hata oluştu.');
  }
};

import axios from 'axios';
 // Backend base URL

export const getVideosByInterview = async (id) => {
  try {
    const response = await axios.get(`/uploaded-videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Hatası:', error);
    if (error.response?.status === 404) {
      return []; // 404 durumunda boş liste
    }
    throw new Error('Videolar alınırken bir hata oluştu.');
  }
};

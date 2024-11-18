import { create } from 'zustand';
import { getVideosByInterview } from '../services/uploadedVideosService';

const useVideoStore = create((set) => ({
  videos: [], // Videolar burada tutulacak
  error: null, // Hata mesajları için
  fetchVideos: async (id) => { // Parametre adı "id" olarak değiştirildi
    try {
      console.log('Fetching videos for ID:', id);
      const videos = await getVideosByInterview(id);
      console.log('Fetched videos:', videos);
      set({ videos, error: null }); // State'i güncelle
    } catch (error) {
      console.error('Error fetching videos in store:', error);
      set({ error: 'Videolar alınırken bir hata oluştu.' }); // Hata durumunda
    }
  },
}));

export default useVideoStore;
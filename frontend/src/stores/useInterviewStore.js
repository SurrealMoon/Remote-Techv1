import { create } from 'zustand';
import { fetchInterviews, createInterview, deleteInterview, updateInterview } from '../services/interviewService';

const useInterviewStore = create((set) => ({
    interviews: [],
    error: null,

    // Mülakatları getirme
    loadInterviews: async () => {
        try {
            const interviews = await fetchInterviews();
            set({ interviews, error: null });
        } catch (error) {
            set({ error: error.message });
        }
    },

    // Yeni mülakat ekleme
    addInterview: async (interviewData) => {
        try {
            const newInterview = await createInterview(interviewData);
            set((state) => ({
                interviews: [...state.interviews, newInterview],
                error: null,
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    // Mülakat güncelleme
    editInterview: async (interviewId, interviewData) => {
        try {
            const updatedInterview = await updateInterview(interviewId, interviewData);
            set((state) => ({
                interviews: state.interviews.map((interview) => 
                    interview._id === interviewId ? updatedInterview : interview
                ),
                error: null,
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },
    

    // Mülakat silme
    removeInterview: async (interviewId) => {
        try {
            await deleteInterview(interviewId); // API'ye istek gönderiliyor mu kontrol edin
            set((state) => ({
                interviews: state.interviews.filter(interview => interview._id !== interviewId),
                error: null,
            }));
        } catch (error) {
            set({ error: error.message });
            console.error('Error deleting interview:', error); // Hata konsola yazılır
        }
    },
    
}));



export default useInterviewStore;

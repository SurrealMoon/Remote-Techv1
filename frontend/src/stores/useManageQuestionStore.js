// src/stores/manageQuestionStore.js
import { create } from 'zustand';
import { addQuestion, updateQuestion, deleteQuestion, reorderQuestions, fetchQuestions } from '../services/manageQuestionService';

const useManageQuestionStore = create((set) => ({
    questions: [],
    error: null,

    // Soru ekleme
    addQuestionToPackage: async (packageId, questionData) => {
        try {
            const updatedPackage = await addQuestion(packageId, questionData);
            set((state) => ({
                questions: [...state.questions, updatedPackage],
                error: null,
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    // Soru güncelleme
    updateQuestionInPackage: async (packageId, questionId, questionData) => {
        try {
            const updatedQuestion = await updateQuestion(packageId, questionId, questionData); // API’den gelen güncellenmiş soru
    
            set((state) => ({
                questions: state.questions.map((q) =>
                    q._id.toString() === questionId.toString() ? updatedQuestion : q // Kimlik uyumu
                ),
                error: null,
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },
    
    // Soru silme
    deleteQuestionFromPackage: async (packageId, questionId) => {
        try {
            await deleteQuestion(packageId, questionId);
            set((state) => ({
                questions: state.questions.filter((q) => q._id !== questionId),
                error: null,
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    // Soruları yeniden sıralama
    reorderQuestionsInPackage: async (packageId, questions) => {
        try {
            const reorderedQuestions = await reorderQuestions(packageId, questions);
            set({ questions: reorderedQuestions, error: null });
        } catch (error) {
            set({ error: error.message });
        }
    },

    // Soruları paket kimliğine göre yeniden yükleme
    fetchQuestionsFromServer: async (packageId) => {
        try {
            const questions = await fetchQuestions(packageId); // fetchQuestions işlevi çağrılır
            set({ questions, error: null });
            return questions; // Yüklenen soruları döndür
        } catch (error) {
            set({ error: error.message });
            return [];
        }
    },
}));

export default useManageQuestionStore;

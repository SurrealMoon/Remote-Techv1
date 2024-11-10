import { create } from 'zustand';
import {
    getQuestionPackages,
    createQuestionPackage,
    updateQuestionPackage,
    deleteQuestionPackage
} from '../services/questionPackageService';

const useQuestionPackageStore = create((set) => ({
    packages: [],
    error: null,

    fetchPackages: async () => {
        try {
            const packages = await getQuestionPackages();
            set({ packages });
        } catch (error) {
            set({ error: error.message });
        }
    },

    addPackage: async (data) => {
        try {
            const newPackage = await createQuestionPackage({
                packageName: data.packageName, // name yerine packageName kullanımı
                questionCount: data.questionCount || 0,
                questions: data.questions || [],
            });
            set((state) => ({ packages: [...state.packages, newPackage], error: null }));
        } catch (error) {
            set({ error: error.message });
        }
    },
    

    updatePackage: async (id, data) => {
        try {
            const updatedPackage = await updateQuestionPackage(id, data);
            set((state) => ({
                packages: state.packages.map((pkg) =>
                    pkg._id === id ? updatedPackage : pkg
                ),
                error: null
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    removePackage: async (id) => {
        try {
            await deleteQuestionPackage(id);
            set((state) => ({
                packages: state.packages.filter((pkg) => pkg._id !== id),
                error: null
            }));
        } catch (error) {
            set({ error: error.message });
        }
    }
}));

export default useQuestionPackageStore;

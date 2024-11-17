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
            const formattedPackages = packages.map((pkg) => ({
                ...pkg,
                id: pkg._id, // `_id`'yi `id` olarak yeniden adlandır
            }));
            set({ packages: formattedPackages });
        } catch (error) {
            set({ error: error.message });
        }
    },

    addPackage: async (data) => {
        try {
            const newPackage = await createQuestionPackage({
                packageName: data.packageName,
                questionCount: data.questionCount || 0,
                questions: data.questions || [],
            });
            set((state) => ({ packages: [...state.packages, { ...newPackage, id: newPackage._id }], error: null }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    updatePackage: async (id, data) => {
        try {
            const updatedPackage = await updateQuestionPackage(id, data);
            set((state) => ({
                packages: state.packages.map((pkg) =>
                    pkg.id === id ? { ...pkg, ...updatedPackage } : pkg
                ),
            }));
        } catch (error) {
            console.error("Error updating package:", error);
        }
    },

    removePackage: async (id) => {
        try {
            await deleteQuestionPackage(id);
            set((state) => ({
                packages: state.packages.filter((pkg) => pkg.id !== id),
                error: null,
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },
}));

export default useQuestionPackageStore;

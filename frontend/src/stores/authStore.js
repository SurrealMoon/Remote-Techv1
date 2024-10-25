import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    token: null,
    error: null,

    // Login işlevi
    login: async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/admin/login', {
                username: email,
                password: password,
            });
            const { token } = response.data;

            // Token'ı kaydet
            localStorage.setItem('token', token);
            set({ token, error: null });
            return true; // Başarılı giriş için true döndür
        } catch (err) {
            set({ error: 'Geçersiz kullanıcı adı veya şifre.' });
            return false; // Başarısız giriş için false döndür
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, error: null });
    }
}));

export default useAuthStore;

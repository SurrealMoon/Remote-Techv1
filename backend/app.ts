import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import { connectDB } from './config/db';
import cors from 'cors';
import questionPackageRoutes from './src/routes/questionPackageRoutes';
import adminLoginRoutes from './src/routes/adminLoginRoutes';
import createMasterAdmin from './src/services/adminService';
import interviewRoutes from './src/routes/interviewRoutes';
import candidateRoutes from './src/routes/candidateRoutes';
import videoRoutes from './src/routes/videoRoutes';




const app = express();
const PORT = process.env.PORT || 3000;

// CORS'u global olarak tüm isteklere uygulayın ve API route'larından önce tanımlayın
app.use(cors({
    origin: 'http://localhost:5173', // Frontend'in çalıştığı portu belirtisyoruz
    credentials: true, // Eğer frontend'de withCredentials kullanıyorsanız
}));

app.use(express.json());

// Uygulama başlatıldığında veritabanına bağlan ve master admin'i oluştur
(async () => {
    await connectDB();
    await createMasterAdmin();  // Master admin oluşturma fonksiyonunu bağlantı sonrasında çağır
})();

// API route'larını cors'tan sonra kullanın
app.use('/api', questionPackageRoutes);
app.use('/api', adminLoginRoutes);
app.use('/api', interviewRoutes);
app.use('/api', candidateRoutes);
app.use('/api', videoRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

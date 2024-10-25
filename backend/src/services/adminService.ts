import mongoose from 'mongoose';
import Admin from '../models/adminLoginModel';

const MONGO_URI = process.env.MONGO_URI;
const MASTER_ADMIN_USERNAME = process.env.MASTER_ADMIN_USERNAME || 'admin';
const MASTER_ADMIN_PASSWORD = process.env.MASTER_ADMIN_PASSWORD || '1234';

async function createMasterAdmin() {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI ortam değişkeni tanımlı değil.');
        }

        const existingAdmin = await Admin.findOne({ username: MASTER_ADMIN_USERNAME });
        if (existingAdmin) {
            console.log(`Admin kullanıcı '${MASTER_ADMIN_USERNAME}' zaten mevcut.`);
            return;
        }

        const admin = new Admin({
            username: MASTER_ADMIN_USERNAME,
            password: MASTER_ADMIN_PASSWORD,
        });

        await admin.save();
        console.log('Master admin başarıyla oluşturuldu.');
    } catch (error) {
        console.error('Master admin oluşturulurken hata:', error);
    }
}

export default createMasterAdmin;

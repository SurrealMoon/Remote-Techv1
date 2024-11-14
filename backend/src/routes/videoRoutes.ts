import express, { Request, Response } from 'express';
import { uploadToS3 } from '../../s3Service';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Dosyaları geçici olarak 'uploads/' klasörüne kaydeder

router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    try {
        // Multer tarafından eklenen 'file' nesnesinin varlığını kontrol edin
        if (!req.file) {
            return res.status(400).json({ error: 'Video dosyası bulunamadı' });
        }

        // Videoyu S3'e yükle
        const videoUrl = await uploadToS3(req.file);

        // Yükleme başarılı ise geçici dosyayı sil
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Temporary file deletion error:', err);
        });

        // Video URL'sini döndür
        res.status(200).json({ videoUrl });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'Video yüklenemedi' });
    }
});

export default router;
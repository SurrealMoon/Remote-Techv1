import express, { Request, Response } from 'express';
import { uploadToS3 } from '../../s3Service';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Dosyaları geçici olarak 'uploads/' klasörüne kaydeder

// Test amaçlı bir GET route ekleniyor
router.get('/test-upload', (req: Request, res: Response) => {
    res.status(200).send("Video upload route is working."); // Test yanıtı
});

// POST route - Video yükleme
router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Video dosyası bulunamadı' });
        }

        // Hem MP4 hem de WebM formatını kabul et
        if (!['video/mp4', 'video/webm'].includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'Sadece MP4 veya WebM formatındaki videolar kabul edilmektedir' });
        }

        if (req.file.size > 50 * 1024 * 1024) { // 50MB sınırı
            return res.status(400).json({ error: 'Video boyutu çok büyük (50MB üzeri).' });
        }

        const videoUrl = await uploadToS3(req.file);

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Temporary file deletion error:', err);
        });

        res.status(200).json({ videoUrl });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'Video yüklenemedi' });
    }
});


export default router;

import express, { Request, Response } from 'express';
import { uploadToS3 } from '../../s3Service';
import multer from 'multer';
import fs from 'fs';
import Video from '../models/uploadedVideosModel'; // MongoDB modeli

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Geçici dosyalar için 'uploads/' klasörü

// Test amaçlı bir GET route ekleniyor
router.get('/test-upload', (req: Request, res: Response) => {
    res.status(200).send("Video upload route is working.");
});

// POST route - Video yükleme ve MongoDB kaydı
router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    const { interviewId, candidateId } = req.body; // Interview ve candidate bilgileri

    try {
        // `req.body` içeriğini kontrol et
        console.log("Request Body:", req.body);

        // interviewId ve candidateId kontrolü
        if (!interviewId || !candidateId) {
            return res.status(400).json({
                error: 'interviewId ve candidateId alanları zorunludur.',
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Video dosyası bulunamadı.' });
        }

        // Yalnızca MP4 ve WebM formatlarını kabul edin
        if (!['video/mp4', 'video/webm'].includes(req.file.mimetype)) {
            return res.status(400).json({
                error: 'Sadece MP4 veya WebM formatındaki videolar kabul edilmektedir.',
            });
        }

        // Dosya boyutu sınırı kontrolü (50MB)
        if (req.file.size > 50 * 1024 * 1024) {
            return res.status(400).json({
                error: 'Video boyutu çok büyük (50MB üzeri).',
            });
        }

        // S3'e yükleme işlemi
        const videoUrl = await uploadToS3(req.file);

        // Geçici dosyayı sil
        if (req.file) {
            fs.unlink(req.file!.path, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Temporary file deletion error:', err);
                } else if (!err) {
                    console.log('Temporary file deleted:', req.file!.path);
                }
            });
        } else {
            console.error('No file to delete or file upload failed.');
        }
        
        
        

        // MongoDB'ye kaydet
        const videoData = new Video({
            interviewId: interviewId.trim(),
            candidateId: candidateId.trim(),
            videoUrl,
            uploadedAt: new Date(),
        });

        await videoData.save(); // MongoDB kaydı

        res.status(200).json({
            message: 'Video başarıyla yüklendi ve kaydedildi.',
            videoUrl,
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({
            error: 'Video yüklenemedi. Lütfen tekrar deneyin.',
        });
    }
});


export default router;

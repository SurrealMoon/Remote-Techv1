import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const BUCKET_NAME = "interviewcloudservice";
const REGION = "eu-north-1"; // Bölgeyi doğrudan burada tanımlayın

const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
    try {
        // Dosyanın varlığını kontrol et
        if (!fs.existsSync(file.path)) {
            throw new Error(`File does not exist at path: ${file.path}`);
        }

        // Dosya içeriğini oku
        const fileContent = fs.readFileSync(file.path);

        // Dosyanın boş olup olmadığını kontrol et
        if (fileContent.length === 0) {
            throw new Error("File is empty. Cannot upload an empty file.");
        }

        console.log("Uploading file to S3...");
        console.log("File path:", file.path);
        console.log("Bucket name:", BUCKET_NAME);
        console.log("Region:", REGION);
        console.log("File size:", fileContent.length);

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: `videos/${Date.now()}_${file.originalname}`,
            Body: fileContent,
            ContentType: "video/mp4",
        };

        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        console.log("Successfully uploaded to S3:", uploadParams.Key);

        // URL'yi manuel olarak oluşturun
        const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uploadParams.Key}`;
        console.log("Generated S3 URL:", url); // Burada log ekleniyor
        return url;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Video yüklenemedi");
    } finally {
        // Yükleme tamamlandıktan sonra geçici dosyayı sil
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error("Temporary file deletion error:", err);
            } else {
                console.log("Temporary file deleted:", file.path);
            }
        });
    }
};

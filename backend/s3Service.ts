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
        const fileContent = fs.readFileSync(file.path);

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: `videos/${Date.now()}_${file.originalname}`,
            Body: fileContent,
            ContentType: "video/mp4",
        };

        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        // URL'yi manuel olarak oluşturun
        return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${uploadParams.Key}`;
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Video yüklenemedi");
    }
};

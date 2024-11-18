import mongoose, { Schema, Document } from 'mongoose';

interface IVideo extends Document {
  interviewId: string; // İlgili mülakatın ID'si
  candidateId: string; // Videoyu yükleyen adayın ID'si
  videoUrl: string; // Amazon S3 URL'si
  uploadedAt: Date; // Yüklenme tarihi
  comment?: string; // Yorum alanı, isteğe bağlı
}

const VideoSchema: Schema = new Schema({
  interviewId: { type: String, required: true },
  candidateId: { type: String, required: true },
  videoUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  comment: { type: String }, // Videoya ait yorum alanı, isteğe bağlı
});

const Video = mongoose.model<IVideo>('Video', VideoSchema);
export default Video;

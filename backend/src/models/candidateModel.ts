import mongoose, { Schema, Document } from 'mongoose';

interface ICandidate extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string; 
    interviewId: mongoose.Types.ObjectId; // Adayın katıldığı mülakatın ID’si
}

const CandidateSchema: Schema<ICandidate> = new Schema({
    firstName: { type: String, required: true }, // Adayın adı zorunlu
    lastName: { type: String, required: true },  // Adayın soyadı zorunlu
    email: { type: String, required: true, unique: true }, // E-posta zorunlu ve benzersiz
    phone: { type: String, required: true },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true } // Mülakat ile ilişkilendirilmiş ID
});

const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);
export default Candidate;

import mongoose, { Schema, Document } from 'mongoose';

interface IInterview extends Document {
    title: string;
    candidates: number;
}

const InterviewSchema: Schema<IInterview> = new Schema({
    title: { type: String, required: true },
    candidates: { type: Number, required: true }
});

const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
export default Interview;
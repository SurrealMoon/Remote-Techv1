import mongoose, { Schema, Document } from 'mongoose';

interface IQuestionPackage extends Document {
    packageName: string;
    questionCount: number;
}

const QuestionPackageSchema: Schema<IQuestionPackage> = new Schema({
    packageName: { type: String, required: true },
    questionCount: { type: Number, required: true }
});

const QuestionPackage = mongoose.model<IQuestionPackage>('QuestionPackage', QuestionPackageSchema);
export default QuestionPackage;
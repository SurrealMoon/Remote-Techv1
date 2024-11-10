import mongoose, { Schema, Document, Types } from 'mongoose';

interface Question {
    _id?: Types.ObjectId; // Bu satır eklendi, _id'nin opsiyonel olduğuna dikkat edin
    questionText: string;
    options?: string[];
    answer: string;
    time: number;
    order: number;
}

interface IQuestionPackage extends Document {
    packageName: string;
    questions: Question[];
    questionCount: number;
}

const QuestionSchema = new Schema<Question>({
    questionText: { type: String, required: true },
    options: [String],
    answer: { type: String, required: false },
    time: { type: Number, default: 2 },
    order: { type: Number, required: true }
});

const QuestionPackageSchema: Schema<IQuestionPackage> = new Schema({
    packageName: { type: String, required: true },
    questions: { type: [QuestionSchema], default: [] },
    questionCount: { type: Number, default: 0 }
});

// Soru sayısını questions alanının uzunluğuna göre otomatik ayarlama
QuestionPackageSchema.pre<IQuestionPackage>('save', function (next) {
    this.questionCount = this.questions.length;
    next();
});

const QuestionPackage = mongoose.model<IQuestionPackage>('QuestionPackage', QuestionPackageSchema);
export default QuestionPackage;

import mongoose, { Schema, Document } from 'mongoose';

interface ICustomQuestion {
    questionText: string; // Soru metni
    time: number; // Soru için süre (dakika cinsinden)
}

interface IInterview extends Document {
    title: string;
    date: Date; // Tarih alanı
    selectedPackage: string; // Seçilen paket ID'si
    canSkip: boolean; // Atlanabilir mi?
    showAtOnce: boolean; // Aynı anda mı gösterilsin?
    customQuestions: ICustomQuestion[]; // Özelleştirilmiş sorular
}

const CustomQuestionSchema: Schema<ICustomQuestion> = new Schema({
    questionText: { type: String, required: true }, // Soru metni zorunlu
    time: { type: Number, required: true, default: 1 } // Varsayılan süre 1 dakika
});

const InterviewSchema: Schema<IInterview> = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true }, // Tarih alanı zorunlu
    selectedPackage: { type: String, required: true }, // Seçilen paket zorunlu
    canSkip: { type: Boolean, default: false }, // Varsayılan değer false
    showAtOnce: { type: Boolean, default: false }, // Varsayılan değer false
    customQuestions: { type: [CustomQuestionSchema], default: [] } // Custom questions schema ile entegre
});

const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
export default Interview;

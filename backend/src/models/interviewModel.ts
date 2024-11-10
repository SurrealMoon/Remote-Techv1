import mongoose, { Schema, Document } from 'mongoose';

interface IInterview extends Document {
    title: string;
    date: Date; // Tarih alanı
    selectedPackage: string; // Seçilen paket ID'si
    canSkip: boolean; // Atlanabilir mi?
    showAtOnce: boolean; // Aynı anda mı gösterilsin?
    customQuestions: string[]; // Özelleştirilmiş sorular
}

const InterviewSchema: Schema<IInterview> = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true }, // Tarih alanı zorunlu
    selectedPackage: { type: String, required: true }, // Seçilen paket zorunlu
    canSkip: { type: Boolean, default: false }, // Varsayılan değer false
    showAtOnce: { type: Boolean, default: false }, // Varsayılan değer false
    customQuestions: { type: [String], default: [] } // Varsayılan olarak boş bir dizi
});

const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
export default Interview;

import mongoose, { Schema, Document } from 'mongoose';

interface IAdmin extends Document {
    username: string;
    password: string;
}

const AdminSchema: Schema<IAdmin> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;

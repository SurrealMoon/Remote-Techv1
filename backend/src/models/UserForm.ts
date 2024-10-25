import mongoose, { Schema, Document } from 'mongoose';

interface IUserForm extends Document {
    name: string;
    email: string;
    phone: string;
}

const UserFormSchema: Schema<IUserForm> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

const UserForm = mongoose.model<IUserForm>('UserForm', UserFormSchema);
export default UserForm;
import mongoose, { Schema, Document } from 'mongoose';

// تحديد شكل البيانات (Schema)
interface IContact extends Document {
  name: string;
  email: string;
  message: string;
}

const contactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true }); // عشان يسجل وقت وصول الرسالة

const Contact = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
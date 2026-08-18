import { Schema, model, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  image?: string | null;
  jobTitle: string;
  bio: string;
  aboutParagraphs: string[];
  contactEmail: string;
  phone: string;
  location: string;
  cvUrl?: string;
}

const profileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  image: { type: String, default: null },
  jobTitle: { type: String, required: true },
  bio: { type: String, required: true },
  aboutParagraphs: [{ type: String }],
  contactEmail: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  cvUrl: { type: String, default: '#' },
});

export const Profile = model<IProfile>('Profile', profileSchema);
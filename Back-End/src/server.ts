import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contactRoutes from './routes/contact.js';
import projectRoutes from './routes/project.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('DB Connection Error:', err));
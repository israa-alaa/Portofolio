import { Router } from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/contact.model.js'; 
const router = Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. حفظ البيانات في داتابيز MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. إرسال الإيميل بـ Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
    });

    res.status(200).json({ success: true, message: 'Sent and Saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Operation failed' });
  }
});

export default router;
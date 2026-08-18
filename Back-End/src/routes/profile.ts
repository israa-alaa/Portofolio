import { Router } from 'express';
import { Profile } from '../models/profile.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(200).json({ message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
import { Router } from 'express';
import { Project } from '../models/project.model.js';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, liveDemoUrl, githubUrl, tags } = req.body;

    let imageBase64 = 'https://via.placeholder.com/300x200';
    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const parsedTags = tags ? JSON.parse(tags) : [];

    const newProject = new Project({
      title,
      description,
      image: imageBase64,
      liveDemoUrl: liveDemoUrl || '#',
      githubUrl: githubUrl || '#',
      tags: parsedTags,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, liveDemoUrl, githubUrl, tags } = req.body;
    const updateData: Record<string, unknown> = { title, description, liveDemoUrl, githubUrl };

    if (tags) {
      updateData.tags = JSON.parse(tags);
    }

    if (req.file) {
      updateData.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Project updated', project: updatedProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
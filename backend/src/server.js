import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'lumora_super_secret_key_2026';

app.use(cors({ origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*' }));
app.use(express.json());

// Auth Middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'LUMORA Interiors API' });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const validEmail = process.env.ADMIN_EMAIL || 'admin@lumorainteriors.com';
  const validPass = process.env.ADMIN_PASSWORD || 'lumora2026';

  if (email === validEmail && password === validPass) {
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, email });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// -------- PROJECTS CRUD --------
app.get('/api/projects', async (_req, res) => {
  try {
    const rows = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    const formatted = rows.map((p) => ({
      ...p,
      gallery: JSON.parse(p.gallery || '[]')
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.post('/api/projects', authenticateAdmin, async (req, res) => {
  try {
    const { title, category, location, area, year, image, gallery, summary, challenge, outcome } = req.body;
    if (!title || !summary) {
      return res.status(400).json({ error: 'Title and summary are required' });
    }
    const created = await prisma.project.create({
      data: {
        title,
        category: category || 'Residential',
        location: location || 'New Cairo, Egypt',
        area: area || '500 sqm',
        year: year || '2026',
        image: image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
        gallery: JSON.stringify(Array.isArray(gallery) ? gallery : [image]),
        summary,
        challenge: challenge || 'Bespoke architectural planning and material integration.',
        outcome: outcome || 'Delivered on schedule with custom millwork and lighting.'
      }
    });
    res.status(201).json({ ...created, gallery: JSON.parse(created.gallery) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, location, area, year, image, gallery, summary, challenge, outcome } = req.body;
    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        category,
        location,
        area,
        year,
        image,
        gallery: JSON.stringify(Array.isArray(gallery) ? gallery : [image]),
        summary,
        challenge,
        outcome
      }
    });
    res.json({ ...updated, gallery: JSON.parse(updated.gallery) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// -------- CONSULTATIONS (Book a Consultation Form) --------
app.get('/api/consultations', authenticateAdmin, async (_req, res) => {
  try {
    const rows = await prisma.consultation.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to load consultations' });
  }
});

app.post('/api/consultations', async (req, res) => {
  try {
    const { fullName, email, phone, projectType, location, budget, size, preferredDate, details } = req.body;
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Full name, email, and phone are required' });
    }
    const created = await prisma.consultation.create({
      data: {
        fullName,
        email,
        phone,
        projectType: projectType || 'Residential Villa',
        location: location || '',
        budget: budget || '',
        size: size || '',
        preferredDate: preferredDate || '',
        details: details || ''
      }
    });
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: 'Failed to save consultation booking' });
  }
});

app.patch('/api/consultations/:id', authenticateAdmin, async (req, res) => {
  try {
    const updated = await prisma.consultation.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update consultation status' });
  }
});

app.delete('/api/consultations/:id', authenticateAdmin, async (req, res) => {
  try {
    await prisma.consultation.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete consultation' });
  }
});

// -------- CONTACT FORM MESSAGES --------
app.get('/api/contacts', authenticateAdmin, async (_req, res) => {
  try {
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to load contact messages' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Full name, email, and message are required' });
    }
    const created = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message
      }
    });
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: 'Failed to send contact message' });
  }
});

app.patch('/api/contacts/:id', authenticateAdmin, async (req, res) => {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

app.delete('/api/contacts/:id', authenticateAdmin, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

app.listen(PORT, () => {
  console.log(`LUMORA Backend running on http://localhost:${PORT}`);
});

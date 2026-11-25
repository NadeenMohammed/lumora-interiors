import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'lumora_prod_secret_key_2026';

function getSql() {
  return neon(process.env.DATABASE_URL);
}

function verifyAdmin(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const method = req.method;

  try {
    if (path === '/health' && method === 'GET') {
      return res.status(200).json({ status: 'ok', service: 'LUMORA Vercel + Neon API' });
    }

    if (path === '/admin/login' && method === 'POST') {
      const { email, password } = req.body || {};
      const validEmail = process.env.ADMIN_EMAIL || 'admin@lumorainteriors.com';
      const validPass = process.env.ADMIN_PASSWORD || 'lumora2026';
      if (email === validEmail && password === validPass) {
        const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ token, email });
      }
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const sql = getSql();

    // -------- PROJECTS --------
    if (path === '/projects' && method === 'GET') {
      const rows = await sql`SELECT * FROM "Project" ORDER BY "createdAt" DESC`;
      return res.status(200).json(rows.map((p) => ({ ...p, gallery: JSON.parse(p.gallery || '[]') })));
    }

    if (path === '/projects' && method === 'POST') {
      if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const { title, category, location, area, year, image, gallery, summary, challenge, outcome } = req.body || {};
      if (!title || !summary) return res.status(400).json({ error: 'Title and summary are required' });
      const id = crypto.randomUUID();
      const galleryStr = JSON.stringify(Array.isArray(gallery) ? gallery : [image]);
      const rows = await sql`
        INSERT INTO "Project" ("id", "title", "category", "location", "area", "year", "image", "gallery", "summary", "challenge", "outcome", "updatedAt")
        VALUES (${id}, ${title}, ${category || 'Residential'}, ${location || 'New Cairo, Egypt'}, ${area || '500 sqm'}, ${year || '2026'}, ${image || ''}, ${galleryStr}, ${summary}, ${challenge || ''}, ${outcome || ''}, NOW())
        RETURNING *
      `;
      return res.status(201).json({ ...rows[0], gallery: JSON.parse(rows[0].gallery || '[]') });
    }

    if (path.startsWith('/projects/')) {
      if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const id = path.split('/')[2];
      if (method === 'PUT') {
        const { title, category, location, area, year, image, gallery, summary, challenge, outcome } = req.body || {};
        const galleryStr = JSON.stringify(Array.isArray(gallery) ? gallery : [image]);
        const rows = await sql`
          UPDATE "Project"
          SET "title"=${title}, "category"=${category}, "location"=${location}, "area"=${area}, "year"=${year}, "image"=${image}, "gallery"=${galleryStr}, "summary"=${summary}, "challenge"=${challenge}, "outcome"=${outcome}, "updatedAt"=NOW()
          WHERE "id"=${id}
          RETURNING *
        `;
        return res.status(200).json({ ...rows[0], gallery: JSON.parse(rows[0].gallery || '[]') });
      }
      if (method === 'DELETE') {
        await sql`DELETE FROM "Project" WHERE "id"=${id}`;
        return res.status(200).json({ deleted: true });
      }
    }

    // -------- CONSULTATIONS --------
    if (path === '/consultations' && method === 'GET') {
      if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const rows = await sql`SELECT * FROM "Consultation" ORDER BY "createdAt" DESC`;
      return res.status(200).json(rows);
    }

    if (path === '/consultations' && method === 'POST') {
      const { fullName, email, phone, projectType, location, budget, size, preferredDate, details } = req.body || {};
      if (!fullName || !email || !phone) return res.status(400).json({ error: 'Missing required fields' });
      const id = crypto.randomUUID();
      const rows = await sql`
        INSERT INTO "Consultation" ("id", "fullName", "email", "phone", "projectType", "location", "budget", "size", "preferredDate", "details")
        VALUES (${id}, ${fullName}, ${email}, ${phone}, ${projectType || 'Residential Villa'}, ${location || ''}, ${budget || ''}, ${size || ''}, ${preferredDate || ''}, ${details || ''})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (path.startsWith('/consultations/')) {
      if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const id = path.split('/')[2];
      if (method === 'PATCH') {
        const rows = await sql`UPDATE "Consultation" SET "status"=${req.body.status} WHERE "id"=${id} RETURNING *`;
        return res.status(200).json(rows[0]);
      }
      if (method === 'DELETE') {
        await sql`DELETE FROM "Consultation" WHERE "id"=${id}`;
        return res.status(200).json({ deleted: true });
      }
    }

    // -------- CONTACTS --------
    if (path === '/contacts' && method === 'GET') {
      if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const rows = await sql`SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC`;
      return res.status(200).json(rows);
    }

    if (path === '/contacts' && method === 'POST') {
      const { fullName, email, phone, subject, message } = req.body || {};
      if (!fullName || !email || !message) return res.status(400).json({ error: 'Missing required fields' });
      const id = crypto.randomUUID();
      const rows = await sql`
        INSERT INTO "ContactMessage" ("id", "fullName", "email", "phone", "subject", "message")
        VALUES (${id}, ${fullName}, ${email}, ${phone || ''}, ${subject || 'General Inquiry'}, ${message})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (path.startsWith('/contacts/')) {
      if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const id = path.split('/')[2];
      if (method === 'PATCH') {
        const rows = await sql`UPDATE "ContactMessage" SET "status"=${req.body.status} WHERE "id"=${id} RETURNING *`;
        return res.status(200).json(rows[0]);
      }
      if (method === 'DELETE') {
        await sql`DELETE FROM "ContactMessage" WHERE "id"=${id}`;
        return res.status(200).json({ deleted: true });
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

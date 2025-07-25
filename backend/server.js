const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());
app.use(express.json());
app.use('/uploads/coaches', express.static(path.join(__dirname, 'uploads/coaches')));


const readJSON = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : [];
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');

const COACHES_FILE = path.join(__dirname, 'coaches.json');
const MEMBERS_FILE = path.join(__dirname, 'members.json');
const TOURNAMENTS_FILE = path.join(__dirname, 'tournaments.json');
const NOTICES_FILE = path.join(__dirname, 'notices.json');
const GALLERY_FILE = path.join(__dirname, 'gallery.json');

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'trener@box.com' && password === 'tajna123') {
    return res.json({ token: 'mocktoken-trener', role: 'coach', email });
  }
  if (email === 'clan@box.com' && password === 'lozinka321') {
    return res.json({ token: 'mocktoken-clan', role: 'member', email });
  }
  res.status(401).json({ message: 'Neispravni podaci.' });
});


const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gallery',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});
const galleryUpload = multer({ storage: galleryStorage });


app.post('/api/gallery', galleryUpload.single('image'), (req, res) => {
  const gallery = readJSON(GALLERY_FILE);
  const newImage = {
    id: Date.now(),
    url: req.file.path,         
    public_id: req.file.filename 
  };
  gallery.push(newImage);
  writeJSON(GALLERY_FILE, gallery);
  res.status(201).json(newImage);
});

app.get('/api/gallery', (req, res) => {
  const gallery = readJSON(GALLERY_FILE);
  res.json(gallery);
});


app.get('/api/notices', (req, res) => res.json(readJSON(NOTICES_FILE)));

app.post('/api/notices', (req, res) => {
  const notices = readJSON(NOTICES_FILE);
  const nova = {
    id: Date.now(),
    ...req.body,
    datum: new Date().toISOString().split('T')[0]
  };
  notices.unshift(nova);
  writeJSON(NOTICES_FILE, notices);
  res.status(201).json(nova);
});

app.put('/api/notices/:id', (req, res) => {
  const notices = readJSON(NOTICES_FILE);
  const id = parseInt(req.params.id);
  const i = notices.findIndex(n => n.id === id);
  if (i === -1) return res.status(404).json({ message: 'Not found' });
  notices[i] = { ...notices[i], ...req.body };
  writeJSON(NOTICES_FILE, notices);
  res.json(notices[i]);
});

app.delete('/api/notices/:id', (req, res) => {
  const notices = readJSON(NOTICES_FILE).filter(n => n.id !== parseInt(req.params.id));
  writeJSON(NOTICES_FILE, notices);
  res.status(204).end();
});

app.get('/api/members', (req, res) => res.json(readJSON(MEMBERS_FILE)));

app.post('/api/members', (req, res) => {
  const members = readJSON(MEMBERS_FILE);
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email je obavezan' });
  if (members.some(m => m.email === email)) return res.status(400).json({ message: 'Clan vec postoji' });
  const novi = { id: Date.now(), ...req.body };
  members.push(novi);
  writeJSON(MEMBERS_FILE, members);
  res.status(201).json(novi);
});

app.put('/api/members/:id', (req, res) => {
  const members = readJSON(MEMBERS_FILE);
  const id = parseInt(req.params.id);
  const i = members.findIndex(m => m.id === id);
  if (i === -1) return res.status(404).json({ message: 'Not found' });
  members[i] = { ...members[i], ...req.body };
  writeJSON(MEMBERS_FILE, members);
  res.json(members[i]);
});

app.delete('/api/members/:id', (req, res) => {
  const members = readJSON(MEMBERS_FILE).filter(m => m.id !== parseInt(req.params.id));
  writeJSON(MEMBERS_FILE, members);
  res.status(204).end();
});

app.get('/api/members/by-email/:email', (req, res) => {
  const email = req.params.email.toLowerCase();
  const members = readJSON(MEMBERS_FILE);
  const clan = members.find(m => m.email.toLowerCase() === email);
  if (!clan) return res.status(404).json({ message: 'Član nije pronađen' });
  res.json(clan);
});

app.get('/api/tournaments', (req, res) => res.json(readJSON(TOURNAMENTS_FILE)));

app.post('/api/tournaments', (req, res) => {
  const tournaments = readJSON(TOURNAMENTS_FILE);
  const novi = { id: Date.now(), prijavljeni: [], ...req.body };
  tournaments.push(novi);
  writeJSON(TOURNAMENTS_FILE, tournaments);
  res.status(201).json(novi);
});

app.put('/api/tournaments/:id/prijavi', (req, res) => {
  const tournaments = readJSON(TOURNAMENTS_FILE);
  const id = parseInt(req.params.id);
  const clan = req.body.clan;
  const turnir = tournaments.find(t => t.id === id);
  if (!turnir) return res.status(404).json({ message: 'Turnir nije pronadjen' });
  if (!clan) return res.status(400).json({ message: 'Nedostaje ime clana' });
  if (!turnir.prijavljeni.includes(clan)) turnir.prijavljeni.push(clan);
  writeJSON(TOURNAMENTS_FILE, tournaments);
  res.json(turnir);
});

const coachDir = path.join(__dirname, 'uploads/coaches');
if (!fs.existsSync(coachDir)) fs.mkdirSync(coachDir, { recursive: true });

const coachStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/coaches/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const coachUpload = multer({ storage: coachStorage });

app.get('/api/coaches', (req, res) => res.json(readJSON(COACHES_FILE)));

app.post('/api/coaches', coachUpload.single('image'), async (req, res) => {
  const { ime, opis, phone, email } = req.body;
  if (!ime || !opis || !phone || !email || !req.file) {
    return res.status(400).json({ message: 'Sva polja i slika su obavezni' });
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'coaches'
  });
  const coaches = readJSON(COACHES_FILE);
  const novi = {
    id: Date.now(),
    ime,
    opis,
    phone,
    email,
    slika: result.secure_url,
    public_id: result.public_id
  };

  coaches.push(novi);
  writeJSON(COACHES_FILE, coaches);
  res.status(201).json(novi);
});

app.delete('/api/coaches/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const coaches = readJSON(COACHES_FILE);
  const coach = coaches.find(c => c.id === id);

  if (coach && coach.public_id) {
    await cloudinary.uploader.destroy(coach.public_id);
  }

  const noviCoaches = coaches.filter(c => c.id !== id);
  writeJSON(COACHES_FILE, noviCoaches);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Backend radi na http://localhost:${PORT}`));

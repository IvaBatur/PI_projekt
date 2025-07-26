const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" Spojeno na MongoDB Atlas"))
.catch(err => console.error(" Greška spajanja na bazu:", err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors({
  origin: "https://321box.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors()); 
app.use(express.json());

const Member = mongoose.model('Member', new mongoose.Schema({
  ime: String,
  prezime: String,
  datumRodenja: String,
  email: String,
  visina: Number,
  tezina: Number,
  kategorija: String
}));

const Coach = mongoose.model('Coach', new mongoose.Schema({
  ime: String,
  opis: String,
  phone: String,
  email: String,
  slika: String,
  public_id: String
}));

const Notice = mongoose.model('Notice', new mongoose.Schema({
  naslov: String,
  sadrzaj: String,
  javno: Boolean,
  datum: String
}));

const Tournament = mongoose.model('Tournament', new mongoose.Schema({
  name: String,
  location: String,
  date: String,
  prijavljeni: [String]
}));

const GalleryImage = mongoose.model('GalleryImage', new mongoose.Schema({
  url: String,
  public_id: String
}));

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
  params: { folder: 'gallery', allowed_formats: ['jpg', 'png', 'jpeg'] }
});
const galleryUpload = multer({ storage: galleryStorage });

app.post('/api/gallery', galleryUpload.single('image'), async (req, res) => {
  const newImage = await GalleryImage.create({
    url: req.file.path,
    public_id: req.file.filename
  });
  res.status(201).json(newImage);
});

app.get('/api/gallery', async (req, res) => {
  const gallery = await GalleryImage.find();
  res.json(gallery);
});

app.get('/api/notices', async (req, res) => {
  const notices = await Notice.find().sort({ _id: -1 });
  res.json(notices);
});

app.post('/api/notices', async (req, res) => {
  const nova = await Notice.create({
    ...req.body,
    datum: new Date().toISOString().split('T')[0]
  });
  res.status(201).json(nova);
});

app.put('/api/notices/:id', async (req, res) => {
  const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

app.delete('/api/notices/:id', async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/api/members', async (req, res) => {
  res.json(await Member.find());
});

app.post('/api/members', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email je obavezan' });
  const postoji = await Member.findOne({ email });
  if (postoji) return res.status(400).json({ message: 'Clan vec postoji' });
  const novi = await Member.create(req.body);
  res.status(201).json(novi);
});

app.put('/api/members/:id', async (req, res) => {
  const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

app.delete('/api/members/:id', async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/api/members/by-email/:email', async (req, res) => {
  const clan = await Member.findOne({ email: req.params.email.toLowerCase() });
  if (!clan) return res.status(404).json({ message: 'Član nije pronađen' });
  res.json(clan);
});

app.get('/api/tournaments', async (req, res) => {
  res.json(await Tournament.find());
});

app.post('/api/tournaments', async (req, res) => {
  const novi = await Tournament.create({ ...req.body, prijavljeni: [] });
  res.status(201).json(novi);
});

app.put('/api/tournaments/:id/prijavi', async (req, res) => {
  const turnir = await Tournament.findById(req.params.id);
  if (!turnir) return res.status(404).json({ message: 'Turnir nije pronadjen' });
  const clan = req.body.clan;
  if (!clan) return res.status(400).json({ message: 'Nedostaje ime clana' });
  if (!turnir.prijavljeni.includes(clan)) turnir.prijavljeni.push(clan);
  await turnir.save();
  res.json(turnir);
});


const coachStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'coaches', allowed_formats: ['jpg', 'png', 'jpeg'] }
});
const coachUpload = multer({ storage: coachStorage });

app.get('/api/coaches', async (req, res) => {
  res.json(await Coach.find());
});

app.post('/api/coaches', coachUpload.single('image'), async (req, res) => {
  const { ime, opis, phone, email } = req.body;
  if (!ime || !opis || !phone || !email || !req.file) {
    return res.status(400).json({ message: 'Sva polja i slika su obavezni' });
  }

  const novi = await Coach.create({
    ime, opis, phone, email,
    slika: req.file.path,
    public_id: req.file.filename
  });

  res.status(201).json(novi);
});

app.delete('/api/coaches/:id', async (req, res) => {
  const coach = await Coach.findById(req.params.id);
  if (coach?.public_id) {
    await cloudinary.uploader.destroy(coach.public_id);
  }
  await Coach.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Backend radi na http://localhost:${PORT}`));

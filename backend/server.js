const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const multer = require('multer');

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));

const DATA_FILE = path.join(__dirname, 'notices.json')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const readNotices = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

const writeNotices = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  if (email === 'trener@box.com' && password === 'tajna123') {
    return res.json({ token: 'mocktoken-trener', role: 'coach' })
  }
  if (email === 'clan@box.com' && password === 'lozinka321') {
    return res.json({ token: 'mocktoken-clan', role: 'member' })
  }
  return res.status(401).json({ message: 'Neispravni podaci.' })
})

app.post('/api/gallery', upload.single('image'), (req, res) => {
  res.status(201).json({ filename: req.file.filename });
});

app.get('/api/notices', (req, res) => {
  const notices = readNotices()
  res.json(notices)
})

app.post('/api/notices', (req, res) => {
  const notices = readNotices()
  const nova = {
    id: Date.now(),
    ...req.body,
    datum: new Date().toISOString().split('T')[0]
  }
  notices.unshift(nova)
  writeNotices(notices)
  res.status(201).json(nova)
})

app.put('/api/notices/:id', (req, res) => {
  const notices = readNotices()
  const id = parseInt(req.params.id)
  const index = notices.findIndex(n => n.id === id)
  if (index === -1) return res.status(404).json({ message: 'Not found' })
  const updated = { ...notices[index], ...req.body }
  notices[index] = updated
  writeNotices(notices)
  res.json(updated)
})


app.delete('/api/notices/:id', (req, res) => {
  let notices = readNotices()
  const id = parseInt(req.params.id)
  notices = notices.filter(n => n.id !== id)
  writeNotices(notices)
  res.status(204).end()
})

const MEMBERS_FILE = path.join(__dirname, 'members.json');

const readMembers = () => {
  if (!fs.existsSync(MEMBERS_FILE)) return [];
  const data = fs.readFileSync(MEMBERS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeMembers = (data) => {
  fs.writeFileSync(MEMBERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

app.get('/api/members', (req, res) => {
  const members = readMembers();
  res.json(members);
});

app.post('/api/members', (req, res) => {
  const members = readMembers();
  const novi = { id: Date.now(), ...req.body };
  members.push(novi);
  writeMembers(members);
  res.status(201).json(novi);
});

app.put('/api/members/:id', (req, res) => {
  const members = readMembers();
  const id = parseInt(req.params.id);
  const index = members.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  members[index] = { ...members[index], ...req.body };
  writeMembers(members);
  res.json(members[index]);
});

app.delete('/api/members/:id', (req, res) => {
  let members = readMembers();
  const id = parseInt(req.params.id);
  members = members.filter(m => m.id !== id);
  writeMembers(members);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(` Backend radi na http://localhost:${PORT}`)
})


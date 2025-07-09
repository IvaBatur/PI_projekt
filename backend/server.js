const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const DATA_FILE = path.join(__dirname, 'notices.json')


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

app.listen(PORT, () => {
  console.log(` Backend radi na http://localhost:${PORT}`)
})

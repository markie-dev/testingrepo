const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to create Prisma Client:', error);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctors' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.get('/', (req, res) => {
  res.send('Doctor Finder API is running');
});

app.post('/api/doctors', async (req, res) => {
  try {
    const newDoctor = await prisma.doctor.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        specialty: req.body.specialty,
        services: req.body.services,
        location: req.body.location,
        availability: req.body.availability,
      }
    });
    res.json(newDoctor);
  } catch (error) {
    res.status(500).json({ error: 'Error creating doctor' });
  }
});

// Add this new route for creating users
app.post('/api/users', async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }
    });
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Error creating user', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

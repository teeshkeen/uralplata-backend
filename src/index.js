const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const config = require('./config/default');
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const { sequelize, User } = require('./config/database'); // Добавляем импорт User
const bcrypt = require('bcryptjs');

const app = express();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
app.use(cors({
  origin: ['http://localhost:3000', 'https://web-production-5fda0.up.railway.app', 'http://localhost:5001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
});

// src/index.js
app.get('/', (req, res) => {
  res.json({
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api', productsRoutes);
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

const PORT = process.env.PORT || 5001;

// Удаляем дублирующий код и оставляем только одну синхронизацию
sequelize.sync({ force: false })
  .then(async () => {
    console.log('Database synced');
    
    // Создаем администратора, если его еще нет
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    
    try {
      const existingAdmin = await User.findOne({ where: { email: adminEmail } });
      if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        
        await User.create({
          username: 'Admin',
          email: adminEmail,
          password: hashedPassword
        });
        console.log('Admin user created successfully');
      }

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

process.on('unhandledRejection', (err) => {
  console.log('Необработанная ошибка:', err);
});
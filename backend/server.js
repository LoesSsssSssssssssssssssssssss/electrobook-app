const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const textbookRoutes = require('./routes/textbookRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/uploads/textbookAvatars', express.static('uploads/textbookAvatars'));
app.use('/uploads/categoryImages', express.static('uploads/categoryImages'));
app.use('/uploads/userAvatars', express.static('uploads/userAvatars'));

app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose
  .connect(
    'mongodb+srv://ispr220:book@electronicbooks.mrtthhg.mongodb.net/?retryWrites=true&w=majority&appName=electronicbooks'
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Роуты
//Учебники
app.use('/textbooks', textbookRoutes);
//Пользователи
app.use('/user', userRoutes);
//Администратор
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

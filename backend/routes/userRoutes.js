const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// middleware для проверки авторизации пользователя
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/userAvatars/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// роут для получения профиля пользователя
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// роут для обновления профиля пользователя
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    const updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    const updatedUser = await User.findByIdAndUpdate(req.userId, updatedData, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

router.post(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.avatar = req.file.path;
      await user.save();
      res.json({ message: 'Avatar uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  }
);

//Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email, role });
    await user.save();
    res.status(201).json({ message: 'Пользователь зарегестрирован' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Эндпоинт для получения имени пользователя по userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch username' });
  }
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;

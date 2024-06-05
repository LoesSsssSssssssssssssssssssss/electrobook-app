const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const Progress = require('../models/Progressbar');

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

//Добавление аватара пользователя
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

// Создает progress
router.post('/progress', isAuthenticated, async (req, res) => {
  const { textbook } = req.body;
  const userId = req.userId;

  try {
    // Проверяем, существует ли уже запись прогресса для данного пользователя и учебника
    const progress = await Progress.findOne({ user: userId, textbook });

    if (progress) {
      // Запись прогресса существует, возвращаем статус 200
      res.status(200).json({ message: 'Progress exists' });
    } else {
      // Запись прогресса не существует, создаем новую запись и возвращаем статус 201
      const newProgress = new Progress({
        user: userId,
        textbook,
      });
      await newProgress.save();
      res.status(201).json({ message: 'Progress created' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create or update progress' });
  }
});

//Если прогресс существует true
router.get('/progress/:userId/:textbookId', async (req, res) => {
  try {
    const { userId, textbookId } = req.params;
    const progress = await Progress.findOne({
      user: userId,
      textbook: textbookId,
    });

    if (progress) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Возвращает progress
router.get('/progressbook/:userId/:textbookId', async (req, res) => {
  const userId = req.params.userId;
  const textbookId = req.params.textbookId;

  try {
    // Найдем запись прогресса для данного пользователя и учебника
    const progress = await Progress.findOne({
      user: userId,
      textbook: textbookId,
    });

    if (!progress) {
      // Если прогресс не найден, возвращаем пустой массив
      return res.status(200).json({ completedTopics: [] });
    }

    // Возвращаем массив пройденных пользователем тем
    res.status(200).json({ completedTopics: progress.completedTopics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Добавляет пройденную тему в progress
router.post(
  '/increaseProgress/:userId/:textbookId',
  isAuthenticated,
  async (req, res) => {
    const userId = req.params.userId;
    const textbookId = req.params.textbookId;
    const topicId = req.body.topicId;

    try {
      // Находим запись прогресса для данного пользователя и учебника
      let progress = await Progress.findOne({
        user: userId,
        textbook: textbookId,
      });

      if (!progress) {
        // Если прогресс не найден, создаем новую запись с начальным значением прогресса
        progress = new Progress({
          user: userId,
          textbook: textbookId,
          completedTopics: [topicId],
        });
      } else {
        // Проверяем, есть ли уже эта тема в списке пройденных
        if (progress.completedTopics.includes(topicId)) {
          return res.status(204).send();
        }
        // Если пройденной темы еще нет, добавляем её в список пройденных
        progress.completedTopics.push(topicId);
      }

      // Сохраняем изменения в базе данных
      await progress.save();

      // Возвращаем успешный ответ
      res.status(200).json({ message: 'Progress increased successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to increase progress' });
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

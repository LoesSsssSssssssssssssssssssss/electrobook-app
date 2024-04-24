const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Textbook = require('../models/Textbook');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

const authenticateUser = async (req, res, next) => {
  // Получаем токен из заголовка Authorization
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    // Декодированный токен содержит userId
    req.user = { userId: decoded.userId }; // Устанавливаем пользователя в req.user
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const checkAdmin = (req, res, next) => {
  // Проверяем роль пользователя из базы данных
  User.findById(req.user.userId)
    .then((user) => {
      if (user && user.role === 'admin') {
        next(); // Если пользователь - админ, пропустить дальше
      } else {
        res.status(403).json({ error: 'Unauthorized access' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/textbookAvatars/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categoryImages/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const uploadCategoryImage = multer({ storage: categoryStorage });

router.get('/check-role', authenticateUser, checkAdmin, (req, res) => {
  // В этом маршруте мы уже уверены, что пользователь администратор
  res.status(200).json({ isAdmin: true });
});

// Маршрут для добавления нового учебника
router.post('/add', authenticateUser, checkAdmin, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const newTextbook = new Textbook({
      title,
      description,
      category,
    });
    await newTextbook.save();
    res
      .status(201)
      .json({ message: 'Textbook added successfully', textbook: newTextbook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/topics', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const textbook = await Textbook.findById(id);

    if (!textbook) {
      return res.status(404).json({ error: 'Textbook not found' });
    }

    textbook.topics.push({ title, content });
    await textbook.save();

    res.status(201).json({ message: 'Topic added successfully', textbook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add topic to textbook' });
  }
});

// Получение всех зарег.пользователей
router.get('/users', authenticateUser, checkAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Изменение роли пользователя
router.put('/users/:id', authenticateUser, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Удаление пользователя
router.delete('/users/:id', authenticateUser, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Удаление учебника
router.delete('/books/:id', authenticateUser, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await Textbook.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Обновление картинки учебника
router.put(
  '/books/:id/avatar',
  authenticateUser,
  checkAdmin,
  upload.single('avatar'),
  async (req, res) => {
    const { id } = req.params;
    const { filename } = req.file;

    try {
      const textbook = await Textbook.findByIdAndUpdate(
        id,
        { avatar: `uploads/textbookAvatars/${filename}` },
        { new: true }
      );

      if (!textbook) {
        return res.status(404).json({ error: 'Textbook not found' });
      }

      res.json({ message: 'Textbook avatar updated successfully', textbook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update textbook avatar' });
    }
  }
);

router.post(
  '/categories',
  authenticateUser,
  checkAdmin,
  uploadCategoryImage.single('image'),
  async (req, res) => {
    const { name, description } = req.body;
    const image = `uploads/categoryImages/${req.file.filename}`;

    try {
      const newCategory = new Category({
        name,
        image,
        description,
      });

      await newCategory.save();

      res.status(201).json({
        message: 'Category added successfully',
        category: newCategory,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add category' });
    }
  }
);

module.exports = router;

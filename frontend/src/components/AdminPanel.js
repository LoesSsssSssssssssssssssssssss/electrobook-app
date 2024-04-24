import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AllBooks from './AllBooks';

function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [titlebook, setTitleBook] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryDescription, setCategoryDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/textbooks/categories'
      );
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserRole();
    fetchUsers();
  }, []);

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      formData.append('description', categoryDescription);
      formData.append('image', categoryImage);

      const response = await axios.post(
        'http://localhost:5000/admin/categories',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      setMessage(response.data.message);
      setCategoryName('');
      setCategoryImage(null);
      setCategoryDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/admin/users/${id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers(); // После обновления роли, обновляем список пользователей
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // После успешного удаления обновляем список пользователей
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const checkUserRole = async () => {
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(
        'http://localhost:5000/admin/check-role',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/admin/add',
        {
          title: titlebook,
          description: description,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Дополнительные действия после успешного добавления, например, обновление списка учебников
      console.log(response.data);
      setMessage(response.data.message);
      setTitleBook('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isAdmin ? (
        <>
          <h2>Админ панель</h2>
          <h2>Добавить новый учебник</h2>
          <form onSubmit={handleSubmitBook}>
            <div>
              <label>Название:</label>
              <input
                type="text"
                value={titlebook}
                onChange={(e) => setTitleBook(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Описание:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label>Выберите категорию:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">Добавить учебник</button>
          </form>
          <div>{message}</div>
          <h3>Все пользователи</h3>
          <div>
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  <div>
                    <strong>{user.username}</strong> - {user.role}
                  </div>
                  <div>
                    <button onClick={() => handleDeleteUser(user._id)}>
                      Удалить
                    </button>
                  </div>
                  <div>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user._id, e.target.value)
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Добавить новую категорию</h2>
            <form onSubmit={handleSubmitCategory}>
              <div>
                <label>Название:</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Изображение:</label>
                <input
                  type="file"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  required
                />
              </div>
              <div>
                <label>Описание:</label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit">Добавить категорию</button>
            </form>
            <div>{message}</div>
          </div>
          <AllBooks isAdmin={isAdmin} />
        </>
      ) : (
        <h1>Вы не админ</h1>
      )}
    </div>
  );
}

export default AdminPanel;

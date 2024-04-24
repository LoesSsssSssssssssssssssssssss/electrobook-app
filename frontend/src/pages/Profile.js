import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import HeaderPhone from '../components/HeaderPhone';
import Footer from '../components/Footer';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: token },
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user profile');
      }
    };
    fetchUserProfile();
  }, []);

  const uploadAvatar = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
      });
    } catch (error) {
      console.error('Failed to upload avatar', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleEdit = () => {
    setEditing(true);
    setNewUsername(user.username);
    setNewEmail(user.email);
    setNewPhone(user.phone || '');
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      uploadAvatar(formData);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/user/profile',
        {
          username: newUsername,
          email: newEmail,
          phone: newPhone,
        },
        {
          headers: { Authorization: token },
        }
      );
      setEditing(false);
      window.location.reload(); // перезагрузка страницы для отображения обновленных данных
    } catch (error) {
      console.error('Failed to update user profile', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="wrapper">
          <HeaderPhone />
          <h1 className="title">Личный кабинет</h1>
          {user ? (
            <div className="profile_up">
              {user.avatar ? (
                <img
                  src={`http://localhost:5000/${user.avatar}`}
                  alt="Avatar"
                  className="profile_circle"
                />
              ) : (
                <img alt="Avatar" className="profile_circle" />
              )}
              <div className="profile_desc">
                <p>
                  Имя: <span>{user.username}</span>
                </p>
                <p>
                  Почта: <span>{user.email}</span>
                </p>
                <p>
                  Телефон: <span>{user.phone || 'Не указан'}</span>
                </p>
              </div>
              <div className="profile_btn">
                {editing ? (
                  <>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <button className="profile_button" onClick={handleSubmit}>
                      Сохранить
                    </button>
                  </>
                ) : (
                  <button className="profile_button" onClick={handleEdit}>
                    Редактировать
                  </button>
                )}
                <button className="profile_button" onClick={handleLogout}>
                  Выход
                </button>
              </div>
            </div>
          ) : (
            <div>{error || 'Loading...'}</div>
          )}
          <h2 className="subtitle">Активные учебники</h2>
          <div className="profile_books_row">
            <div className="books_block">
              <div className="books_block_up">
                <div className="books_block_up_left">
                  <h3 className="books_block_title">CSS</h3>
                  <p className="books_block_desc">
                    Базовый курс для начинающих web-разработчиков
                  </p>
                </div>
                <img src="./img/CSS3.png" alt="" className="books_block_img" />
              </div>
              <div className="books_block_down">
                <button className="profile_book_btn">
                  <a href="book_javascript.html">Продолжить</a>
                </button>
                <div className="books_block_item">
                  <progress
                    className="profile_progress"
                    max="38"
                    value="24"
                  ></progress>
                </div>
              </div>
            </div>
            <div className="books_block">
              <div className="books_block_up">
                <div className="books_block_up_left">
                  <h3 className="books_block_title">HTML</h3>
                  <p className="books_block_desc">
                    Базовый курс для начинающих web-разработчиков
                  </p>
                </div>
                <img src="./img/HTML5.png" alt="" className="books_block_img" />
              </div>
              <div className="books_block_down">
                <button className="profile_book_btn">
                  <a href="book_javascript.html">Продолжить</a>
                </button>
                <div className="books_block_item">
                  <progress
                    className="profile_progress"
                    max="38"
                    value="24"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
          <h2 className="subtitle">Пройденные учебники</h2>
          <div className="profile_books_row">
            <div className="books_block">
              <div className="books_block_up">
                <div className="books_block_up_left">
                  <h3 className="books_block_title">JavaScript</h3>
                  <p className="books_block_desc">
                    Базовый курс для начинающих web-разработчиков
                  </p>
                </div>
                <img
                  src="./img/Javascript.png"
                  alt=""
                  className="books_block_img"
                />
              </div>
              <div className="books_block_down">
                <button className="books_block_btn">
                  <a href="book_javascript.html">Еще раз</a>
                </button>
                <div className="books_block_item">
                  <progress
                    className="profile_progress"
                    max="38"
                    value="38"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Header = () => {
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [message, setMessage] = useState('');
  const [checkedAuthStatus, setCheckedAuthStatus] = useState(false);

  const logout = () => {
    localStorage.removeItem('token'); // Удаляем токен из локального хранилища
    setMessage('Logged out');
    setLoggedInUsername('');
  };

  const handleLoginSuccess = (username) => {
    setLoggedInUsername(username); // обновляем имя пользователя
  };

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${userId}`);
      setLoggedInUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));

          if (payload.userId) {
            await fetchUsername(payload.userId);
          }
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
      setCheckedAuthStatus(true); // Устанавливаем, что статус авторизации проверен
    };

    checkAuthStatus();
  }, []);
  return (
    <>
      <header className="header">
        <div className="header_wrapper">
          <Link to="/">
            <img src="/img/logo_min.png" alt="" className="logo_min" />
          </Link>
          <div className="header_a_container">
            <a href="index.html#me" className="header_a">
              О нас
            </a>
            <a href="index.html#contact" className="header_a">
              Контакты
            </a>
            <a href="index.html#faq" className="header_a">
              FAQ
            </a>
            <a href="index.html#adv" className="header_a">
              Преимущества
            </a>
            <a href="index.html#rev" className="header_a">
              Отзывы
            </a>
            <Link to="/bookspage" className="header_a">
              Учебники
            </Link>
          </div>

          {/* Показываем модальное окно только после того, как проверен статус авторизации */}
          {checkedAuthStatus && (
            <>
              {loggedInUsername ? (
                <div>
                  <p>{loggedInUsername}</p>
                  <button onClick={logout}>Выход</button>
                </div>
              ) : (
                <Modal onLoginSuccess={handleLoginSuccess} />
              )}
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

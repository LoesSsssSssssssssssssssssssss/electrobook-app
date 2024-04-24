import React, { useState } from 'react';
import axios from 'axios';

const Modal = ({ onLoginSuccess }) => {
  const [isRegistration, setIsRegistration] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (!isModalVisible) {
      setTimeout(() => {
        document
          .querySelector('.modal-overlay')
          .classList.add('modal-overlay--visible');
      }, 10);
    }
  };

  const handleSwitchMode = () => {
    setIsRegistration(!isRegistration);
  };

  const modalContentRegClass = isRegistration ? '' : 'display_none';
  const modalContentAuthClass = isRegistration ? 'display_none' : '';

  const handleOverlayClick = () => {
    setIsModalVisible(false);
    document
      .querySelector('.modal-overlay')
      .classList.remove('modal-overlay--visible');
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Остановить всплытие события
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/register', {
        username,
        password,
        email,
        role: 'user',
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        email,
        password,
      });
      setMessage(`Logged in! Token: ${response.data.token}`);
      const token = response.data.token;
      const name = response.data.username;
      localStorage.setItem('token', token);
      onLoginSuccess(name);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <>
      <button className="header_btn" onClick={toggleModal}>
        Начать
      </button>

      {isModalVisible && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div
            className="modal modal--visible"
            data-target="form-popup"
            onClick={handleModalClick}
          >
            {isRegistration ? (
              <div className={`modal_content_reg ${modalContentRegClass}`}>
                <p className="modal_title">Регистрация</p>
                <div>{message}</div>
                <div className="modal_form">
                  <div className="input_wrapper">
                    <input
                      id="name"
                      type="text"
                      className="modal_input"
                      placeholder="Имя"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      id="email"
                      type="email"
                      className="modal_input"
                      placeholder="Ваша почта"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      id="passwordReg"
                      type="password"
                      className="modal_input"
                      placeholder="Пароль"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                      id="confirmPassword"
                      type="password"
                      className="modal_input"
                      placeholder="Повторите пароль"
                      autoComplete="new-password"
                    />
                  </div>
                  <button className="profile_book_btn" onClick={register}>
                    Продолжить
                  </button>
                  <div className="auth">
                    <p>Уже есть аккаунт?</p>
                    <button className="svap" onClick={handleSwitchMode}>
                      Войти
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`modal_content_auth ${modalContentAuthClass}`}>
                <p className="modal_title">Вход</p>
                <div>{message}</div>
                <div className="modal_form">
                  <div className="input_wrapper">
                    <input
                      id="emailAuth"
                      type="email"
                      className="modal_input"
                      placeholder="Почта"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      id="passwordAuth"
                      type="password"
                      className="modal_input"
                      placeholder="Пароль"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button className="profile_book_btn" onClick={login}>
                    Продолжить
                  </button>
                  <div className="auth">
                    <p style={{ cursor: 'pointer' }}>Забыли пароль?</p>
                    <p>Нет аккаунта?</p>
                    <button className="svap2" onClick={handleSwitchMode}>
                      Регистрация
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

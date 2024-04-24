import React from 'react';
import Modal from './Modal';

const HeaderPhone = () => {
  return (
    <>
      <div className="header_phone">
        <a href="index.html">
          <img src="/img/logo_min.png" alt="" className="logo_min" />
        </a>
        <div className="menu">
          <input
            type="checkbox"
            id="burger-checkbox"
            className="burger-checkbox"
          />
          <label htmlFor="burger-checkbox" className="burger"></label>
          <div className="menu-list">
            <a href="#me" className="menu-item">
              О нас
            </a>
            <a href="#contact" className="menu-item">
              Контакты
            </a>
            <a href="#faq" className="menu-item">
              FAQ
            </a>
            <a href="#adv" className="menu-item">
              Преимущества
            </a>
            <a href="#rev" className="menu-item">
              Отзывы
            </a>
            <a href="books.html" className="menu-item">
              Учебники
            </a>
            <Modal />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderPhone;

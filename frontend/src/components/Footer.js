import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <a href="#">
          <img src="/img/logo_min2.png" alt="" className="logo_footer" />
        </a>
        <div className="footer_a_wrapper">
          <a href="index.html#me" className="footer_a">
            О нас
          </a>
          <a href="index.html#contact" className="footer_a">
            Контакты
          </a>
          <a href="index.html#faq" className="footer_a">
            FAQ
          </a>
          <a href="index.html#adv" className="footer_a">
            Преимущества
          </a>
          <a href="index.html#rev" className="footer_a">
            Отзывы
          </a>
          <a href="books.html" className="footer_a">
            Учебники
          </a>
        </div>
      </footer>
      <div className="copyright">
        © АПОУ ВО ВКСиИТ, 2023. Все права защищены. Разработано с любовью и
        усердием.
      </div>
    </>
  );
};

export default Footer;

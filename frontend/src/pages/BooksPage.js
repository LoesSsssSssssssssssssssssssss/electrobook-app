import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeaderPhone from '../components/HeaderPhone';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BooksPage() {
  const [categories, setCategories] = useState([]);
  const [textbooks, setTextbooks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTextbooks();
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

  const fetchTextbooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/textbooks/books');
      setTextbooks(response.data);
    } catch (error) {
      console.error(error);
      setMessage(error);
    }
  };

  const getBooksByCategory = (categoryId) => {
    return textbooks.filter((textbook) => textbook.category === categoryId);
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="wrapper">
          <HeaderPhone />
          <div className="title">Учебники</div>
          {categories.map((category) => (
            <div key={category._id}>
              <div className="books_name_row">
                <img
                  src={`http://localhost:5000/${category.image}`}
                  alt=""
                  className="books_img"
                />
                <h2>{category.name}</h2>
              </div>
              <div className="books_desc">{category.description}</div>
              <div className="books_row">
                {getBooksByCategory(category._id).map((book) => (
                  <div key={book._id} className="books_block">
                    <div className="books_block_up">
                      <div className="books_block_up_left">
                        <h3 className="books_block_title">{book.title}</h3>
                        <p className="books_block_desc">{book.description}</p>
                      </div>
                      <img
                        src={`http://localhost:5000/${book.avatar}`}
                        alt=""
                        className="books_block_img"
                      />
                    </div>
                    <div className="books_block_down">
                      <Link
                        to={`/book/${book._id}`}
                        className="books_block_btn"
                      >
                        Начать
                      </Link>
                      <div className="books_block_item">
                        <div className="item">
                          <img
                            src="/img/star.png"
                            alt=""
                            className="item_img"
                          />
                          <span className="item_desc">4.4</span>
                        </div>
                        <div className="item">
                          <img
                            src="/img/people.png"
                            alt=""
                            className="item_img"
                          />
                          <span className="item_desc">90к</span>
                        </div>
                        <div className="item">
                          <img
                            src="/img/clock.png"
                            alt=""
                            className="item_img"
                          />
                          <span className="item_desc">18 ч</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default BooksPage;

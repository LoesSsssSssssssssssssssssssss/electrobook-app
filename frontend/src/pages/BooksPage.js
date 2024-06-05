import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeaderPhone from '../components/HeaderPhone';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BooksPage() {
  const [categories, setCategories] = useState([]);
  const [textbooks, setTextbooks] = useState([]);
  const [progressExists, setProgressExists] = useState({});

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
    }
  };

  const fetchUserId = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/user/profile', {
        headers: { Authorization: token },
      });
      return response.data._id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const checkProgressForTextbooks = async () => {
      const userId = await fetchUserId();
      if (userId) {
        const progress = {};
        for (const textbook of textbooks) {
          const exists = await checkProgress(textbook._id, userId);
          progress[textbook._id] = exists;
        }
        setProgressExists(progress);
      }
    };

    checkProgressForTextbooks();
  }, [textbooks]);

  const checkProgress = async (textbookId, userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Failed to get user token');
      }

      const response = await axios.get(
        `http://localhost:5000/user/progress/${userId}/${textbookId}`,
        {
          headers: { Authorization: token },
        }
      );

      return response.data.exists;
    } catch (error) {
      console.error('Error checking progress:', error);
      return false;
    }
  };

  const getBooksByCategory = (categoryId) => {
    return textbooks.filter((textbook) => textbook.category === categoryId);
  };

  const renderBooks = () => {
    return categories.map((category) => (
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
                  onClick={() => handleStartClick(book._id)}
                >
                  {progressExists[book._id] ? 'Продолжить' : 'Начать'}{' '}
                  {/* Используем состояние progressExists */}
                </Link>
                <div className="books_block_item">
                  <div className="item">
                    <img src="/img/star.png" alt="" className="item_img" />
                    <span className="item_desc">4.4</span>
                  </div>
                  <div className="item">
                    <img src="/img/people.png" alt="" className="item_img" />
                    <span className="item_desc">90к</span>
                  </div>
                  <div className="item">
                    <img src="/img/clock.png" alt="" className="item_img" />
                    <span className="item_desc">18 ч</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const handleStartClick = async (textbookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Failed to get user token');
      }

      const userId = await fetchUserId();
      if (!userId) {
        throw new Error('Failed to get user ID');
      }

      // Проверяем существующую запись прогресса для данного пользователя и учебника
      const response = await axios.post(
        'http://localhost:5000/user/progress',
        {
          user: userId,
          textbook: textbookId,
        },
        {
          headers: {
            Authorization: token, // Передаем токен в заголовке запроса
          },
        }
      );

      if (response.status === 200) {
        // Если запись прогресса уже существует, переходим на страницу учебника
      } else if (response.status === 201) {
        // Если запись прогресса создана, также переходим на страницу учебника
      }
    } catch (error) {
      console.error('Error creating or updating progress:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="wrapper">
          <HeaderPhone />
          <div className="title">Учебники</div>
          {renderBooks()}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default BooksPage;

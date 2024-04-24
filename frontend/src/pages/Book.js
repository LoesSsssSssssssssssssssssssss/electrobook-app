import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import HeaderPhone from '../components/HeaderPhone';
import Footer from '../components/Footer';

const Book = () => {
  const { id } = useParams();
  const [textbooks, setTextbooks] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/textbooks/books/${id}`
        );
        setTextbooks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTopics();
  }, [id]);

  return (
    <>
      <Header />
      <div className="container">
        <div className="wrapper">
          <HeaderPhone />
          <div className="title">{textbooks.title}</div>
          <div className="progress_row">
            <div className="progress">
              <div className="progress_title">Прогресс</div>
              <progress max="38" value="24"></progress>
              <div className="progress_span">
                <span>24</span>
                <span>38</span>
              </div>
            </div>
            <button className="test_btn">Пройти тест</button>
          </div>
          <div className="insert_wrapper">
            <h2>Содержание</h2>
            <div className="insert_column">
              <ul>
                {textbooks &&
                  textbooks.topics &&
                  textbooks.topics.map((topic, index) => (
                    <li key={index}>
                      <Link
                        to={`/textbooks/books/${textbooks._id}/topics/${index}`}
                      >
                        {topic.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Book;

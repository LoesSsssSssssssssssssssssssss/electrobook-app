import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function AllBooks({ isAdmin }) {
  const [message, setMessage] = useState('');
  const [textbooks, setTextbooks] = useState([]);
  const [selectedTextbookId, setSelectedTextbookId] = useState(null);
  const [topicInputs, setTopicInputs] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchTextbooks();
  }, []);

  const fetchTextbooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/textbooks/books');
      setTextbooks(response.data);

      const newTopicInputs = {};
      response.data.forEach((textbook) => {
        newTopicInputs[textbook._id] = { title: '', content: '' };
      });
      setTopicInputs(newTopicInputs);
    } catch (error) {
      console.error(error);
      setMessage(error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/admin/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTextbooks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTopic = async (textbookId) => {
    const { title, content } = topicInputs[textbookId];

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/admin/${textbookId}/topics`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTextbooks();
      setTopicInputs({
        ...topicInputs,
        [textbookId]: { title: '', content: '' },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderContentWithCodeHighlighting = (content) => {
    const parts = content.split(/\{code\}(.*?)\{\/code\}/gs);
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return <p key={index}>{part}</p>;
      } else {
        return (
          <SyntaxHighlighter
            key={index}
            language="javascript"
            style={materialDark}
            showLineNumbers
          >
            {part}
          </SyntaxHighlighter>
        );
      }
    });
  };

  const handleSelectTextbook = (textbookId) => {
    setSelectedTextbookId(textbookId);
  };

  const handleTopicInputChange = (textbookId, field, value) => {
    setTopicInputs({
      ...topicInputs,
      [textbookId]: {
        ...topicInputs[textbookId],
        [field]: value,
      },
    });
  };

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]); // Сохраняем выбранный файл в state
  };

  const handleAvatarUpload = async (textbookId) => {
    try {
      if (!selectedFile) {
        setMessage('Выберите файл для загрузки');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/admin/books/${textbookId}/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setMessage('Аватар успешно загружен');
        fetchTextbooks(); // После успешной загрузки обновляем список учебников
      }
    } catch (error) {
      console.error(error);
      setMessage('Ошибка загрузки аватара');
    }
  };

  return (
    <div>
      <h2>Учебники</h2>
      <div>{message}</div>
      <ul>
        {textbooks.map((textbook) => (
          <li key={textbook._id} className="book_li">
            <div className="book_block">
              <strong>{textbook.title}</strong>
              <div>{textbook.description}</div>
              {textbook.avatar && (
                <img
                  src={`http://localhost:5000/${textbook.avatar}`}
                  alt={textbook.title}
                  style={{ maxWidth: '200px' }}
                />
              )}
              {isAdmin && (
                <div>
                  <label>Добавить аватар:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                  />
                  <button onClick={() => handleAvatarUpload(textbook._id)}>
                    Загрузить аватар
                  </button>
                </div>
              )}
              <div>
                {isAdmin ? (
                  <div>
                    <button onClick={() => handleDeleteBook(textbook._id)}>
                      Удалить
                    </button>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddTopic(textbook._id);
                      }}
                    >
                      <div>
                        <label>Заголовок:</label>
                        <input
                          type="text"
                          value={topicInputs[textbook._id].title}
                          onChange={(e) =>
                            handleTopicInputChange(
                              textbook._id,
                              'title',
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div>
                        <label>Содержание:</label>
                        <textarea
                          value={topicInputs[textbook._id].content}
                          onChange={(e) =>
                            handleTopicInputChange(
                              textbook._id,
                              'content',
                              e.target.value
                            )
                          }
                          rows="4"
                          required
                        />
                      </div>
                      <button type="submit">Добавить тему</button>
                    </form>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {/* Добавляем ссылку на страницу темы */}
              {selectedTextbookId === textbook._id && (
                <ul>
                  {textbook.topics.map((topic, index) => (
                    <li key={index}>
                      <Link
                        to={`/textbooks/books/${textbook._id}/topics/${index}`}
                      >
                        {topic.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => handleSelectTextbook(textbook._id)}>
                Выбрать учебник
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllBooks;

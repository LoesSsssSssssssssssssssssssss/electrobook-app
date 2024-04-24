import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import HeaderPhone from '../components/HeaderPhone';
import Footer from '../components/Footer';

function TopicDetails() {
  const { textbookId, topicIndex } = useParams();
  const [topic, setTopic] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      if (!textbookId || !topicIndex) {
        return; // Проверяем наличие textbookId и topicIndex перед отправкой запроса
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/textbooks/books/${textbookId}/topics/${topicIndex}`
        );
        setTopic(response.data);
      } catch (error) {
        console.error(error);
        setMessage('Failed to fetch topic details');
      }
    };

    fetchTopic();
  }, [textbookId, topicIndex]); // Зависимость изменяется при изменении textbookId и topicIndex

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

  if (!topic) {
    return <div>{message}</div>;
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="wrapper">
          <HeaderPhone />
          <h1 className="title">{topic.title}</h1>
          <p className="book_text">
            {renderContentWithCodeHighlighting(topic.content)}
          </p>
          {/* <p className="book_text">
            В этой части учебника мы изучаем собственно JavaScript, сам язык.
            <br />
            <br />
            Но нам нужна рабочая среда для запуска наших скриптов, и, поскольку
            это онлайн-книга, то браузер будет хорошим выбором. В этой главе мы
            сократим количество специфичных для браузера команд (например,
            <span className="pick">alert</span> ) до минимума, чтобы вы не тратили
            на них время, если планируете сосредоточиться на другой среде
            (например, Node.js). А на использовании JavaScript в браузере мы
            сосредоточимся в следующей части учебника. <br />
            <br />
            Итак, сначала давайте посмотрим, как выполнить скрипт на странице.
            Для серверных сред (например, Node.js), вы можете выполнить скрипт с
            помощью команды типа <span className="pick">"node my.js"</span>. Для
            браузера всё немного иначе.
          </p>
          <h2 className="subtitle">Тег «script»</h2>
          <p className="book_text">
            Программы на JavaScript могут быть вставлены в любое место
            HTML-документа с помощью тега
            <span className="pick">&lt;script&gt;</span>.
          </p>
          <div className="info">
            <div className="info_up">
              <img src="/img/info.png" alt="" className="info_img" />
              <p className="info_title">На заметку</p>
            </div>
            <p className="info_text">
              Как правило, только простейшие скрипты помещаются в HTML. Более
              сложные выделяются в отдельные файлы. <br />
              Польза отдельных файлов в том, что браузер загрузит скрипт
              отдельно и сможет хранить его в кеше. <br />
              Другие страницы, которые подключают тот же скрипт, смогут брать
              его из кеша вместо повторной загрузки из сети. И таким образом
              файл будет загружаться с сервера только один раз. <br />
              Это сокращает расход трафика и ускоряет загрузку страниц.
            </p>
          </div>
          <div className="warn">
            <div className="info_up">
              <img src="/img/warn.png" alt="" className="info_img" />
              <p className="info_title">На заметку</p>
            </div>
            <p className="info_text">
              Как правило, только простейшие скрипты помещаются в HTML. Более
              сложные выделяются в отдельные файлы. <br />
              Польза отдельных файлов в том, что браузер загрузит скрипт
              отдельно и сможет хранить его в кеше. <br />
              Другие страницы, которые подключают тот же скрипт, смогут брать
              его из кеша вместо повторной загрузки из сети. И таким образом
              файл будет загружаться с сервера только один раз. <br />
              Это сокращает расход трафика и ускоряет загрузку страниц.
            </p>
          </div> */}
          <div className="book_btn">
            <button className="prev_btn">
              <span>
                <img src="/img/arrow_left.png" alt="" />
                <p>
                  <a href="book_javascript.html">Назад</a>
                </p>
              </span>
            </button>
            <button className="next_btn">
              <span>
                <p>Продолжить</p>
                <img src="/img/arrow.png" alt="" />
              </span>
            </button>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default TopicDetails;

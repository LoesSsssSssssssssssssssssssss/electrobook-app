import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AllBooks from './components/AllBooks';
import TopicDetails from './pages/TopicDetails';
import AdminPanel from './components/AdminPanel';
import MainPage from './pages/MainPage';
import BooksPage from './pages/BooksPage';
import Book from './pages/Book';
import Profile from './pages/Profile';

const NotFound = () => {
  return (
    <div className="not_found">
      <h1 className="display-4">404</h1>
      <p>страница не доступна</p>
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/mainpage" element={<Home />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/textbooks" element={<AllBooks />} />
      <Route path="/bookspage" element={<BooksPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/book/:id" element={<Book />} />
      <Route
        path="/textbooks/books/:textbookId/topics/:topicIndex"
        element={<TopicDetails />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

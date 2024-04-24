import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AllBooks from './AllBooks';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedInUsername, setLoggedInUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.userId) {
          fetchUsername(payload.userId);
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, [message]); // Обновляем при изменении message

  const fetchUsername = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${userId}`);
      console.log('Fetched username:', response.data.username);
      setLoggedInUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const register = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/register', {
        username,
        password,
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
        username,
        password,
      });
      setMessage(`Logged in! Token: ${response.data.token}`);
      const token = response.data.token;
      localStorage.setItem('token', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.userId) {
        fetchUsername(payload.userId);
      }
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Удаляем токен из локального хранилища
    setMessage('Logged out');
    setLoggedInUsername('');
  };

  return (
    <div>
      <h1>Electronic Textbook</h1>
      {loggedInUsername ? <p>Logged in as: {loggedInUsername}</p> : null}
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      {loggedInUsername ? <button onClick={logout}>Logout</button> : null}
      <div>{message}</div>
      <AllBooks />
    </div>
  );
}

export default Home;

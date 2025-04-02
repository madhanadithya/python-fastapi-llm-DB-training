
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import Post from './Post';
import NewPost from './NewPost';

const BASE_URL = 'http://localhost:8000/'

function App() {
  const [posts, setPosts] = useState([]);
  const [theme, setTheme] = useState('light'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(BASE_URL + 'post/all')
      .then(response => {
        const json = response.json();
        if (response.ok) {
          return json;
        }
        throw response;
      })
      .then(data => {
        setPosts(data.reverse());
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`App ${theme}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>

      <div className="slider">
        <button onClick={() => setIsModalOpen(false)}>See All Posts</button>
        <button onClick={openModal}>Create Post</button>
      </div>

      <div className="blog_title">Daily Bugle's Blog Reports</div>

      <div className="app_posts">
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {isModalOpen && <NewPost closeModal={closeModal} />}

    </div>
  );
}

export default App;

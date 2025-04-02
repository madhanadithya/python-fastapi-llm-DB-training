import { Button, Modal, makeStyles, Input, Switch } from '@material-ui/core';
import { Box, Typography, TextField } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload';

const BASE_URL = 'http://localhost:8000/';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setAuthToken(window.localStorage.getItem('authToken'));
    setAuthTokenType(window.localStorage.getItem('authTokenType'));
    setUsername(window.localStorage.getItem('username'));
    setUserId(window.localStorage.getItem('userId'));
    setDarkMode(JSON.parse(window.localStorage.getItem('darkMode')) || false);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetch(BASE_URL + 'post/all')
      .then((response) => response.json())
      .then((data) => {
        const result = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPosts(result);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }, []);

  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);


  const signIn = (event) => {
    event?.preventDefault();
  
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
  
    const requestOptions = {
      method: 'POST',
      body: formData
    };
  
    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        console.log(data);
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
        setUsername(data.username);
      
        // Store in localStorage
        window.localStorage.setItem('authToken', data.access_token);
        window.localStorage.setItem('authTokenType', data.token_type);
        window.localStorage.setItem('userId', data.user_id);
        window.localStorage.setItem('username', data.username);
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  
    setOpenSignIn(false);
  };
  
  const signUp = (event) => {
    event?.preventDefault();
  
    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    });
  
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_string
    };
  
    fetch(BASE_URL + 'user/', requestOption)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        signIn(); // Call signIn() to log the user in after signing up
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  
    setOpenSignUp(false);
  };
  

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
     

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350, background: 'white', boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          padding: '20px', borderRadius: '8px', textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '10px' }}>Login</h2>
          <Input 
            fullWidth placeholder="Username" style={{ marginBottom: '10px', width: '100%' }}
            value={username || ''} onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            fullWidth placeholder="Password" type="password" style={{ marginBottom: '10px', width: '100%' }}
            value={password || ''} onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth variant="contained"  color="secondary" onClick={signIn}>
            Login
          </Button>
        </div>
      </Modal>

      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350, background: 'white', boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          padding: '20px', borderRadius: '8px', textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '10px' }}>Sign Up</h2>
          <Input 
            fullWidth placeholder="Username" style={{ marginBottom: '10px', width: '100%' }}
            value={username || ''} onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            fullWidth placeholder="Email" style={{ marginBottom: '10px', width: '100%' }}
            value={email || ''} onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            fullWidth placeholder="Password" type="password" style={{ marginBottom: '10px', width: '100%' }}
            value={password || ''} onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth variant="contained" color="secondary" onClick={signUp}>
            Sign Up
          </Button>
        </div>
      </Modal>


      <div className="app_header">

        <div className="header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            className="app_headerImage"
            src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Emblem.png"
            alt="Instagram"
            style={{ width: '100px', height: 'auto' }}
          />
          <h1 className="title">Instagram</h1>
        </div>


        <div className='modal_switch' style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Switch checked={darkMode} onChange={toggleDarkMode} color="primary" />
          <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </div>

        {authToken ? (

          <Button onClick={() => {
            setAuthToken(null);
            setAuthTokenType(null);
            setUserId(null);
            setUsername(null);
          

            window.localStorage.removeItem('authToken');
            window.localStorage.removeItem('authTokenType');
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('username');
          }}>
            Logout
          </Button>
          


        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        {posts.map((post) => (
          <Post key={post.id} post={post} authToken={authToken} authTokenType={authTokenType} username={username} />
        ))}
      </div>

      {authToken ? (
        <ImageUpload authToken={authToken} authTokenType={authTokenType} userId={userId} />
      ) : (
        <h3>You need to login to upload</h3>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './NewPost.css';

const BASE_URL = 'http://localhost:8000/';

function NewPost({ closeModal }) {
  const [image, setImage] = useState(null);
  const [creator, setCreator] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    fetch(BASE_URL + 'post/image', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        createPost(data.filename);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setImage(null);
        document.getElementById('fileInput').value = null;
      });
  };

  const createPost = (imageUrl) => {
    const json_string = JSON.stringify({
      image_url: imageUrl,
      title,
      content: text,
      creator,
    });

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: json_string,
    };

    fetch(BASE_URL + 'post', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        window.location.reload();
        window.scrollTo(0, 0);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="modal">
      <div className="modal_content">
        {/* Close Button */}
        <span className="close" onClick={closeModal}>
          Close &times;
        </span>
        <h2>Create a New Post</h2>
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label htmlFor="fileInput">Upload Image</label>
            <input type="file" id="fileInput" onChange={handleImageUpload} />
          </div>
          <div className="input-group">
            <label htmlFor="creator_input">Creator</label>
            <input
              type="text"
              id="creator_input"
              placeholder="Creator"
              onChange={(e) => setCreator(e.target.value)}
              value={creator}
            />
          </div>
          <div className="input-group">
            <label htmlFor="title_input">Title</label>
            <input
              type="text"
              id="title_input"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="input-group">
            <label htmlFor="content_input">Content</label>
            <textarea
              id="content_input"
              rows="10"
              placeholder="Content"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          </div>
          <button className="create_button" type="submit">
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPost;

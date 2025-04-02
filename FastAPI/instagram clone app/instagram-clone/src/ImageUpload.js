import React, { useState } from "react";
import { Button } from "@material-ui/core";
import "./ImageUpload.css";

const BASE_URL = "http://localhost:8000/";

function ImageUpload({ authToken, authTokenType, userId }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: authTokenType + " " + authToken,
      }),
      body: formData,
    };

    fetch(BASE_URL + "post/image", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        createPost(data.filename);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setCaption("");
        setImage(null);
        setPreview(null); // Clear preview
        document.getElementById("fileInput").value = null;
      });
  };

  const createPost = (imageUrl) => {
    const json_string = JSON.stringify({
      image_url: imageUrl,
      image_url_type: "relative",
      caption: caption,
      creator_id: userId,
    });

    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: authTokenType + " " + authToken,
        "Content-Type": "application/json",
      }),
      body: json_string,
    };

    fetch(BASE_URL + "post", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(() => {
        window.location.reload();
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    document.getElementById("fileInput").value = null;
  };


  return (
    <div className="imageupload">
      <h3 className="imageupload_header">Upload a New Post</h3>
      <input
        type="text"
        className="imageupload_input"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input
        type="file"
        id="fileInput"
        className="imageupload_file"
        onChange={handleChange}
        accept="image/*"
      />
      {preview && (
        <div className="imageupload_preview">
          <img src={preview} alt="Preview" className="preview-image" />
          <button className="remove-image-btn" onClick={removeImage}>❌</button>
        </div>
      )}
      <Button className="imageupload_button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;

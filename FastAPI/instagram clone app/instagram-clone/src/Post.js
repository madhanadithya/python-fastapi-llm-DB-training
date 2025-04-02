//------------------------------------------------------------------------------------------------------------------

//below code has gender classification using genderize.io api and profile image generation using xs-games.co api

//------------------------------------------------------------------------------------------------------------------



import React, { useState, useEffect } from "react";
import './Post.css';
import { Avatar, Button } from "@material-ui/core";

const BASE_URL = 'http://localhost:8000/';

function Post({ post, authToken, authTokenType, username }) {
  const [imageUrl, setImageUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [gender, setGender] = useState('male'); // Default gender

  useEffect(() => {
    if (post.image_url_type === 'absolute') {
      setImageUrl(post.image_url);
    } else {
      setImageUrl(BASE_URL + post.image_url);
    }
  }, []);

  useEffect(() => {
    setComments(post.comments);
  }, []);

  // Fetch gender based on username
  useEffect(() => {
    const fetchGender = async () => {
      try {
        const response = await fetch(`https://api.genderize.io?name=${post.user.username}`);
        const data = await response.json();
        if (data.gender) {
          setGender(data.gender);
        }
      } catch (error) {
        console.error("Error fetching gender:", error);
      }
    };

    fetchGender();
  }, [post.user.username]);


  const handleDelete = (event) => {
    event?.preventDefault();
  
    const requestOptions = {
      method: 'GET',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken
      })
    };
  
    fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
      .then(response => {
        if (response.ok) {
          window.location.reload();
        } else if (response.status === 403) {
          alert("You are not authorized to delete this post.");
        } else {
          throw response;
        }
      })
      .catch(error => {
        console.log(error);
        alert("An error occurred while trying to delete the post.");
      });
  };
  

  const postComment = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({
      'username': username,
      'text': newComment,
      'post_id': post.id
    });

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': authTokenType + ' ' + authToken,
        'Content-Type': 'application/json'
      }),
      body: json_string
    };

    fetch(BASE_URL + 'comment', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        fetchComments();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setNewComment('');
      });
  };

  const fetchComments = () => {
    fetch(BASE_URL + 'comment/all/' + post.id)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setComments(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          alt={post.user.username}
          src={`https://xsgames.co/randomusers/avatar.php?g=${gender}&seed=${post.user.username}`}
          className="post_avatar"
        />

        <div className="post_headerInfo">
          <h3>@{post.user.username}</h3>
          <Button className="post_delete" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <img className="post_image" src={imageUrl} alt="Post" />

      <h4 className='post_text'>{post.caption}</h4>

      <div className='post_comments'>
        {
          comments.map((comment) => (
            <p key={comment.id}>
              <strong>{comment.username}:</strong> {comment.text}
            </p>
          ))
        }
      </div>

      {authToken && (
        <form className="post_commentbox">
          <input className="post_input"
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="post_button"
            type="submit"
            disabled={!newComment}
            onClick={postComment}>
              Post
            </button>
        </form>
      )}
    </div>
  );
}

export default Post;


//------------------------------------------------------------------------------------------------------------------

//below code has gender classification using open AI gpt model and profile image generation using xs-games.co api

//------------------------------------------------------------------------------------------------------------------


// import React, { useState, useEffect } from "react";
// import './Post.css';
// import { Avatar, Button } from "@material-ui/core";

// const BASE_URL = 'http://localhost:8000/';

// function Post({ post, authToken, authTokenType, username }) {
//   const [imageUrl, setImageUrl] = useState('');
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [gender, setGender] = useState('male'); // Default gender

//   useEffect(() => {
//     if (post.image_url_type === 'absolute') {
//       setImageUrl(post.image_url);
//     } else {
//       setImageUrl(BASE_URL + post.image_url);
//     }
//   }, []);

//   useEffect(() => {
//     setComments(post.comments);
//   }, []);

//   // Fetch gender based on username
 
//   const OPENAI_API_KEY = 'here replace with ur key'; // Replace with your actual OpenAI API key

//   useEffect(() => {
//     const fetchGender = async () => {
//       try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${OPENAI_API_KEY}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [
//               { role: "system", content: "You are a helpful assistant that predicts gender based on a given name." },
//               { role: "user", content: `Predict the gender of the name: ${post.user.username}. Respond with only 'male', 'female', or 'unknown'.` }
//             ],
//             max_tokens: 5
//           })
//         });
  
//         const data = await response.json();
//         if (data.choices && data.choices.length > 0) {
//           const genderPrediction = data.choices[0].message.content.trim().toLowerCase();
//           setGender(genderPrediction === "male" || genderPrediction === "female" ? genderPrediction : "unknown");
//         }
//       } catch (error) {
//         console.error("Error fetching gender:", error);
//       }
//     };
  
//     fetchGender();
//   }, [post.user.username]);
  


//   const handleDelete = (event) => {
//     event?.preventDefault();
  
//     const requestOptions = {
//       method: 'GET',
//       headers: new Headers({
//         'Authorization': authTokenType + ' ' + authToken
//       })
//     };
  
//     fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
//       .then(response => {
//         if (response.ok) {
//           window.location.reload();
//         } else if (response.status === 403) {
//           alert("You are not authorized to delete this post.");
//         } else {
//           throw response;
//         }
//       })
//       .catch(error => {
//         console.log(error);
//         alert("An error occurred while trying to delete the post.");
//       });
//   };
  

//   const postComment = (event) => {
//     event?.preventDefault();

//     const json_string = JSON.stringify({
//       'username': username,
//       'text': newComment,
//       'post_id': post.id
//     });

//     const requestOptions = {
//       method: 'POST',
//       headers: new Headers({
//         'Authorization': authTokenType + ' ' + authToken,
//         'Content-Type': 'application/json'
//       }),
//       body: json_string
//     };

//     fetch(BASE_URL + 'comment', requestOptions)
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         }
//       })
//       .then(data => {
//         fetchComments();
//       })
//       .catch(error => {
//         console.log(error);
//       })
//       .finally(() => {
//         setNewComment('');
//       });
//   };

//   const fetchComments = () => {
//     fetch(BASE_URL + 'comment/all/' + post.id)
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         }
//         throw response;
//       })
//       .then(data => {
//         setComments(data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   };

//   return (
//     <div className="post">
//       <div className="post_header">
//         <Avatar
//           alt={post.user.username}
//           src={`https://xsgames.co/randomusers/avatar.php?g=${gender}&seed=${post.user.username}`}
//           className="post_avatar"
//         />

//         <div className="post_headerInfo">
//           <h3>@{post.user.username}</h3>
//           <Button className="post_delete" onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </div>

//       <img className="post_image" src={imageUrl} alt="Post" />

//       <h4 className='post_text'>{post.caption}</h4>

//       <div className='post_comments'>
//         {
//           comments.map((comment) => (
//             <p key={comment.id}>
//               <strong>{comment.username}:</strong> {comment.text}
//             </p>
//           ))
//         }
//       </div>

//       {authToken && (
//         <form className="post_commentbox">
//           <input className="post_input"
//             type="text"
//             placeholder="Add a comment"
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <button
//             className="post_button"
//             type="submit"
//             disabled={!newComment}
//             onClick={postComment}>
//               Post
//             </button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default Post;

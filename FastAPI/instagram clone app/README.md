# 📸 Instagram Clone API (React + FastAPI)

This is a **basic but powerful Instagram Clone** project — built with ❤️ by [Madhan Adithya](https://www.linkedin.com/in/madhanadithya/).

---

## 🛠️ Tech Stack

- **Frontend**: React
- **Backend**: FastAPI
- **Authentication**: JWT (Auth & Refresh Tokens)
- **Mode Switching**: Light 🌞 / Dark 🌙

---

## 🌟 Features

- 👤 User authentication (Sign Up, Login, Logout)
- 🖼️ Post image with captions
- 💬 Comment section under each post
- ❌ Users can delete **only** their own posts
- 🎨 Toggle between **Dark** and **Light** modes

---

## 🔐 Authentication - JWT Based

- **Access Token** stored in `localStorage`
- **Refresh Token** stored as `HttpOnly` Cookie and also saved in the backend DB
- Want to know the _full spicy_ details? 👉  
  [Check my detailed JWT Auth implementation](https://github.com/your-username/your-repo-name/blob/main/path-to-your-auth-readme/README.md) 🍪🔐

---

## 🎭 Random Profile Avatars (Because who wants boring default pics?)

We use the magical endpoint from **xsgames** to generate random avatars based on the user's gender:

```
https://xsgames.co/randomusers/avatar.php?g=${gender}&seed=${post.user.username}
```

---

## 🧠 Gender Classification from Username

Because your name says a lot (sometimes) 😅

We determine the user's gender using:

1. 🧙‍♂️ [`genderize.io`](https://api.genderize.io?name=${post.user.username})
2. 🧠 OpenAI GPT-4o Mini:
   ```
   https://api.openai.com/v1/chat/completions
   ```

---

## 🎬 Output & Demo

📸 Screenshots and a demo video are available in this path, which is in this same repository:  
`/python-fastapi-llm-DB-training/FastAPI/output screenshots and demo videos/instagram clone outputs`  
on the GitHub repo itself.

---

## 🚀 How to Run (in 3 steps)

1. **Clone** the repo
2. **Install** dependencies (FastAPI + React deps)
3. **Run** both frontend and backend

---

## 📬 Made with Love by

**Madhan Adithya**  
🔗 [LinkedIn](https://www.linkedin.com/in/madhanadithya/)

---

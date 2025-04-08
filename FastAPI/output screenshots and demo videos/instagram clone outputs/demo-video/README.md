# 🔐 Auth Token & Refresh Token Flow Demo

🎥 [Demo Video](https://drive.google.com/file/d/1IRz-ASTuL_hVNNna-nAXVUoE6b6qS-nK/view?usp=sharing) 🍿

🔗 [Outputs Screenshots Folder](https://github.com/madhanadithya/python-fastapi-llm-DB-training/tree/101dac1c7c06b389773959c97978d35c854e4d7f/FastAPI/output%20screenshots%20and%20demo%20videos/instagram%20clone%20outputs) 🎬

hi there! This README is your friendly guide to understanding how auth tokens are refreshed _before_ they expire, using a refresh token. This setup is part of a secure authentication mechanism I tested and recorded (P.S. The notepad I was typing in wasn’t visible in the video — oops! So here it is, in text form 😄).

- madhan adithya (ur friendly neighbourhood coder).

---

## 📺 What This Covers

- 🔄 How auth tokens are replaced before expiry
- 🕓 Expiry logic
- 🍪 Refresh token handling (frontend & backend)
- 💾 Refresh token update on re-login

---

## 🔐 Auth Token Behavior

### Example Timeline:

1. **Auth token at 7:22 PM:**

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGhhbiBhZGl0aHlhIiwiZXhwIjoxNzQzNzc0ODMwfQ.69E5fq_tAXT2KI_7iS9sOaSitCdX8ghWTMD4_EvyTws
   ```

2. **Auth token at 7:25 PM:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGhhbiBhZGl0aHlhIiwiZXhwIjoxNzQzNzc1MDA1fQ.iGPdHldROpXPZL8dzBj5hhhuhKHNp-EMBfSJMnoWZe4
   ```

🎉 **Notice:** Tokens are different! That’s because the auth token is refreshed _before_ it expires — using the refresh token.

---

## ⏳ Expiry Settings

- **Auth Token Expiry:** 2 minutes (just because we are testing i kept it as 2 minutes).
  _(In this test case, it refreshes every 1 minute. Normally, it would be around 15 minutes or more than that.)_

- **Refresh Token Expiry:** 7 days  
  _(You can totally change this to weeks or even months if you like.)_

---

## 🔁 Refresh Token Lifecycle

### 1️⃣ First Login – Refresh Token (Frontend & DB):

- **HTTP-only Cookie (Frontend):**

  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGhhbiBhZGl0aHlhIiwiZXhwIjoxNzQ0Mzc5NTEwfQ.xv4CBps7jDYTQrqb4A3FqC2AFfCqvkd7ijBjQilQ324
  ```

- **Database:**
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGhhbiBhZGl0aHlhIiwiZXhwIjoxNzQ0Mzc5NTEwfQ.xv4CBps7jDYTQrqb4A3FqC2AFfCqvkd7ijBjQilQ324
  ```

---

### 🔄 Logout & Re-login – New Refresh Token:

- **HTTP-only Cookie (Frontend):**

  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGhhbiBhZGl0aHlhIiwiZXhwIjoxNzQ0MzgwMDc0fQ.pSzavmAzEJ02mBT3rpq5yXDOFWWzX8wLtveEfhfY8I8
  ```

- **Database:**
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hZGhhbiBhZGl0aHlhIiwiZXhwIjoxNzQ0MzgwMDc0fQ.pSzavmAzEJ02mBT3rpq5yXDOFWWzX8wLtveEfhfY8I8
  ```

🧠 **Heads Up:** Refresh token stays the same between frontend and backend during a session. But every time the user logs out and logs in again — _voilà!_ — a new refresh token is born!

---

## 🤹‍♂️ Summary of the Flow

1. User logs in → Auth token + Refresh token generated
2. Auth token set to expire soon → Auto-refreshed using refresh token
3. User logs out → Tokens invalidated
4. User logs in again → Brand new refresh token issued and updated on both frontend (http only cookie) and backend (DB)

---

## 🧁 Final Thoughts

This setup ensures your users have a seamless, secure experience — with tokens being silently refreshed in the background. Plus, by using HTTP-only cookies, your refresh tokens stay out of reach from JavaScript attacks.

Stay secure, stay awesome! 💪

_Made with love by Madhan Adithya ❤️_

🔗 [LinkedIn](https://www.linkedin.com/in/madhanadithya/)

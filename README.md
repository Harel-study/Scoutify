# Scoutify

Scoutify is a sports social network application.

## 🏗️ Code Architecture

Scoutify is structured as a modern full-stack monorepo, divided into independent frontend and backend environments:

- **Frontend (`/frontend`)**:
  - **Framework**: React 19 powered by Vite for lightning-fast builds.
  - **Language**: TypeScript for end-to-end type safety.
  - **State Management**: Redux Toolkit for predictable global state management.
  - **Styling**: Tailwind CSS for responsive and utility-first UI design.
  - **Routing**: React Router v7.
  - **Real-time**: Socket.io-client for live updates.
  - **Network**: Axios for API communication.

- **Backend (`/backend`)**:
  - **Runtime & Framework**: Node.js with Express framework.
  - **Language**: TypeScript.
  - **Database**: MongoDB with Mongoose ODM for flexible data modeling.
  - **Authentication**: JWT (JSON Web Tokens) combined with Google OAuth integration.
  - **Media Storage**: Cloudinary integration for scalable image and video uploads.
  - **AI Integration**: Google GenAI (`@google/genai`) for intelligent platform features.
  - **Real-time**: Socket.io for managing WebSocket connections.

## ⚙️ Environment Variables

To run the project locally, you must configure the following environment variables. You can duplicate the `.env.example` files in both the `frontend` and `backend` directories and rename them to `.env`.

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | The port the backend server runs on (e.g., `5000`) |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `CLIENT_URL` | The URL of the frontend application for CORS |
| `MONGODB_URI` | Connection string for your MongoDB database |
| `ACCESS_TOKEN_SECRET` | Secure secret key for signing JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Secure secret key for signing JWT refresh tokens |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud Console |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
| `GEMINI_API_KEY` | API key for Google Gemini / GenAI features |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | The base URL for backend API requests (e.g., `http://localhost:5000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID (must match the backend `GOOGLE_CLIENT_ID`) |

## 📚 API Documentation

The complete API documentation for Scoutify is available via Postman. It includes all endpoints, request bodies, parameters, and example responses.

👉 **[Scoutify Postman Documentation](https://documenter.getpostman.com/view/52098464/2sBY4Trywp)**
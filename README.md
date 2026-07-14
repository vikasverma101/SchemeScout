# SchemeScout

![SchemeScout](https://img.shields.io/badge/AI-powered%20Government%20Scheme%20Finder-blue?style=flat&logo=ai)
![MERN Stack](https://img.shields.io/badge/MERN%20Stack-React%2C%20Node%2C%20Express%2C%20MongoDB-brightgreen?style=flat)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat)

SchemeScout is an AI-powered Government Scheme Finder that helps users discover relevant schemes based on their profile. The platform matches age, income, category, occupation, and state to deliver personalized recommendations, eligibility summaries, and application guidance.

## Features

- ✅ AI-powered personalized recommendations
- ✅ Government scheme eligibility checker
- ✅ Smart filtering by age, income, category, state, and occupation
- ✅ AI-generated explanations and recommendations
- ✅ User authentication with JWT
- ✅ Save favorite schemes
- ✅ Responsive modern UI
- ✅ Dark/Light mode
- ✅ Secure REST API
- ✅ MongoDB database
- ✅ Error handling and validation

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- CORS

### AI Integration

- OpenRouter API (or Gemini API if configured)

## Project Architecture

SchemeScout is built as a split frontend/backend application:

- **Frontend**: React application with client-side routing, responsive UI, and Axios-based API calls.
- **Backend**: Express API with secure endpoints for auth, scheme search, saved schemes, and AI recommendation flows.
- **Database**: MongoDB stores users, profile data, saved schemes, and scheme metadata.
- **Authentication**: JWT secures protected routes and authorizes saved-scheme actions.
- **AI Recommendation Flow**: User profile data is sent to the backend, which uses AI integration to generate personalized scheme recommendations and eligibility summaries.

## Folder Structure

```text
SchemeScout/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── cron/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   ├── tests/
│   └── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

```bash
git clone https://github.com/<your-username>/SchemeScout.git
cd SchemeScout
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

### Environment

Create a `.env` file in `backend/` and populate it from `.env.example`.

## Example `.env.example`

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/schemescout?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=https://your-frontend.onrender.com
```

## Running Locally

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

## Usage

- **Register**: Create an account using the signup page.
- **Login**: Authenticate with email and password.
- **Search schemes**: Filter schemes by age, income, category, occupation, and state.
- **Receive AI recommendations**: View tailored scheme suggestions and explanations.
- **Save favorites**: Save schemes to your profile for quick access.

## Security

- JWT Authentication secures protected API routes.
- Passwords are hashed before storage.
- Protected routes require valid JWT tokens.
- Sensitive values are stored in environment variables.
- API calls from the frontend are made over secure HTTPS in production.

## Performance

- Fast filtering and search operations.
- Optimized API calls with clean endpoint design.
- Responsive UI for mobile and desktop.
- Modular architecture for easier maintenance and scaling.

## Deployment

### Frontend

Deploy the frontend to Render as a static site or a React web service.

### Backend

Deploy the backend as a Node/Express service on Render.

### Database

Use MongoDB Atlas for production data storage.

> For Render deployment, set `FRONTEND_URL` to your frontend service URL so the backend CORS policy only allows trusted requests.

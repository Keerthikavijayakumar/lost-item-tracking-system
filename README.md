# KEC Campus Lost & Found System

This project is divided into two main components:

- **Frontend**: A Next.js application handling the user interface and authentication (Clerk).
- **Backend**: An Express.js server handling data, models, and third-party integrations (MongoDB, Cloudinary, Resend).

## Getting Started

### 1. Setup Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`.
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`.
   - Ensure `NEXT_PUBLIC_API_URL` points to your backend (default: `http://localhost:5000/api`).
4. Start the application:
   ```bash
   npm run dev
   ```

## Key Folders
- `frontend/src/app`: Next.js pages and layouts.
- `frontend/src/Frontend/Components`: UI components.
- `backend/src/Models`: Mongoose schemas.
- `backend/src/routes`: Express API routes.
- `backend/src/Lib`: Utility libraries (Email, Cloudinary, MongoDB).

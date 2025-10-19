# 🖥️ Gallery of Wonders - Main Backend (Node.js)

This is the core backend for the Gallery of Wonders application. It handles user authentication, database operations, business logic, and real-time communication via WebSockets.

---

### Features
-   **RESTful API:** Provides endpoints for all CRUD operations on Users, Works, and Collections.
-   **Authentication:** Secure user management with JWTs stored in httpOnly cookies.
-   **Real-Time Engine:** Uses Socket.IO to push live updates for likes and comments to all connected clients.
-   **AI Proxy:** Forwards content analysis requests to the dedicated Python AI service.

### Tech Stack
-   **Framework:** Express.js
-   **Database:** MongoDB with Mongoose
-   **Real-Time:** Socket.IO
-   **Authentication:** `jsonwebtoken`, `bcryptjs`

---

## 🚀 Local Setup

### Prerequisites
-   The **Python AI Backend** must be running on `http://localhost:5001`.
-   A local MongoDB instance must be running.

1.  **Navigate to this directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    Create a `.env` file in this directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI='mongodb://127.0.0.1:27017/GalleryOfWonders'
    NODE_ENV=development
    JWT_SECRET=your_super_secret_jwt_key
    PYTHON_AI_API_URL=http://localhost:5001/analyze-content
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

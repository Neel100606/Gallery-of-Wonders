# 🎨 Gallery of Wonders - AI-Powered Creative Showcase

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-Transformers-yellow?style=for-the-badge&logo=huggingface)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-blue?style=for-the-badge&logo=pinecone)

**Gallery of Wonders** is an advanced full-stack, real-time web application for artists and writers to showcase, manage, and receive AI-driven insights on their creative works.

This project features a sophisticated **distributed system architecture** that separates the core application logic from intensive AI/ML operations. A React frontend communicates with a Node.js backend for core features and real-time updates, while the Node.js backend delegates all AI tasks—such as content analysis, embedding generation, and vector search—to a dedicated Python/Flask microservice.


## ✨ Key Features

* **👨‍🎨 Full-Stack Creative Platform:** Complete CRUD (Create, Read, Update, Delete) functionality for users, creative works, and personal collections.
* **🤖 AI Content Generation:** A multi-modal AI pipeline (using **BLIP**, **ViT**, **T5**, and **KeyBERT**) automatically generates content-aware descriptions, summaries, and tags for both uploaded images and written text.
* **🧠 AI Recommendation Engine:** Generates **CLIP embeddings** for all content, which are then indexed in a **Pinecone vector database** to power a "Similar Works" feature based on real-time similarity search.
* **⚡ Real-Time Community Interaction:** Uses **Socket.IO** to provide instantaneous updates for likes and new comments without requiring a page refresh.
* **📊 Creator Dashboard:** A dedicated dashboard for users to visualize engagement analytics (total works, likes, comments, saves) and track performance with charts (via **Recharts**) and stat cards.
* **🔒 Secure Authentication:** Secure JWT-based authentication with `httpOnly` cookies for protected API routes and user sessions.
* ** masonry-style feed with filtering, user profiles, and a robust search functionality.

## 🏛️ System Architecture

This project is built using a **microservice-based architecture** to ensure high performance and scalability. The system is split into three main components:


1.  **Frontend (React Client):**
    * A modern, responsive single-page application built with **React**, **Vite**, and **Tailwind CSS**.
    * Manages all global state, including user auth and API data, using **Redux Toolkit (RTK Query)**.
    * Communicates with the Node.js backend via RESTful APIs and a persistent **Socket.IO** connection for real-time events.

2.  **Backend (Node.js Core API):**
    * A robust **Express.js** server that handles all core business logic.
    * Manages user authentication, CRUD operations for works/collections/comments, and interactions with **MongoDB** (via Mongoose).
    * Acts as the real-time hub, broadcasting events (like new likes or comments) via **Socket.IO** to subscribed clients.
    * **Crucially, it *delegates* all heavy AI tasks to the Python microservice** by making HTTP requests to it.

3.  **AI Microservice (Python/Flask):**
    * A separate **Flask** server dedicated to all AI/ML inference and vector database operations.
    * Exposes endpoints (`/analyze-content`, `/index-work`, `/find-similar`) for the Node.js backend.
    * Uses **Hugging Face Transformers** (BLIP, ViT, T5, CLIP) and **KeyBERT** to analyze content and generate embeddings.
    * Communicates directly with **Pinecone** to upsert new vector embeddings and query for similar items.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Redux Toolkit (RTK Query), Tailwind CSS, Framer Motion, Recharts |
| **Core Backend** | Node.js, Express.js, MongoDB (Mongoose), Socket.IO, JWT, Cookie-Parser, Bcrypt.js |
| **AI Microservice** | Python, Flask, Flask-CORS |
| **AI & ML Models** | Hugging Face Transformers, Sentence Transformers, KeyBERT, PyTorch |
| | **(BLIP, ViT, T5, CLIP)** |
| **Vector Database** | Pinecone (v3+) |
| **Cloud Services** | Cloudinary (for all media storage and uploads) |
| **DevOps** | `concurrently` (for running all services), `nodemon` (for backend hot-reloading) |

## 🚀 Getting Started

To run this project locally, you must run all three services (Frontend, Backend, and AI Microservice) simultaneously.

### Prerequisites

* Node.js (v18 or later)
* Python (v3.10 or later) & `pip`
* MongoDB (a local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
* A [Cloudinary](https://cloudinary.com/) account (for media storage)
* A [Pinecone](https://www.pinecone.io/) account (for the vector database)

---

### 1. Backend (Node.js) Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` directory:
    ```ini
    # backend/.env

    # Server Port
    PORT=5000

    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string

    # JWT Secret for authentication
    JWT_SECRET=your_super_secret_key_here

    # URL of your Python AI microservice
    PYTHON_AI_API_URL=[http://127.0.0.1:5001/analyze-content](http://127.0.0.1:5001/analyze-content)
    ```
4.  Run the backend server:
    ```bash
    npm run backend
    ```
    > The Node.js server will be running on `http://localhost:5000`.

---

### 2. AI Microservice (Python) Setup

1.  Navigate to the AI backend directory:
    ```bash
    cd ai-backend
    ```
2.  (Recommended) Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install Python dependencies (you may need to create a `requirements.txt` file from `ai_analyzer.py`):
    ```bash
    pip install flask flask-cors python-dotenv pinecone-client transformers torch pillow keybert sentence-transformers
    ```
4.  Create a `.env` file in the `ai-backend/` directory:
    ```ini
    # ai-backend/.env

    # Pinecone API credentials
    PINECONE_API_KEY=your_pinecone_api_key
    PINECONE_ENVIRONMENT=your_pinecone_environment_region
    ```
5.  Run the Flask server (it runs on port 5001 by default):
    ```bash
    flask run --port 5001
    ```
    > The Python server will be running on `http://localhost:5001`.

---

### 3. Frontend (React) Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend/` directory.
    *(Note: Your `vite.config.js` is set up to look for this in the root, but placing it here is standard for Vite.)*
    ```ini
    # frontend/.env

    # The base URL of your Node.js backend
    VITE_API_BASE_URL=http://localhost:5000

    # Cloudinary credentials for client-side uploads
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
    ```
4.  Run the frontend development server:
    ```bash
    npm run dev
    ```
    > The React app will be running on `http://localhost:5173`.

You can now open your browser to `http://localhost:5173` and use the full application!

## 📜 License

This project is open-source and available under the **MIT License**.

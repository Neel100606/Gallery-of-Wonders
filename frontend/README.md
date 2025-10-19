# 💻 Gallery of Wonders - Frontend (React)

This is the client-side application for the Gallery of Wonders, built with React and Vite. It provides the full user interface for interacting with the platform.

---

### Features
-   **Modern UI:** A clean, responsive interface built with Tailwind CSS.
-   **Efficient State Management:** Uses Redux Toolkit and RTK Query for predictable state management and efficient data fetching/caching.
-   **Real-Time Updates:** Connects to the Node.js backend via Socket.IO to receive live updates for likes and comments.
-   **Interactive Components:** Includes a rich set of components for creating, viewing, and managing creative content.

### Tech Stack
-   **Framework:** React.js (Vite)
-   **Styling:** Tailwind CSS
-   **State Management:** Redux Toolkit & RTK Query
-   **Real-Time:** Socket.IO Client

---

## 🚀 Local Setup

### Prerequisites
-   The **Node.js Backend** must be running on `http://localhost:5000`.

1.  **Navigate to this directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    Create a `.env` file in this directory and add your Cloudinary details:
    ```env
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

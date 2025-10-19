# 🐍 Gallery of Wonders - AI Service

This is a dedicated Python Flask microservice that handles all computationally intensive AI tasks for the Gallery of Wonders platform. It exposes a single API endpoint to analyze images and text content.

---

### Features
-   **Image Analysis:** Generates a descriptive caption (using **BLIP**) and relevant tags (using **ViT**) from an image URL.
-   **Text Analysis:** Generates a concise summary (using **T5**) and extracts keywords (using **KeyBERT**) from a block of text.

### Tech Stack
-   **Framework:** Flask
-   **AI/ML:** Hugging Face `transformers`, `torch`, `keybert`, `sentence-transformers`
-   **Models:**
    -   `Salesforce/blip-image-captioning-base`
    -   `google/vit-base-patch16-224`
    -   `t5-small`
    -   `all-MiniLM-L6-v2`

---

## 🚀 Local Setup

1.  **Navigate to this directory:**
    ```bash
    cd ai-backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # Create the environment
    python -m venv venv

    # Activate it
    source venv/bin/activate  # On macOS/Linux
    # venv\Scripts\activate    # On Windows
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the server:**
    ```bash
    python app.py
    ```
    The server will start on `http://localhost:5001`. The first run will take some time to download the AI models.

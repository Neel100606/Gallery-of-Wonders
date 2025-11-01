from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_analyzer import analyze_image_with_ai, analyze_text_with_ai, EMBEDDING_DIMENSION
from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Initialize Pinecone (v3+ Syntax) ---
print("Initializing Pinecone client...")
index = None # Define index in a broader scope

try:
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    # Use PINECONE_ENVIRONMENT if set, otherwise default region
    PINECONE_REGION = os.getenv("PINECONE_ENVIRONMENT", os.getenv("PINECONE_REGION", "us-east-1")) 

    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY environment variable not set.")

    pc = Pinecone(api_key=PINECONE_API_KEY)
    index_name = "new-works" # Match your screenshot

    # Correct way to list index names in v3+
    existing_indexes = [idx.name for idx in pc.list_indexes()] 
    
    if index_name not in existing_indexes:
        print(f"Pinecone index '{index_name}' not found. Creating index...")
        pc.create_index(
            name=index_name,
            dimension=EMBEDDING_DIMENSION, # Should be 512 from ai_analyzer.py
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws", # Match your screenshot
                region=PINECONE_REGION # Use the environment variable
            )
        )
        print(f"Pinecone index '{index_name}' created successfully with dimension {EMBEDDING_DIMENSION}.")
    else:
        print(f"Pinecone index '{index_name}' already exists.")
        # Verify existing index dimension
        index_description = pc.describe_index(index_name)
        if index_description.dimension != EMBEDDING_DIMENSION:
             print(f"🚨 FATAL ERROR: Existing Pinecone index '{index_name}' has dimension {index_description.dimension}, but model requires {EMBEDDING_DIMENSION}. Please DELETE the index in Pinecone and restart.")
             import sys
             sys.exit(1) # Exit if dimension mismatch is critical

    # Get the index instance
    index = pc.Index(index_name)
    print("Pinecone client initialized successfully.")

except Exception as e:
    print(f"--- FAILED TO INITIALIZE PINECONE ---")
    print(f"Error type: {type(e).__name__}")
    print(f"Error details: {e}")
    print(f"Please check your PINECONE_API_KEY and PINECONE_ENVIRONMENT/REGION environment variables.")
    print(f"------------------------------------")
    import sys
    sys.exit(1)


# --- ROUTES ---

@app.route('/analyze-content', methods=['POST'])
def analyze_content():
    # ... (This route remains unchanged from the previous correct version)
    data = request.get_json()
    ai_results = None
    if 'imageUrl' in data:
        image_url = data['imageUrl']
        print(f"[Analyze Content] Received request for image URL: {image_url[:50]}...")
        ai_results = analyze_image_with_ai(image_url)
    elif 'textContent' in data:
        text = data['textContent']
        print(f"[Analyze Content] Received request for text content: {text[:50]}...")
        ai_results = analyze_text_with_ai(text)
    else:
        print("[Analyze Content] Error: No 'imageUrl' or 'textContent' in request.")
        return jsonify({"error": "Request must include either 'imageUrl' or 'textContent'"}), 400
    if ai_results:
        print(f"[Analyze Content] Analysis successful. Caption: {ai_results.get('caption', '')[:50]}..., Tags: {ai_results.get('tags')}")
        return jsonify(ai_results)
    else:
        print("[Analyze Content] Error: Analysis function returned None.")
        return jsonify({"error": "AI analysis failed."}), 500


@app.route('/index-work', methods=['POST'])
def index_work():
    # ... (This route remains unchanged from the previous correct version, uses EMBEDDING_DIMENSION for validation)
    if index is None:
         print("[Pinecone Index] Error: Pinecone index not initialized.")
         return jsonify({"error": "Pinecone index not available"}), 500
    data = request.get_json()
    work_id = data.get('workId')
    embedding = data.get('embedding')
    print(f"[Pinecone Index] Received request for work ID: {work_id}")
    if not work_id or not embedding:
        print("[Pinecone Index] Error: Missing workId or embedding in request.")
        return jsonify({"error": "workId and embedding are required"}), 400
    if not isinstance(embedding, list) or len(embedding) != EMBEDDING_DIMENSION:
        received_dim = len(embedding) if isinstance(embedding, list) else 'N/A'
        print(f"[Pinecone Index] Error: Invalid embedding format or dimension for work ID: {work_id}. Expected {EMBEDDING_DIMENSION}, received: {received_dim}")
        return jsonify({"error": f"Invalid embedding format or dimension. Expected {EMBEDDING_DIMENSION}, received {received_dim}"}), 400
    try:
        print(f"[Pinecone Index] Attempting to upsert vector for work ID: {work_id}")
        upsert_response = index.upsert(vectors=[(work_id, embedding)])
        print(f"[Pinecone Index] Upsert response: {upsert_response}")
        print(f"[Pinecone Index] Successfully upserted vector for work ID: {work_id}")
        return jsonify({"success": True, "message": f"Work {work_id} indexed."})
    except Exception as e:
        print(f"--- PINECONE /index-work ERROR ---")
        print(f"Error occurred while indexing work ID: {work_id}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {e}")
        print(f"------------------------------------")
        return jsonify({"error": "Failed to index work"}), 500


@app.route('/find-similar', methods=['POST'])
def find_similar():
    # ... (This route remains unchanged from the previous correct version)
    if index is None:
         print("[Find Similar] Error: Pinecone index not initialized.")
         return jsonify({"error": "Pinecone index not available"}), 500
    data = request.get_json()
    work_id = data.get('workId')
    top_k = data.get('top_k', 6)
    if not work_id:
        print("[Find Similar] Error: 'workId' is required.")
        return jsonify({"error": "workId is required"}), 400
    vector_to_query = None
    try:
        print(f"[Pinecone Find Similar] Attempting to fetch vector for ID: {work_id}")
        fetch_response = index.fetch(ids=[work_id])
        if work_id not in fetch_response.vectors:
            print(f"[Pinecone Find Similar] Vector for ID {work_id} not found in index.")
            return jsonify({"similar_ids": []})
        vector_to_query = fetch_response.vectors[work_id].values
        print(f"[Pinecone Find Similar] Vector fetched successfully for ID: {work_id}")
        print(f"[Pinecone Find Similar] Querying for vectors similar to ID: {work_id}")
        query_response = index.query(vector=vector_to_query, top_k=top_k, include_values=False)
        print(f"[Pinecone Find Similar] Query successful. Found {len(query_response.matches)} matches.")
        similar_ids = [match.id for match in query_response.matches if match.id != work_id]
        return jsonify({"similar_ids": similar_ids})
    except Exception as e:
        print(f"--- PINECONE /find-similar ERROR ---")
        print(f"Error occurred while processing work ID: {work_id}")
        if vector_to_query is None: print("Error phase: Fetching vector from Pinecone")
        else: print("Error phase: Querying Pinecone with fetched vector")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {e}")
        print(f"------------------------------------")
        return jsonify({"error": "Failed to find similar works"}), 500


if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5001, debug=True)
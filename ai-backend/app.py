from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_analyzer import analyze_image_with_ai, analyze_text_with_ai

app = Flask(__name__)
CORS(app) # Allow cross-origin requests

@app.route('/analyze-content', methods=['POST'])
def analyze_content():
    data = request.get_json()
    
    # Case 1: An image URL was provided
    if 'imageUrl' in data:
        image_url = data['imageUrl']
        ai_results = analyze_image_with_ai(image_url)
        return jsonify(ai_results)

    # Case 2: Text content was provided
    elif 'textContent' in data:
        text = data['textContent']
        ai_results = analyze_text_with_ai(text)
        return jsonify(ai_results)
    
    else:
        return jsonify({"error": "Request must include either 'imageUrl' or 'textContent'"}), 400

if __name__ == '__main__':
    # Run on port 5001 to avoid conflict with Node.js
    app.run(host='0.0.0.0', port=5001, debug=True)
from transformers import ViTImageProcessor, ViTForImageClassification, BlipProcessor, BlipForConditionalGeneration, pipeline
from PIL import Image
import torch
from keybert import KeyBERT
import requests
from io import BytesIO
from sentence_transformers import SentenceTransformer # Make sure this is installed and updated

# --- IMAGE MODELS ---
print("Loading Image AI models (ViT & BLIP)...")
vit_processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
vit_model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
print("Image AI models loaded.")

# --- TEXT MODELS ---
print("Loading Text AI models (T5 & KeyBERT)...")
summarizer = pipeline("summarization", model="t5-small")
kw_model = KeyBERT(model='all-MiniLM-L6-v2') # Keep MiniLM for KeyBERT text analysis
print("Text AI models loaded.")

# --- EMBEDDING MODEL (CLIP for Images/Text) ---
print("Loading CLIP Embedding model...")
embedding_model = SentenceTransformer('clip-ViT-B-32')
# CLIP ViT-B/32 outputs 512-dimension vectors
EMBEDDING_DIMENSION = 512 # Export this dimension
print(f"CLIP Embedding model loaded (Dimension: {EMBEDDING_DIMENSION}).")

def analyze_image_with_ai(image_url, top_k_tags=5):
    """Analyzes an image from a URL for caption, tags, and CLIP embedding."""
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        print(f"Error fetching or opening image: {e}")
        return {"caption": "Could not process image.", "tags": [], "embedding": None}

    # --- Generate Caption using BLIP ---
    inputs = blip_processor(image, return_tensors="pt")
    out = blip_model.generate(**inputs, max_new_tokens=50)
    generated_caption = blip_processor.decode(out[0], skip_special_tokens=True)

    # --- Generate Tags using ViT ---
    vit_inputs = vit_processor(images=image, return_tensors="pt")
    with torch.no_grad():
        logits = vit_model(**vit_inputs).logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]
    top_k = torch.topk(probabilities, top_k_tags)
    predicted_tags = [vit_model.config.id2label[idx.item()].split(',')[0].strip() for idx in top_k.indices]

    # --- Generate Embedding using CLIP (directly from image) ---
    embedding = embedding_model.encode(image).tolist()

    return {"caption": generated_caption, "tags": predicted_tags, "embedding": embedding}


def analyze_text_with_ai(text_content, top_k_tags=5):
    """Analyzes text for summary, tags, and CLIP embedding."""
    if not text_content or len(text_content.split()) < 20:
         return {"caption": "Content too short to analyze.", "tags": [], "embedding": None}

    # --- Generate Summary (Caption) ---
    summary_result = summarizer("summarize: " + text_content, max_length=50, min_length=15, do_sample=False)
    generated_caption = summary_result[0]['summary_text']

    # --- Generate Tags using KeyBERT ---
    keywords = kw_model.extract_keywords(text_content, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=top_k_tags)
    predicted_tags = [kw[0] for kw in keywords]

    # --- Generate Embedding using CLIP (from text) ---
    embedding = embedding_model.encode(text_content).tolist()

    return {"caption": generated_caption, "tags": predicted_tags, "embedding": embedding}
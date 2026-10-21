import os
import traceback

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image, ImageOps

app = Flask(__name__)
CORS(app)

# ── Settings ────────────────────────────────────────────────────────────
USE_TTA = True   # average predictions over 3 views of the photo (set False to compare)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = tf.keras.models.load_model(
    os.path.join(BASE_DIR, "waste_model_clean.keras"), compile=False
)

with open(os.path.join(BASE_DIR, "labels.txt"), "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f.readlines() if line.strip()]

# ── Startup diagnostics ─────────────────────────────────────────────────
try:
    n_out = model.output_shape[-1]
    if n_out != len(class_names):
        print(f"WARNING: model has {n_out} outputs but labels.txt has {len(class_names)} lines")
except Exception:
    pass

# IMPORTANT: this server sends raw pixel values (0-255). The paper's models do their
# pixel scaling INSIDE the model. If no Rescaling/preprocessing layer shows up below,
# the model expects pre-scaled input and accuracy will be badly hurt.
print("First layers of the model:", [type(l).__name__ for l in model.layers[:6]])


# ── Image preparation ───────────────────────────────────────────────────
def prepare_views(image):
    """Return a batch of views of the photo, shape (n, 224, 224, 3), raw 0-255 floats."""
    image = ImageOps.exif_transpose(image)  # fix sideways phone photos
    image = image.convert("RGB")

    def to_array(im):
        return np.array(im.resize((224, 224)), dtype=np.float32)

    views = [to_array(image)]
    if USE_TTA:
        views.append(to_array(ImageOps.mirror(image)))        # horizontal flip
        w, h = image.size
        dx, dy = int(w * 0.05), int(h * 0.05)                 # 90% centre crop
        views.append(to_array(image.crop((dx, dy, w - dx, h - dy))))
    return np.stack(views, axis=0)


@app.route("/")
def home():
    return "Flask backend is running"


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        image = Image.open(request.files["file"].stream)
        batch = prepare_views(image)
        preds = model.predict(batch, verbose=0)
        mean_probs = preds.mean(axis=0)

        pred_index = int(np.argmax(mean_probs))
        confidence = float(np.max(mean_probs))

        return jsonify({
            "predicted_class": class_names[pred_index],
            "confidence": confidence
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {e}"}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

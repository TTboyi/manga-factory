from flask import Blueprint, request, jsonify
from services.storyboard_service import generate_storyboard_images

image_bp = Blueprint("image_bp", __name__, url_prefix="/image")


@image_bp.route("/generate_storyboard", methods=["POST"])
def generate_storyboard():
    """
    Body:
    {
      "novel_text": "...",
      "scenes": [ {id,title,description}, ... ],
      "visual_spec": {
         "role_features": "...",
         "art_style": "...",
         "reference_images": [...],
         ...
      }
    }

    Return:
    {
      "images": [...],
      "prompts": [...]
    }
    """
    data = request.get_json(force=True)
    novel_text = data.get("novel_text", "")
    scenes = data.get("scenes", [])
    visual_spec = data.get("visual_spec", {})

    result = generate_storyboard_images(
        novel_text=novel_text,
        scenes=scenes,
        visual_spec=visual_spec,
    )
    return jsonify(result)

from app.renderers.profile_card import render_profile_card

def prepare_render_data(payload: dict) -> bytes:
    return render_profile_card(payload)
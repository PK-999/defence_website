import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

FONT_DEV_PATH = "/System/Library/Fonts/Supplemental/ITFDevanagari.ttc"
FONT_LATIN_PATH = "/System/Library/Fonts/Helvetica.ttc"

MEDAL_SPECS = {
    "pvc": {
        "name_hi": "परमवीर चक्र",
        "name_en": "PARAM VIR CHAKRA",
        "metal": "bronze",
        "mirror_ribbon": False,
        "base_color": (120, 85, 52),
        "highlight_color": (195, 155, 105),
        "shadow_color": (45, 30, 18),
        "text_highlight": (215, 175, 125),
        "text_shadow": (35, 22, 12),
        "rim_double": False,
    },
    "mvc": {
        "name_hi": "महावीर चक्र",
        "name_en": "MAHA VIR CHAKRA",
        "metal": "silver",
        "mirror_ribbon": True, # White left, orange right on front -> Orange left, white right on back
        "base_color": (175, 182, 190),
        "highlight_color": (240, 244, 248),
        "shadow_color": (75, 82, 90),
        "text_highlight": (250, 252, 255),
        "text_shadow": (55, 60, 68),
        "rim_double": False,
    },
    "vc": {
        "name_hi": "वीर चक्र",
        "name_en": "VIR CHAKRA",
        "metal": "silver",
        "mirror_ribbon": True, # Blue left, orange right on front -> Orange left, blue right on back
        "base_color": (175, 182, 190),
        "highlight_color": (240, 244, 248),
        "shadow_color": (75, 82, 90),
        "text_highlight": (250, 252, 255),
        "text_shadow": (55, 60, 68),
        "rim_double": False,
    },
    "ac": {
        "name_hi": "अशोक चक्र",
        "name_en": "ASHOKA CHAKRA",
        "metal": "gold",
        "mirror_ribbon": False,
        "base_color": (212, 160, 48),
        "highlight_color": (255, 225, 120),
        "shadow_color": (90, 62, 15),
        "text_highlight": (255, 238, 160),
        "text_shadow": (70, 48, 10),
        "rim_double": True,
    },
    "kc": {
        "name_hi": "कीर्ति चक्र",
        "name_en": "KIRTI CHAKRA",
        "metal": "silver",
        "mirror_ribbon": False,
        "base_color": (175, 182, 190),
        "highlight_color": (240, 244, 248),
        "shadow_color": (75, 82, 90),
        "text_highlight": (250, 252, 255),
        "text_shadow": (55, 60, 68),
        "rim_double": True,
    },
    "sc": {
        "name_hi": "शौर्य चक्र",
        "name_en": "SHAURYA CHAKRA",
        "metal": "bronze",
        "mirror_ribbon": False,
        "base_color": (120, 85, 52),
        "highlight_color": (195, 155, 105),
        "shadow_color": (45, 30, 18),
        "text_highlight": (215, 175, 125),
        "text_shadow": (35, 22, 12),
        "rim_double": True,
    },
}

def draw_lotus(draw, cx, cy, size, fill_color, shadow_color, highlight_color):
    """Draws a stylized heraldic lotus motif."""
    s = size
    # Outer petals
    draw.polygon([(cx - s, cy + s*0.3), (cx - s*0.6, cy - s*0.5), (cx, cy + s*0.1)], fill=shadow_color)
    draw.polygon([(cx + s, cy + s*0.3), (cx + s*0.6, cy - s*0.5), (cx, cy + s*0.1)], fill=shadow_color)
    # Mid petals
    draw.polygon([(cx - s*0.7, cy + s*0.2), (cx - s*0.35, cy - s*0.75), (cx, cy + s*0.15)], fill=fill_color)
    draw.polygon([(cx + s*0.7, cy + s*0.2), (cx + s*0.35, cy - s*0.75), (cx, cy + s*0.15)], fill=fill_color)
    # Center petal
    draw.polygon([(cx - s*0.3, cy + s*0.2), (cx, cy - s), (cx + s*0.3, cy + s*0.2)], fill=highlight_color)
    # Base calyx / seedpod
    draw.arc([cx - s*0.6, cy, cx + s*0.6, cy + s*0.6], 0, 180, fill=shadow_color, width=2)
    draw.ellipse([cx - s*0.2, cy + s*0.1, cx + s*0.2, cy + s*0.4], fill=highlight_color)

def draw_curved_text(img, text, font, cx, cy, radius, start_angle_deg, end_angle_deg, is_clockwise=True, text_color=(255, 255, 255), shadow_color=(0, 0, 0), highlight_color=(255, 255, 255)):
    chars = list(text)
    if not chars:
        return
    n = len(chars)
    span = end_angle_deg - start_angle_deg
    
    for i, ch in enumerate(chars):
        if n > 1:
            t = i / (n - 1)
        else:
            t = 0.5
        angle_deg = start_angle_deg + t * span
        angle_rad = math.radians(angle_deg)
        
        # Position on circle
        x = cx + radius * math.cos(angle_rad)
        y = cy + radius * math.sin(angle_rad)
        
        # Render character to small image
        char_canvas = Image.new("RGBA", (120, 120), (0, 0, 0, 0))
        d_char = ImageDraw.Draw(char_canvas)
        
        bbox = font.getbbox(ch)
        cw = bbox[2] - bbox[0]
        ch_h = bbox[3] - bbox[1]
        
        # Draw shadow
        d_char.text((60 - cw/2 + 1, 60 - ch_h/2 + 1), ch, font=font, fill=shadow_color)
        # Draw highlight
        d_char.text((60 - cw/2 - 1, 60 - ch_h/2 - 1), ch, font=font, fill=highlight_color)
        # Draw main text
        d_char.text((60 - cw/2, 60 - ch_h/2), ch, font=font, fill=text_color)
        
        # Rotate character so it follows the curve
        if is_clockwise:
            rot_deg = -(angle_deg + 90)
        else:
            rot_deg = -(angle_deg - 90)
            
        rotated = char_canvas.rotate(rot_deg, resample=Image.Resampling.BICUBIC)
        rw, rh = rotated.size
        img.paste(rotated, (int(x - rw/2), int(y - rh/2)), rotated)

def generate_reverse_medal(code):
    spec = MEDAL_SPECS[code]
    obverse_path = f"public/images/medals/{code}-obverse.png"
    obverse = Image.open(obverse_path).convert("RGBA")
    w, h = obverse.size
    
    # Create reverse canvas
    reverse = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # 1. Ribbon layer (y from 0 to 440)
    ribbon_crop = obverse.crop((0, 0, w, 440))
    if spec["mirror_ribbon"]:
        ribbon_crop = ribbon_crop.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    reverse.paste(ribbon_crop, (0, 0), ribbon_crop)
    
    # 2. Disc parameters
    cx = 148.0
    cy = 574.0
    r = 124.0
    
    disc_canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(disc_canvas)
    
    base_col = spec["base_color"]
    hi_col = spec["highlight_color"]
    sh_col = spec["shadow_color"]
    
    # Radial shaded disc background
    for rad in range(int(r), 0, -1):
        ratio = rad / r
        # Metallic gradient from top-left specular highlight to bottom-right ambient
        # Interpolate between highlight, base, and shadow
        r_col = int(sh_col[0] + (hi_col[0] - sh_col[0]) * (1 - ratio*0.6))
        g_col = int(sh_col[1] + (hi_col[1] - sh_col[1]) * (1 - ratio*0.6))
        b_col = int(sh_col[2] + (hi_col[2] - sh_col[2]) * (1 - ratio*0.6))
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=(r_col, g_col, b_col, 255))
    
    # Beveled Outer Rim
    rim_w = 12
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=sh_col, width=3)
    draw.ellipse([cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1], outline=hi_col, width=2)
    draw.ellipse([cx - (r - rim_w), cy - (r - rim_w), cx + (r - rim_w), cy + (r - rim_w)], outline=sh_col, width=2)
    
    if spec["rim_double"]:
        # Prominent double raised rim for AC, KC, SC
        draw.ellipse([cx - (r - 6), cy - (r - 6), cx + (r - 6), cy + (r - 6)], outline=hi_col, width=2)
        draw.ellipse([cx - (r - 18), cy - (r - 18), cx + (r - 18), cy + (r - 18)], outline=sh_col, width=2)
    
    # Subtle radial texture rings in central field
    inner_r = r - (28 if spec["rim_double"] else 22)
    draw.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], outline=hi_col, width=1)
    for ir in range(int(inner_r - 10), 10, -12):
        draw.ellipse([cx - ir, cy - ir, cx + ir, cy + ir], outline=(sh_col[0], sh_col[1], sh_col[2], 50), width=1)
    
    # 3. Embossed Circular Text
    # Hindi on top arc (-155 deg to -25 deg)
    font_dev = ImageFont.truetype(FONT_DEV_PATH, 20)
    font_latin = ImageFont.truetype(FONT_LATIN_PATH, 16)
    
    text_r = r - (20 if spec["rim_double"] else 15)
    
    draw_curved_text(
        disc_canvas,
        spec["name_hi"],
        font_dev,
        cx, cy,
        radius=text_r,
        start_angle_deg=-150,
        end_angle_deg=-30,
        is_clockwise=True,
        text_color=base_col,
        shadow_color=spec["text_shadow"],
        highlight_color=spec["text_highlight"]
    )
    
    # English on bottom arc (150 deg to 30 deg, counter-clockwise so text is upright)
    draw_curved_text(
        disc_canvas,
        spec["name_en"],
        font_latin,
        cx, cy,
        radius=text_r,
        start_angle_deg=150,
        end_angle_deg=30,
        is_clockwise=False,
        text_color=base_col,
        shadow_color=spec["text_shadow"],
        highlight_color=spec["text_highlight"]
    )
    
    # 4. Two Lotus Flowers separating Hindi and English inscriptions
    # Left Lotus at angle ~ 180 deg
    left_lx = cx - text_r * 0.98
    left_ly = cy
    draw_lotus(draw, left_lx, left_ly, size=8, fill_color=base_col, shadow_color=spec["text_shadow"], highlight_color=spec["text_highlight"])
    
    # Right Lotus at angle ~ 0 deg
    right_lx = cx + text_r * 0.98
    right_ly = cy
    draw_lotus(draw, right_lx, right_ly, size=8, fill_color=base_col, shadow_color=spec["text_shadow"], highlight_color=spec["text_highlight"])
    
    # Specular Glare Arc (shiny metallic light sweep across disc)
    glare = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glare)
    g_draw.arc([cx - r + 4, cy - r + 4, cx + r - 4, cy + r - 4], 200, 310, fill=(255, 255, 255, 120), width=3)
    glare = glare.filter(ImageFilter.GaussianBlur(radius=1.5))
    disc_canvas = Image.alpha_composite(disc_canvas, glare)
    
    # Composite disc onto reverse canvas
    reverse = Image.alpha_composite(reverse, disc_canvas)
    
    # Save output
    out_path = f"public/images/medals/{code}-reverse.png"
    reverse.save(out_path, "PNG")
    print(f"Generated {out_path} ({reverse.size})")

if __name__ == "__main__":
    for code in MEDAL_SPECS.keys():
        generate_reverse_medal(code)
    print("All 6 reverse medals generated successfully!")

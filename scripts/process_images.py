"""
Gera os assets web a partir das fotos originais em assets-src/photos.

  python3 scripts/process_images.py

1) Retrato de estúdio -> recorte (alpha) em P&B editorial de alto contraste.
   O alpha bruto (assets-src/photos/yasmin-retrato-recorte.png) foi gerado com
   `rembg` + modelo BiRefNet-portrait. Para regenerá-lo:
     pip install rembg
     python3 -c "from rembg import remove,new_session;from PIL import Image;\
       remove(Image.open('assets-src/photos/yasmin-retrato-estudio.webp').convert('RGB'),\
       session=new_session('birefnet-portrait')).save('assets-src/photos/yasmin-retrato-recorte.png')"
   Depois rode scripts/refine_matte.py, que gera yasmin-retrato-recorte-refinado.png.
2) Fotos de viagem -> crops verticais em cor (o P&B é aplicado via CSS).
"""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "photos"
OUT = ROOT / "src" / "assets" / "images" / "yasmin"
OUT.mkdir(parents=True, exist_ok=True)


def editorial_bw(rgba: Image.Image) -> Image.Image:
    arr = np.asarray(rgba).astype(np.float32) / 255.0
    rgb, a = arr[..., :3], arr[..., 3]
    # Mixagem de canais puxada para o vermelho: pele luminosa, roupa preta densa.
    lum = rgb[..., 0] * 0.46 + rgb[..., 1] * 0.42 + rgb[..., 2] * 0.12
    # Normaliza usando apenas pixels do sujeito.
    m = a > 0.9
    lo, hi = np.percentile(lum[m], 1.0), np.percentile(lum[m], 99.6)
    lum = np.clip((lum - lo) / (hi - lo), 0, 1)
    # Curva em S suave (contraste de cópia fotográfica) + leve gama.
    lum = lum ** 0.92
    s = 1 / (1 + np.exp(-7.5 * (lum - 0.5)))
    s0, s1 = 1 / (1 + np.exp(3.75)), 1 / (1 + np.exp(-3.75))
    lum = (s - s0) / (s1 - s0) * 0.82 + lum * 0.18
    # Alpha já refinado em refine_matte.py (sem ajustes extras aqui).
    g = (np.clip(lum, 0, 1) * 255).astype(np.uint8)
    out = np.dstack([g, g, g, (a * 255).astype(np.uint8)])
    return Image.fromarray(out, "RGBA")


def save_webp(im: Image.Image, name: str, width: int, quality: int = 84):
    h = round(im.height * width / im.width)
    im.resize((width, h), Image.LANCZOS).save(OUT / name, "WEBP", quality=quality, method=6)
    print("->", name, (width, h))


# 1) Retrato recortado
cut = Image.open(SRC / "yasmin-retrato-recorte-refinado.png").convert("RGBA")  # ver refine_matte.py
bbox = cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
x0, y0, x1, y1 = bbox
pad = 10
cut = cut.crop((max(0, x0 - pad), max(0, y0 - pad), min(cut.width, x1 + pad), cut.height))
bw = editorial_bw(cut)
for w in (1100, 640):
    save_webp(bw, f"yasmin-hero-recorte-pb-{w}.webp", w, 86)

# 2) Viagens (crop vertical 4:5 focado na pessoa)
def crop_box(im, cx, cy, w_frac, ratio=4 / 5):
    W, H = im.size
    w = W * w_frac
    h = w / ratio
    if h > H:
        h = H
        w = h * ratio
    x = min(max(cx * W - w / 2, 0), W - w)
    y = min(max(cy * H - h / 2, 0), H - h)
    return im.crop((round(x), round(y), round(x + w), round(y + h)))

tibre = Image.open(SRC / "yasmin-roma-tibre.jpg").convert("RGB")
save_webp(crop_box(tibre, 0.62, 0.5, 0.78), "viagem-roma-tibre.webp", 900, 82)

castel = Image.open(SRC / "yasmin-roma-castel-santangelo.jpg").convert("RGB")
save_webp(crop_box(castel, 0.56, 0.5, 0.80), "viagem-roma-castel-santangelo.webp", 900, 82)

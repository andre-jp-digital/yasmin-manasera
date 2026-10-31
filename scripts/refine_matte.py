"""
Refina o matte do recorte (cabelo) antes do tratamento P&B.

  python3 scripts/refine_matte.py

Entrada : assets-src/photos/yasmin-retrato-estudio.webp  (foto original)
          assets-src/photos/yasmin-retrato-recorte.png   (alpha do BiRefNet)
Saída   : assets-src/photos/yasmin-retrato-recorte-refinado.png

Etapas:
 1. abertura morfológica no alpha: remove fios finos e quebrados
    (que aparecem como "tracejado" sobre fundos chapados);
 2. remoção de fragmentos desconectados da silhueta principal;
 3. filtro guiado (guia = luminância da foto): alinha a borda ao contorno
    real do cabelo e elimina o serrilhado em degraus;
 4. curva de contraste suave no alpha + leve desfoque: borda limpa e macia;
 5. descontaminação de cor (pymatting.estimate_foreground_ml): remove o
    resíduo do fundo escuro original nas bordas semitransparentes.
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from pymatting import estimate_foreground_ml

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets-src' / 'photos'

img = np.asarray(Image.open(SRC / 'yasmin-retrato-estudio.webp').convert('RGB')).astype(np.float64) / 255
a = np.asarray(Image.open(SRC / 'yasmin-retrato-recorte.png').convert('RGBA'))[..., 3].astype(np.float64) / 255

# 1. abertura morfológica (estruturas com menos de ~7 px somem)
a1 = ndi.grey_opening(a, size=(7, 7))

# 2. mantém só a silhueta principal
lab, n = ndi.label(a1 > 0.5)
if n > 1:
    sizes = ndi.sum(np.ones_like(a1), lab, index=range(1, n + 1))
    main = lab == (1 + int(np.argmax(sizes)))
    keep = ndi.binary_dilation(main, iterations=6)
    a1 = a1 * keep

# 3. filtro guiado
def box(x, r):
    return ndi.uniform_filter(x, size=2 * r + 1, mode='reflect')

def guided(I, p, r, eps):
    mI, mp = box(I, r), box(p, r)
    cov = box(I * p, r) - mI * mp
    var = box(I * I, r) - mI * mI
    A = cov / (var + eps)
    b = mp - A * mI
    return box(A, r) * I + box(b, r)

lum = img @ np.array([0.3, 0.59, 0.11])
a2 = np.clip(guided(lum, a1, r=4, eps=1e-3), 0, 1)

# 4. curva suave + leve desfoque
t = np.clip((a2 - 0.12) / 0.76, 0, 1)
a3 = t * t * (3 - 2 * t)
a3 = ndi.gaussian_filter(a3, 0.7)
a3[a3 < 0.02] = 0

# 5. descontaminação de cor
fg = estimate_foreground_ml(img, a3)
out = np.dstack([np.clip(fg, 0, 1), a3])
Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA').save(SRC / 'yasmin-retrato-recorte-refinado.png')
print('ok', out.shape)

"""Recorta o medalhão do mascote (disco laranja + chapéu) do logo original.

Uso:  python3 scripts/extract-mascot.py
Lê   design/brand/logo-original.png
Gera design/brand/mascot-medallion.png (RGBA, 3x) e mascot-meta.json

A faixa "Mamadi Food" do logo original é cortada fora: a faixa nova ("Mamadi")
é desenhada em vetor por cima, na arte da tampinha.
"""
import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1] / "design" / "brand"
src = Image.open(ROOT / "logo-original.png").convert("RGB")
a = np.asarray(src).astype(int)
H, W, _ = a.shape

# círculo do disco laranja (ajustado por mínimos quadrados na borda do disco)
cx, cy, R = 764.3, 402.6, 169.6
yy, xx = np.mgrid[0:H, 0:W]
dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
disk = dist <= R

# o chapéu sai um pouco do disco: flood fill dos brancos ligados ao chapéu
r, g, b = a[..., 0], a[..., 1], a[..., 2]
light = ((r + g + b) > 540) & ((np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)) < 40)
allowed = light & (dist < 212) & ((yy >= 238) | (dist <= R))
seed = (680, 300)
hat = np.zeros_like(light)
q = deque([seed])
hat[seed[1], seed[0]] = True
while q:
    x, y = q.popleft()
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < W and 0 <= ny < H and not hat[ny, nx] and allowed[ny, nx]:
            hat[ny, nx] = True
            q.append((nx, ny))
hat_d = (np.asarray(Image.fromarray((hat * 255).astype("uint8")).filter(ImageFilter.MaxFilter(7))) > 0) & (yy >= 233)

mask = disk | hat_d
mask &= yy < (532 + ((xx - cx) / R) ** 2 * 14)  # corta logo acima da faixa antiga

x0, x1 = int(cx - R - 24), int(cx + R + 24)
y0, y1 = int(cy - R - 12), int(cy + R + 4)
S = 3
crop = src.crop((x0, y0, x1, y1))
m = Image.fromarray((mask * 255).astype("uint8")).crop((x0, y0, x1, y1))
big = crop.resize((crop.width * S, crop.height * S), Image.LANCZOS).filter(
    ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2)
)
big_m = m.resize((m.width * S, m.height * S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.1))
out = big.convert("RGBA")
out.putalpha(big_m)
out.save(ROOT / "mascot-medallion.png")
meta = dict(w=out.width, h=out.height, cx=(cx - x0) * S, cy=(cy - y0) * S, R=R * S)
(ROOT / "mascot-meta.json").write_text(json.dumps(meta))
print(meta)

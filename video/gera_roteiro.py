"""Monta o roteiro do vídeo (roteiro.json) a partir das marcas gravadas em cada trecho."""
import json, os

D = os.path.dirname(os.path.abspath(__file__))
PASTA = {"tour": "tour", "busca": "busca", "sinuca": "sinuca2"}
seg = {k: json.load(open(f"{D}/{PASTA[k]}/frames.json")) for k in ("tour", "busca", "sinuca")}
# na gravação lenta a tampinha demora para voar: corta a espera (de A até B, em tempo do site)
CUT_A, CUT_B = 4.9, 7.15
CUT = CUT_B - CUT_A
# sinuca: da mira até soltar o taco, corte seco para a roleta
SC_A, SC_B = 7.45, 10.33
SCUT = SC_B - SC_A
mk = {k: {m["label"]: m["v"] for m in seg[k]["marks"]} for k in seg}

TITULO = 3.0
FADE = 0.32
t_tour = TITULO
d_tour = mk["tour"]["fim"] - CUT
t_busca = t_tour + d_tour
v0_busca = 0.35
d_busca = mk["busca"]["fim"] - v0_busca
t_sin = t_busca + d_busca
d_sin = mk["sinuca"]["fim"] - SCUT
t_fim = t_sin + d_sin
DUR = round(t_fim + 5.9, 2)

def T(k, label, d=0.0):
    v = mk[k][label] + d
    if k == "tour" and v >= CUT_B:
        v -= CUT
    if k == "sinuca" and v >= SC_B:
        v -= SCUT
    return round({"tour": t_tour, "sinuca": t_sin}[k] + v, 3)
TB = lambda label, d=0.0: round(t_busca + mk["busca"][label] - v0_busca + d, 3)

t_cut = t_tour + CUT_A
telas = [
    {"seg": "tour", "t0": t_tour, "t1": t_cut, "v0": 0.0},
    {"seg": "tour", "t0": t_cut, "t1": t_busca, "v0": CUT_B},
    {"seg": "busca", "t0": t_busca, "t1": t_sin, "v0": v0_busca},
    {"seg": "sinuca", "t0": t_sin, "t1": t_sin + SC_A, "v0": 0.0},
    {"seg": "sinuca", "t0": t_sin + SC_A, "t1": t_fim + 0.6, "v0": SC_B},
]
L = lambda a, b, k, t, cor, cor2="#000": {"t0": round(a, 2), "t1": round(b, 2), "k": k, "t": t, "cor": cor, "cor2": cor2}
pop = round(t_cut + 0.13, 3)
promos_vis = round(t_cut + 1.45, 3)
t_tacada = round(t_sin + SC_A, 3)
legendas = [
    L(TITULO + 0.2, T("tour", "puxa"), "o muro da fachada ganhou vida", "A garrafa do olho", "#ff7a1a", "#7a2604"),
    L(T("tour", "puxa"), promos_vis, "puxa a etiqueta", "E abre o cardápio", "#fa5a0a", "#7a2604"),
    L(promos_vis, T("tour", "desafio", 0.8), "promoções e combos", "Girando sem parar", "#e2cd3b", "#5c5212"),
    L(T("tour", "desafio", 0.8), T("tour", "breja", 0.2), "novo no cardápio", "Sinuca valendo drink", "#43d1dc", "#0b4f55"),
    L(T("tour", "breja", 0.3), T("tour", "fala", 0.0), "a turma do muro", "Cada um manda numa categoria", "#ff4fbf", "#6b0a45"),
    L(T("tour", "fala", 0.1), T("tour", "ficha", 0.2), "toca no personagem", "E ganha a dica da casa", "#fc00a0", "#6b0a45"),
    L(T("tour", "ficha", 0.3), t_busca - 0.05, "combina com", "3 sugestões em cada item", "#2fbf71", "#0e4d2b"),
    L(t_busca + 0.15, t_sin - 0.05, "busca inteligente e por voz", "Pede o drink do Lula", "#ff7a1a", "#7a2604"),
    L(t_sin + 0.15, T("sinuca", "vs"), "sinuca valendo drink", "Escolha seu personagem", "#43d1dc", "#0b4f55"),
    L(T("sinuca", "vs", 2.3), t_tacada, "1 × 1 ou 2 × 2", "Puxa o taco e solta", "#e2cd3b", "#5c5212"),
    L(t_tacada + 0.05, t_fim - 0.05, "a cada 2 bolas", "A roleta sorteia: quem perde paga", "#fa5a0a", "#7a2604"),
]
A = lambda id, a, b, **kw: {"id": id, "t0": round(a, 2), "t1": round(b, 2), **kw}
adesivos = [
    A("breja", T("tour", "breja", 0.35), T("tour", "skate", 0.1), x=-40, y=1180, h=430, rot=-6),
    A("skatista", T("tour", "skate", 0.3), T("tour", "rainha", 0.1), right=-30, y=1130, h=460, rot=6),
    A("rainha", T("tour", "rainha", 0.3), T("tour", "ficha", 0.0), x=-30, y=1120, h=470, rot=-5),
    A("rainha", T("sinuca", "vs", 0.35), T("sinuca", "vs", 2.6), x=-40, y=1240, h=400, rot=-7),
    A("dj", T("sinuca", "vs", 0.45), T("sinuca", "vs", 2.6), right=-50, y=1240, h=400, rot=7),
]
crew = {
    "breja": {"img": "/proj/public/muro/breja.webp", "nome": "Breja", "cor": "#3fa9f5"},
    "skatista": {"img": "/proj/public/muro/skatista.webp", "nome": "Skate", "cor": "#f6c21e"},
    "rainha": {"img": "/proj/public/muro/rainha.webp", "nome": "Rainha", "cor": "#fc00a0"},
    "dj": {"img": "/proj/public/muro/dj.webp", "nome": "DJ Fita", "cor": "#ff4fbf"},
    "oculos": {"img": "/proj/public/muro/oculos.webp", "nome": "Pista", "cor": "#21d4c4"},
    "agachado": {"img": "/proj/public/muro/agachado.webp", "nome": "Na Moral", "cor": "#8b7bff"},
    "brinde": {"img": "/proj/public/muro/brinde.webp", "nome": "Saúde", "cor": "#f6a21e"},
    "gole": {"img": "/proj/public/muro/gole.webp", "nome": "Gole", "cor": "#2fbf71"},
}
frames = {k: [[f["v"], PASTA[k] + "/" + f["name"]] for f in seg[k]["frames"]] for k in seg}
# deixa os quadros do começo em v >= 0
for k in frames:
    frames[k] = [[max(0.0, v), n] for v, n in frames[k]]

audio = {
    "titulo": TITULO,
    "pop": pop,
    "donos": [T("tour", "breja", 0.35), T("tour", "skate", 0.3), T("tour", "rainha", 0.3)],
    "fala": T("tour", "fala"),
    "ficha": T("tour", "ficha"),
    "busca": t_busca,
    "teclas": [round(TB("digita", 0.08 * i), 3) for i in range(13)],
    "sinuca": t_sin,
    "vs": T("sinuca", "vs", 0.35),
    "tacada": t_tacada,
    "roleta": T("sinuca", "roleta", 0.05),
    "premio": T("sinuca", "roleta", 2.8),
    "fim": t_fim,
}
R = {
    "dur": DUR, "fade": FADE, "titulo": [0, TITULO], "fim": [t_fim, DUR],
    "telas": telas, "legendas": legendas, "adesivos": adesivos, "crew": crew,
    "lineup": ["breja", "skatista", "rainha", "dj", "oculos", "agachado", "brinde"],
    "flashes": [TITULO - 0.02, pop, t_busca, t_sin, t_tacada, t_fim + 0.3],
    "frames": frames, "audio": audio,
}
json.dump(R, open(f"{D}/roteiro.json", "w"))
print("duração", DUR, "| tour", t_tour, "busca", t_busca, "sinuca", t_sin, "fim", t_fim)
print("áudio", {k: v for k, v in audio.items() if k != "teclas"})

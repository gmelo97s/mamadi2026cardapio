"""Trilha original de samba (100 BPM) para o vídeo do cardápio novo do Mamadi.
Vem da trilha feita para o vídeo da Roda de Samba (mesmos instrumentos sintetizados,
sem direitos autorais), com arranjo novo e efeitos no ritmo das cenas (roteiro.json).

Trilha anterior:

Instrumentos: surdos, caixa, tamborim (teleco-teco), pandeiro, ganzá, agogô,
repique, apito, cavaquinho e baixo (Karplus-Strong) + efeitos (impactos, whooshes).
A grade de tempo é a mesma usada pelas animações (1 tempo = 0,6 s).

Abertura (6 s): áudio real do ensaio (vídeo do rapaz de patins), cortado para que
uma batida caia exatamente na emenda com a trilha (t = 6 s no vídeo final).

Uso: python3 02_trilha.py  ->  work/trilha.wav (36 s)
"""
import os
import subprocess
import numpy as np
from scipy.signal import lfilter, butter, sosfilt, fftconvolve
import soundfile as sf
import pyloudnorm as pyln

SR = 44100
BPM = 100
BEAT = 60 / BPM            # 0,6 s
S16 = BEAT / 4             # semicolcheia
import json
R = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "roteiro.json")))
DUR = float(R["dur"])
N = int(SR * (DUR + 2.0))
rng = np.random.default_rng(27)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trilha.wav")

# suingue do samba: 4ª semicolcheia levemente adiantada, 2ª levemente atrasada
SWING = [0.0, 0.018, 0.0, -0.022]


def t16(beat, k):
    """tempo (s) da semicolcheia k (0..3) do tempo `beat`, com suingue."""
    return (beat + k / 4 + SWING[k % 4]) * BEAT


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def env_exp(n, tau, attack=0.001):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1) if attack > 0 else 1
    return a * np.exp(-t / tau)


def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


class Track:
    def __init__(self, stereo_pan=0.0):
        self.buf = np.zeros(N)
        self.pan = stereo_pan

    def add(self, t, sig, gain=1.0):
        t += rng.normal(0, 0.003)  # humanização
        i = int(max(0, t) * SR)
        j = min(N, i + len(sig))
        if j > i:
            self.buf[i:j] += sig[: j - i] * gain


# ------------------------------------------------------------------ instrumentos
def surdo(f0=58, dur=0.9, muted=False):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = f0 * (1 + 0.9 * np.exp(-t / 0.018))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tau = 0.09 if muted else 0.42
    body = np.sin(ph) * env_exp(n, tau, 0.002)
    body += 0.55 * np.sin(2.01 * ph) * env_exp(n, tau * 0.5, 0.002)
    body += 0.3 * np.sin(3.2 * ph) * env_exp(n, tau * 0.3, 0.002)
    click = lp(rng.normal(0, 1, n), 1800) * env_exp(n, 0.012)
    return np.tanh(1.6 * (body + 0.5 * click)) * 0.9


def caixa(accent=1.0):
    n = int(SR * 0.16)
    wires = bp(rng.normal(0, 1, n), 1800, 9000) * env_exp(n, 0.045 if accent > 0.7 else 0.028)
    t = np.arange(n) / SR
    head = np.sin(2 * np.pi * 330 * t * (1 + 0.3 * np.exp(-t / 0.01))) * env_exp(n, 0.02)
    return (0.8 * wires + 0.5 * head) * accent


def tamborim(accent=1.0):
    n = int(SR * 0.12)
    t = np.arange(n) / SR
    f = 820 * (1 + 0.25 * np.exp(-t / 0.004))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = (np.sin(ph) + 0.4 * np.sin(1.58 * ph)) * env_exp(n, 0.035, 0.0005)
    stick = hp(rng.normal(0, 1, n), 2500) * env_exp(n, 0.006)
    return (tone + 0.7 * stick) * accent * 0.6


def pandeiro(kind="f", accent=1.0):
    n = int(SR * 0.22)
    t = np.arange(n) / SR
    jingle = bp(rng.normal(0, 1, n), 5500, 13000)
    jingle = jingle * (1 + 0.5 * np.sin(2 * np.pi * 41 * t)) * env_exp(n, 0.07, 0.002)
    out = 0.55 * jingle
    if kind == "T":      # polegar: grave
        out += np.sin(2 * np.pi * 150 * t * (1 + 0.4 * np.exp(-t / 0.01))) * env_exp(n, 0.09) * 0.9
    elif kind == "S":    # tapa: estalo
        out += bp(rng.normal(0, 1, n), 700, 3500) * env_exp(n, 0.02) * 1.1
    return out * accent * 0.55


def ganza(accent=1.0):
    n = int(SR * 0.11)
    t = np.arange(n) / SR
    e = np.clip(t / 0.012, 0, 1) * np.exp(-np.maximum(t - 0.012, 0) / 0.03)
    return hp(rng.normal(0, 1, n), 6000) * e * accent * 0.35


def agogo(high=True, accent=1.0):
    n = int(SR * 0.5)
    t = np.arange(n) / SR
    f = 1320 if high else 990
    sig = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (0.25 / r))
              for r, a in [(1, 1), (2.37, 0.45), (3.9, 0.22), (5.4, 0.1)])
    sig += hp(rng.normal(0, 1, n), 3000) * env_exp(n, 0.004) * 0.5
    return sig * accent * 0.3


def repique(accent=1.0):
    n = int(SR * 0.2)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 360 * t * (1 + 0.5 * np.exp(-t / 0.006))) * env_exp(n, 0.06)
    rim = bp(rng.normal(0, 1, n), 1500, 7000) * env_exp(n, 0.02)
    return (tone + 0.8 * rim) * accent * 0.7


def apito(dur=0.25, f=2900):
    n = int(SR * dur)
    t = np.arange(n) / SR
    warble = 1 + 0.035 * np.sign(np.sin(2 * np.pi * 34 * t))  # bolinha do apito
    ph = 2 * np.pi * np.cumsum(f * warble) / SR
    a = np.clip(t / 0.008, 0, 1) * np.clip((dur - t) / 0.02, 0, 1)
    sig = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.15 * bp(rng.normal(0, 1, n), 2000, 5000)
    return sig * a * 0.28


def ks_string(freq, dur, bright=0.7, decay=0.996, mute=False):
    """Corda dedilhada (Karplus-Strong com atraso fracionário)."""
    n = int(SR * dur)
    P = SR / freq
    Nd = int(np.floor(P - 0.5))
    frac = P - 0.5 - Nd
    burst = rng.uniform(-1, 1, Nd + 2)
    burst = lp(burst, 1500 + 7000 * bright, 1)
    x = np.zeros(n)
    x[: len(burst)] = burst
    g = decay if not mute else 0.94
    a = np.zeros(Nd + 3)
    a[0] = 1
    a[Nd] -= g * 0.5 * (1 - frac)
    a[Nd + 1] -= g * 0.5
    a[Nd + 2] -= g * 0.5 * frac
    y = lfilter([1.0], a, x)
    y *= np.clip((dur - np.arange(n) / SR) / 0.03, 0, 1)
    return y


def body_res(x):
    return x + 0.35 * bp(x, 250, 600) + 0.2 * bp(x, 900, 1600)


def strum(notes, down=True, accent=1.0, mute=False, dur=0.9):
    order = notes if down else notes[::-1]
    out = np.zeros(int(SR * (dur + 0.05)))
    for i, m in enumerate(order):
        s = ks_string(hz(m), dur, bright=0.55 if accent > 0.8 else 0.4, decay=0.9965, mute=mute)
        o = int(SR * 0.009 * i)
        out[o:o + len(s)] += s[: len(out) - o]
    return body_res(out) * accent * 0.32


def violao(notes, down=True, accent=1.0, mute=False, dur=0.8):
    order = notes if down else notes[::-1]
    out = np.zeros(int(SR * (dur + 0.06)))
    for i, m in enumerate(order):
        st = ks_string(hz(m), dur, bright=0.05 if accent < 0.8 else 0.12, decay=0.9975, mute=mute)
        o = int(SR * 0.012 * i)
        out[o:o + len(st)] += st[: len(out) - o]
    out = lp(out, 2000)
    return (out + 0.5 * bp(out, 100, 400)) * accent * 0.4


def bass_note(midi, dur=0.55):
    s = lp(ks_string(hz(midi), dur, bright=0.05, decay=0.998), 900)
    n = len(s)
    t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * hz(midi) * t) * env_exp(n, 0.35, 0.004)
    return (0.9 * s + 0.3 * sub) * 0.6


def impact(big=True):
    n = int(SR * (1.6 if big else 0.8))
    t = np.arange(n) / SR
    f = 32 + 90 * np.exp(-t / 0.06)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.5 if big else 0.25, 0.001)
    crack = lp(rng.normal(0, 1, n), 6000) * env_exp(n, 0.05)
    return np.tanh(1.8 * (boom + 0.45 * crack)) * (0.85 if big else 0.5)


def whoosh(dur=0.5, rise=True):
    n = int(SR * dur)
    t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    steps = 24
    for k in range(steps):
        seg = slice(k * n // steps, (k + 1) * n // steps)
        p = k / (steps - 1)
        fc = 300 + (6000 if rise else 6000 * (1 - p)) * (p if rise else 1)
        out[seg] = bp(noise, max(200, fc * 0.6), min(18000, fc * 1.6))[seg]
    shape = (t / dur) ** 2 if rise else np.exp(-t / (dur * 0.35))
    return out * shape * 0.35


def riser(dur=1.2):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = 200 * (8 ** (t / dur))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
    return (tone + whoosh(dur, True) * 0.8) * (t / dur) ** 1.5


# ------------------------------------------------------------------ arranjo
T = {k: Track(p) for k, p in dict(surdo=0, caixa=-0.15, tamb=0.35, pand=-0.3, ganza=0.25,
                                    agogo=0.4, rep=-0.2, apito=0.1, cav=0.25, vio=-0.25, bass=0, fx=0).items()}

# acordes (2 compassos de 2/4 = 4 tempos cada): C | A7 | Dm7 | G7
CHORDS = [
    ([64, 67, 72, 76], 48),   # C
    ([64, 69, 73, 79], 45),   # A7
    ([65, 69, 74, 77], 50),   # Dm7
    ([62, 67, 71, 77], 43),   # G7
]


VIOLAO = [[48, 55, 60, 64], [45, 52, 55, 61, 64], [50, 57, 60, 65], [43, 50, 53, 59, 62]]


def chord_at(beat):
    return CHORDS[int((beat - 4) // 4) % 4]


def groove(b, full=True, agogo_on=False, caixa_on=True, light=False):
    """Uma batida (tempo) de groove completo a partir do tempo b."""
    beat_in_bar = b % 2
    # surdos: segunda no 1, primeira (mais grave e forte) no 2
    if beat_in_bar == 0:
        T["surdo"].add(b * BEAT, surdo(68, 0.5, muted=True), 0.55)
        T["surdo"].add(t16(b, 3), surdo(80, 0.3, muted=True), 0.25)  # cortador
    else:
        T["surdo"].add(b * BEAT, surdo(55, 1.0), 1.0)
    for k in range(4):
        acc = 1.0 if k in (0, 3) else 0.45
        if caixa_on:
            T["caixa"].add(t16(b, k), caixa(acc * (0.9 if k == 3 and beat_in_bar else 0.75)), 0.55)
        kind = "T" if k == 0 else ("S" if (k == 2 and beat_in_bar == 1) else "f")
        T["pand"].add(t16(b, k), pandeiro(kind, 1.0 if k in (0, 2) else 0.6), 0.9)
        if not light:
            T["ganza"].add(t16(b, k), ganza(1.0 if k in (1, 3) else 0.55))
    # tamborim teleco-teco (padrão de 16 semicolcheias = 4 tempos)
    TT = [0, 2, 5, 7, 9, 12, 14]
    pos = int((b % 4) * 4)
    for k in range(4):
        if (pos + k) in TT:
            T["tamb"].add(t16(b, k), tamborim(1.0 if (pos + k) in (0, 9) else 0.75), 0.8)
    if agogo_on:
        if beat_in_bar == 0:
            T["agogo"].add(t16(b, 0), agogo(True)); T["agogo"].add(t16(b, 2), agogo(False, 0.8))
        else:
            T["agogo"].add(t16(b, 0), agogo(True, 0.8)); T["agogo"].add(t16(b, 1), agogo(True, 0.6))
            T["agogo"].add(t16(b, 3), agogo(False, 0.8))
    # cavaquinho: levada sincopada (por tempo)
    notes, root = chord_at(b)
    if beat_in_bar == 0:
        T["cav"].add(t16(b, 0), strum(notes, True, 1.0, dur=0.28))
        T["cav"].add(t16(b, 2), strum(notes, False, 0.55, mute=True, dur=0.12))
        T["cav"].add(t16(b, 3), strum(notes, True, 0.9, dur=0.3))
    else:
        T["cav"].add(t16(b, 1), strum(notes, False, 0.6, mute=True, dur=0.12))
        T["cav"].add(t16(b, 2), strum(notes, True, 0.95, dur=0.25))
        T["cav"].add(t16(b, 3), strum(notes, False, 0.6, mute=True, dur=0.12))
    # violão: marca o tempo com abafado no contratempo
    vi = VIOLAO[int((b - 4) // 4) % 4]
    T["vio"].add(t16(b, 0), violao(vi, True, 0.9, dur=0.5))
    T["vio"].add(t16(b, 2), violao(vi, False, 0.5, mute=True, dur=0.15))
    if beat_in_bar == 1:
        T["vio"].add(t16(b, 3), violao(vi, True, 0.6, dur=0.3))
    # baixo (baixaria simples)
    if beat_in_bar == 0:
        T["bass"].add(t16(b, 0), bass_note(root, 0.5))
        T["bass"].add(t16(b, 3), bass_note(root + 7 - 12, 0.25), 0.7)
    else:
        T["bass"].add(t16(b, 0), bass_note(root, 0.4), 0.8)
        nxt = chord_at(b + 1)[1]
        T["bass"].add(t16(b, 2), bass_note(nxt - 1 if (b % 4) == 3 else root + 4, 0.3), 0.6)


def hit(b, big=True, chord=None):
    t = b * BEAT
    T["surdo"].add(t, surdo(52, 1.2), 1.1)
    T["surdo"].add(t, surdo(70, 0.8), 0.6)
    T["caixa"].add(t, caixa(1.2), 0.9)
    T["rep"].add(t, repique(1.0))
    T["fx"].add(t, impact(big), 1.0 if big else 0.6)
    T["cav"].add(t, strum(chord or CHORDS[0][0], True, 1.1, dur=0.9))
    T["bass"].add(t, bass_note((chord and 43) or 36, 1.0), 1.0)


def rep_fill(b0, beats=1, crescendo=True):
    steps = int(beats * 4)
    for i in range(steps):
        bb = b0 + i / 4
        acc = 0.5 + 0.5 * (i / max(1, steps - 1)) if crescendo else 0.9
        T["rep"].add(bb * BEAT, repique(acc))
        T["caixa"].add(bb * BEAT, caixa(acc), 0.6)



# ------------------------------------------------------------------ efeitos novos
def estouro():
    """tampinha saindo: estalo curto + chiado do gás."""
    n = int(SR * 0.9)
    t = np.arange(n) / SR
    clk = bp(rng.normal(0, 1, n), 1200, 6000) * np.exp(-t / 0.006) * 1.6
    pop_ = np.sin(2 * np.pi * (520 * np.exp(-t / 0.05) + 180) * t) * np.exp(-t / 0.04) * 0.9
    fizz = hp(rng.normal(0, 1, n), 3500) * (np.clip(t / 0.03, 0, 1) * np.exp(-t / 0.35)) * 0.5
    return clk + pop_ + fizz


def bola(f=2600, a=1.0):
    """batida de bola de sinuca (clack)."""
    n = int(SR * 0.12)
    t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.52 * t)) * np.exp(-t / 0.012)
    nz = bp(rng.normal(0, 1, n), 2000, 7000) * np.exp(-t / 0.004)
    return (tone * 0.7 + nz * 0.6) * a


def tique(a=1.0):
    n = int(SR * 0.05)
    t = np.arange(n) / SR
    return bp(rng.normal(0, 1, n), 3000, 9000) * np.exp(-t / 0.006) * a


def tecla(a=1.0):
    n = int(SR * 0.04)
    t = np.arange(n) / SR
    return (bp(rng.normal(0, 1, n), 1500, 5000) * np.exp(-t / 0.005) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.008) * 0.3) * a


# ------------------------------------------------------------------ arranjo (no ritmo das cenas)
A = R["audio"]
B = lambda sec: sec / BEAT
q = lambda sec: round(sec / BEAT)          # tempo mais perto (para as viradas caírem no tempo)
b_tit, b_pop, b_busca, b_sin, b_fim = q(A["titulo"]), q(A["pop"]), q(A["busca"]), q(A["sinuca"]), q(A["fim"])
b_end = int(DUR / BEAT)

# abertura: apito de chamada, o logo gira e "CARDÁPIO / NOVO" batem
T["apito"].add(0.02, apito(0.12)); T["apito"].add(0.2, apito(0.12)); T["apito"].add(0.36, apito(0.22, 3100))
T["fx"].add(0.0, whoosh(0.9, True), 0.7)
for k in range(4):
    T["ganza"].add(t16(0, k), ganza(0.5)); T["ganza"].add(t16(1, k), ganza(0.6))
T["fx"].add(0.9, impact(False), 0.6)
hit(B(1.2), True, CHORDS[0][0])
rep_fill(B(1.8), B(A["titulo"]) - B(1.8))
T["fx"].add(A["titulo"] - 1.2, riser(1.2), 0.8)
# garrafa do olho: groove leve (sem caixa), esperando a puxada
hit(b_tit, True)
for b in range(b_tit + 1, b_pop):
    groove(b, caixa_on=False, light=(b < b_pop - 2))
rep_fill(b_pop - 1, 1.0)
# o estouro da tampinha
T["fx"].add(A["pop"] - 0.02, estouro(), 1.4)
hit(b_pop, True)
T["apito"].add(b_pop * BEAT + 0.05, apito(0.12)); T["apito"].add(b_pop * BEAT + 0.22, apito(0.3, 3100))
# cardápio: groove completo com agogô; entradas da turma com whoosh + impacto
for b in range(b_pop + 1, b_busca):
    groove(b, agogo_on=True)
for d in A["donos"]:
    T["fx"].add(d - 0.32, whoosh(0.32, True), 0.75)
    T["fx"].add(d, impact(False), 0.55)
    T["tamb"].add(d, tamborim(1.0)); T["tamb"].add(d + 0.12, tamborim(0.8))
T["fx"].add(A["fala"], whoosh(0.25, False), 0.6)
T["fx"].add(A["ficha"] - 0.2, whoosh(0.3, True), 0.6)
# busca: textura mais leve e o teclado no tamborim
T["fx"].add(A["busca"] - 0.35, whoosh(0.35, True), 0.8)
T["fx"].add(A["busca"], impact(False), 0.5)
for b in range(b_busca, b_sin):
    groove(b, caixa_on=False, light=True)
for i, tt in enumerate(A["teclas"]):
    T["fx"].add(tt, tecla(0.8 + 0.2 * (i % 2)), 0.55)
# sinuca: volta com tudo; VS, tacada, roleta e o prêmio
rep_fill(b_sin - 1, 1.0)
hit(b_sin, True)
for b in range(b_sin + 1, b_fim):
    groove(b, agogo_on=True, light=False)
T["fx"].add(A["vs"] - 0.3, whoosh(0.3, True), 0.8)
T["fx"].add(A["vs"], impact(True), 0.9)
T["apito"].add(A["vs"] + 0.05, apito(0.15))
tc = A["tacada"]
for i, (dt, f, a) in enumerate([(0.0, 2400, 1.0), (0.09, 2900, 0.8), (0.16, 2650, 0.7), (0.23, 3100, 0.6), (0.31, 2500, 0.55), (0.42, 2800, 0.45), (0.55, 2300, 0.35), (0.75, 3000, 0.3)]):
    T["fx"].add(tc + dt, bola(f, a), 1.1)
ro = A["roleta"]
acc = 0.0
for ms in [0, 90, 190, 300, 430, 590, 790, 1040, 1380, 1850, 2400]:
    T["fx"].add(ro + ms / 1000, tique(0.9), 0.7)
T["fx"].add(A["premio"], impact(True), 0.8)
T["tamb"].add(A["premio"], tamborim(1.0)); T["tamb"].add(A["premio"] + 0.15, tamborim(1.0))
# final: virada, apito longo e o acorde
rep_fill(b_fim - 1.5, 1.5)
T["fx"].add(A["fim"] - 1.0, riser(1.0), 0.8)
hit(b_fim, True)
T["apito"].add(b_fim * BEAT + 0.05, apito(0.9, 3000))
for b in range(b_fim + 1, min(b_end - 3, b_fim + 7)):
    groove(b, agogo_on=True)
bf = min(b_end - 3, b_fim + 7)
T["cav"].add(bf * BEAT, strum(CHORDS[0][0], True, 0.9, dur=1.8))
T["tamb"].add((bf - 0.25) * BEAT, tamborim(1.0)); T["tamb"].add(bf * BEAT, tamborim(1.0))
T["surdo"].add(bf * BEAT, surdo(52, 1.6), 1.0)

# ------------------------------------------------------------------ mixagem
GAIN = dict(surdo=0.42, caixa=0.34, tamb=0.38, pand=0.48, ganza=0.38, agogo=0.3, rep=0.42,
            apito=0.45, cav=0.7, vio=1.3, bass=1.0, fx=0.4)
REV_SEND = dict(surdo=0.05, caixa=0.12, tamb=0.2, pand=0.12, ganza=0.08, agogo=0.25, rep=0.12,
                apito=0.25, cav=0.22, vio=0.12, bass=0.0, fx=0.1)

# resposta ao impulso sintética (sala ~1,1 s)
ir_n = int(SR * 1.3)
ir_t = np.arange(ir_n) / SR
ir_l = lp(rng.normal(0, 1, ir_n), 7000) * np.exp(-ir_t / 0.28)
ir_r = lp(rng.normal(0, 1, ir_n), 7000) * np.exp(-ir_t / 0.28)
ir_l[: int(0.012 * SR)] = 0
ir_r[: int(0.017 * SR)] = 0
ir_l /= np.sqrt((ir_l ** 2).sum())
ir_r /= np.sqrt((ir_r ** 2).sum())

L = np.zeros(N); R = np.zeros(N); rev = np.zeros(N)
for k, tr in T.items():
    x = tr.buf * GAIN[k]
    pan = tr.pan
    L += x * np.sqrt((1 - pan) / 2) * 1.41
    R += x * np.sqrt((1 + pan) / 2) * 1.41
    rev += x * REV_SEND[k]
rev = hp(rev, 250)
L += fftconvolve(rev, ir_l)[:N] * 0.7
R += fftconvolve(rev, ir_r)[:N] * 0.7

mix = np.stack([L, R], 1)
mix = hp(mix.T, 38).T
# prateleira de graves: tira ~4 dB abaixo de ~70 Hz
low = lp(mix.T, 70).T
mix = mix - 0.6 * low
# compressor de barramento suave
env = np.abs(mix).max(1)
env = lfilter([1 - np.exp(-1 / (0.01 * SR))], [1, -np.exp(-1 / (0.01 * SR))], env)
env_s = lfilter([1 - np.exp(-1 / (0.12 * SR))], [1, -np.exp(-1 / (0.12 * SR))], env)
thr = np.percentile(env_s, 60)
gain = np.where(env_s > thr, (thr / np.maximum(env_s, 1e-9)) ** 0.45, 1.0)
mix *= gain[:, None]
# limitador limpo com antecipação (5 ms) — sem saturação
mix /= np.abs(mix).max()
look = int(0.005 * SR)
pk = np.abs(mix).max(1)
pk = np.array([pk[max(0, i - look):i + look].max() for i in range(0, len(pk), look)]).repeat(look)[: len(pk)]
thr_l = 0.5
g_l = np.minimum(1.0, thr_l / np.maximum(pk, 1e-9))
rel = np.exp(-1 / (0.08 * SR))
g_s = lfilter([1 - rel], [1, -rel], g_l)
g_s = np.minimum(g_s, g_l)
mix *= g_s[:, None]
mix /= np.abs(mix).max()
mix = mix[: int(SR * DUR)]
fade = int(SR * 0.6)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2


meter = pyln.Meter(SR)
mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -14.0)
pk = np.abs(mix).max()
if pk > 0.95:
    mix *= 0.95 / pk
sf.write(OUT, mix.astype(np.float32), SR, subtype="PCM_24")
print("trilha", OUT, f"{len(mix) / SR:.2f} s")

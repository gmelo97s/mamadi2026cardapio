# Vídeo de apresentação (Reels)

Como o vídeo do cardápio foi feito, para refazer quando o site mudar.

1. `npx vite` na raiz (o atalho do sorteio da sinuca, `window.__sinucaDemo`, só existe no modo de desenvolvimento).
2. Gravar os trechos em câmera lenta (o tempo do site corre K vezes mais devagar; cada quadro guarda o horário):
   `K=18 node gravar.cjs tour tour` · `K=18 node gravar.cjs busca busca` · `K=54 node gravar.cjs sinuca sinuca2`
3. `python3 gera_roteiro.py` — monta o roteiro (cenas, legendas, adesivos, cortes e as deixas da trilha).
4. `python3 trilha.py` — trilha de samba original (a mesma da Roda de Samba, sintetizada, sem direitos autorais), no ritmo das cenas.
5. `node render.cjs --workers 3 --fps 60` — renderiza a cena (muro, celular, plaquinhas, a turma) quadro a quadro.
6. `./encode.sh` — versões principal (60 quadros/s), WhatsApp (30) e sem áudio, mais a capa, em `saida/`.

Precisa de Playwright, ffmpeg e Python com numpy, scipy, soundfile e pyloudnorm.

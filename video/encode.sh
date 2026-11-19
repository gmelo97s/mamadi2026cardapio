#!/usr/bin/env bash
# Junta o vídeo renderizado com a trilha e gera as três versões (principal, WhatsApp, sem áudio) e a capa.
set -euo pipefail
cd "$(dirname "$0")"
OUT=saida
mkdir -p "$OUT"
M=$(ffmpeg -hide_banner -i trilha.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
LN="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
# principal: 1080x1920, 60 quadros/s
# 2 passadas a ~4,3 Mbps: fica abaixo de 30 MB (limite do chat) sem perder nitidez
X264=(-c:v libx264 -preset slow -b:v 4300k -maxrate 8M -bufsize 12M -profile:v high -pix_fmt yuv420p -r 60 -g 120)
ffmpeg -v error -y -i sem_audio.mp4 "${X264[@]}" -pass 1 -passlogfile x264 -an -f mp4 /dev/null
ffmpeg -v error -y -i sem_audio.mp4 -i trilha.wav -map 0:v -map 1:a "${X264[@]}" -pass 2 -passlogfile x264 \
  -af "$LN,aresample=48000" -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart \
  -metadata title="Mamadi · cardápio novo" "$OUT/mamadi-cardapio-apresentacao.mp4"
# WhatsApp: 30 quadros/s, mais leve
ffmpeg -v error -y -i "$OUT/mamadi-cardapio-apresentacao.mp4" -c:v libx264 -preset slow -b:v 2400k -maxrate 3500k -bufsize 6M -r 30 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart "$OUT/mamadi-cardapio-apresentacao-whatsapp.mp4"
# sem áudio (para pôr uma música do Instagram por cima)
ffmpeg -v error -y -i "$OUT/mamadi-cardapio-apresentacao.mp4" -an -c:v copy -movflags +faststart "$OUT/mamadi-cardapio-apresentacao-sem-audio.mp4"
# capa
ffmpeg -v error -y -ss 2.2 -i "$OUT/mamadi-cardapio-apresentacao.mp4" -frames:v 1 -q:v 2 "$OUT/mamadi-cardapio-capa.jpg"
for f in "$OUT"/*.mp4; do echo "$f $(du -h "$f" | cut -f1) $(ffprobe -v error -show_entries format=duration:stream=r_frame_rate -of csv=p=0 "$f" | tr '\n' ' ')"; done

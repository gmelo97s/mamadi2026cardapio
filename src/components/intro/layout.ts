/** Tamanho e posição da tampinha na abertura (iguais no 3D e na imagem estática). */
export function capLayout(w: number, h: number) {
  const short = h < 740;
  const centerY = short ? 0.36 : 0.41;
  const size = short ? Math.min(w * 0.46, h * 0.215, 250) : Math.min(w * 0.56, h * 0.27, 290);
  return { centerY, size };
}

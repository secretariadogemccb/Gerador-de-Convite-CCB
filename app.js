'use strict';

// A prévia e o JPG são produzidos pelo MESMO canvas: 1080 × 1920 pixels.
// O projeto não depende de backend ou biblioteca de captura de tela.

const form = document.querySelector('#form-convite');
const canvas = document.querySelector('#flyer');
const ctx = canvas.getContext('2d', { alpha: false });
const status = document.querySelector('#status');
const fileInput = document.querySelector('#foto');
const fileInfo = document.querySelector('#foto-info');
const exportButton = document.querySelector('#exportar');
const inputs = Object.fromEntries(
  ['titulo', 'congregacao', 'mensagem', 'data', 'dia', 'hora', 'endereco', 'rodape']
    .map(name => [name, document.getElementById(name)])
);

const iconFiles = {
  maos: 'assets/icons/maos.png',
  sistema: 'assets/icons/sistema.png',
  ebi: 'assets/icons/ebi.png',
  autismo: 'assets/icons/autismo.png'
};
const icons = {};
let churchPhoto = null;
let uploadRevision = 0;
let imageCounter = 0;

function notify(message = '') { status.textContent = message; }

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar ${url}`));
    img.src = url;
  });
}

const iconsReady = Promise.all(Object.entries(iconFiles).map(async ([key, url]) => {
  try { icons[key] = await loadImage(url); }
  catch (error) { console.warn(error); }
})).then(() => drawFlyer());

if (document.fonts?.ready) {
  document.fonts.ready.then(() => drawFlyer());
}

function selectedSupports() {
  return Array.from(document.querySelectorAll('input[name="suportes"]:checked'), e => e.value);
}

function formattedDate(dateValue) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null;
  const [year, month, day] = dateValue.split('-').map(Number);
  const d = new Date(year, month - 1, day, 12);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return {
    day: String(day).padStart(2, '0'),
    month: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][month - 1],
    year: String(year),
    weekday: ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'][d.getDay()]
  };
}

function font(weight, size) {
  return `${weight} ${size}px "Roboto Condensed", "Arial Narrow", Arial, sans-serif`;
}

// Quebra palavras grandes e texto normal sem ultrapassar a largura máxima.
function wrapText(text, maxWidth) {
  if (!text.trim()) return [];
  const words = text.trim().split(/\s+/u);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) { lines.push(line); line = ''; }
    // Evita texto cortado quando a pessoa digita uma palavra sem espaços.
    let partial = '';
    for (const character of word) {
      if (partial && ctx.measureText(partial + character).width > maxWidth) {
        lines.push(partial);
        partial = character;
      } else partial += character;
    }
    line = partial;
  }
  if (line) lines.push(line);
  return lines;
}

function layoutText(text, { size, min = 26, maxWidth = 900, maxLines = 4, weight = 800, lh = 1.02 } = {}) {
  const content = (text || '').trim();
  if (!content) return { text: '', lines: [], size, height: 0, lh: size * lh, weight };
  let lines = [];
  for (let fontSize = size; fontSize >= min; fontSize -= 2) {
    ctx.font = font(weight, fontSize);
    lines = wrapText(content, maxWidth);
    if (lines.length <= maxLines) {
      return { text: content, lines, size: fontSize, height: lines.length * fontSize * lh, lh: fontSize * lh, weight };
    }
  }
  ctx.font = font(weight, min);
  lines = wrapText(content, maxWidth);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines.at(-1);
    while (last && ctx.measureText(last + '…').width > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = last.trimEnd() + '…';
  }
  return { text: content, lines, size: min, height: lines.length * min * lh, lh: min * lh, weight };
}

function drawLines(block, centerX, topY, color = '#252525') {
  if (!block.lines.length) return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font(block.weight, block.size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  block.lines.forEach((line, index) => ctx.fillText(line, centerX, topY + index * block.lh));
  ctx.restore();
}

function coverImage(image, x, y, w, h) {
  const rw = image.width / w;
  const rh = image.height / h;
  const ratio = Math.min(rw, rh);
  const sw = w * ratio;
  const sh = h * ratio;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
}

function photoPlaceholder(x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#dedede';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 12]);
  ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#aaa';
  ctx.font = font(700, 38);
  ctx.fillText('ESCOLHA A FOTO DA IGREJA', x + w / 2, y + h / 2);
  ctx.restore();
}

function readValues() {
  const date = formattedDate(inputs.data.value);
  return {
    title: inputs.titulo.value.trim().toLocaleUpperCase('pt-BR'),
    congregation: inputs.congregacao.value.trim().toLocaleUpperCase('pt-BR'),
    message: inputs.mensagem.value.trim().toLocaleUpperCase('pt-BR'),
    date,
    weekday: inputs.dia.value.trim().toLocaleUpperCase('pt-BR'),
    time: inputs.hora.value,
    address: inputs.endereco.value.trim().toLocaleUpperCase('pt-BR'),
    footer: inputs.rodape.value.trim(),
    supports: selectedSupports()
  };
}

function drawFlyer() {
  // 1. Medidas lógicas do desenho em 1080 px de largura.
  const v = readValues();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const title = layoutText(v.title, { size: 128, min: 47, maxWidth: 950, maxLines: 5, weight: 900, lh: 0.97 });
  const congregation = layoutText(v.congregation, { size: 83, min: 41, maxWidth: 935, maxLines: 3, weight: 800, lh: 1.0 });
  const message = layoutText(v.message, { size: 40, min: 27, maxWidth: 885, maxLines: 5, weight: 700, lh: 1.12 });
  const address = layoutText(v.address, { size: 47, min: 31, maxWidth: 925, maxLines: 4, weight: 800, lh: 1.05 });
  const footer = layoutText(v.footer, { size: 33, min: 25, maxWidth: 925, maxLines: 4, weight: 700, lh: 1.10 });

  // 2. Fluxo vertical: uma seção empurra a próxima, sem sobreposição.
  const titleTop = 133;
  const titleBottom = titleTop + Math.max(title.height, 125);
  const photoTop = titleBottom + 20;
  const photoHeight = 603;
  const photoBottom = photoTop + photoHeight;
  const congregationTop = photoBottom + 30;
  const congregationBottom = congregationTop + Math.max(congregation.height, 79);
  const messageTop = congregationBottom + 15;
  const messageBottom = messageTop + Math.max(message.height, 45);
  const dateTop = messageBottom + 106;
  const dateBottom = dateTop + 206;
  const hasSupports = v.supports.length > 0;
  const iconsTop = dateBottom + 65;
  const iconHeight = hasSupports ? 101 : 0;
  const addressTop = dateBottom + (hasSupports ? 65 + iconHeight + 82 : 127);
  const addressBottom = addressTop + Math.max(address.height, 48);
  const footerTop = addressBottom + 29;
  const contentBottom = footerTop + footer.height;

  // 3. Se o título, a mensagem ou o rodapé crescerem muito,
  // todas as dimensões diminuem em conjunto, mantendo a proporção do flyer.
  const scale = Math.min(1, 1815 / Math.max(contentBottom, 1));
  const left = (1080 - 1080 * scale) / 2;
  const top = scale < 1 ? 14 : 0;
  ctx.setTransform(scale, 0, 0, scale, left, top);

  drawLines(title, 540, titleTop);
  if (churchPhoto) coverImage(churchPhoto, 90, photoTop, 900, photoHeight);
  else photoPlaceholder(90, photoTop, 900, photoHeight);
  drawLines(congregation, 540, congregationTop);
  drawLines(message, 540, messageTop);

  // Data (esquerda), dia da semana (meio), horário (direita).
  if (v.date || v.weekday || v.time) {
    ctx.save();
    ctx.strokeStyle = '#303033';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(338, dateTop + 6);
    ctx.lineTo(338, dateTop + 194);
    ctx.moveTo(740, dateTop + 6);
    ctx.lineTo(740, dateTop + 194);
    ctx.stroke();
    ctx.restore();
  }
  if (v.date) {
    const parts = [v.date.day, v.date.month, v.date.year];
    ctx.save();
    ctx.fillStyle = '#292929';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = font(800, 78);
    parts.forEach((part, index) => ctx.fillText(part, 205, dateTop + index * 68 + 2));
    ctx.restore();
  }
  if (v.weekday) {
    const weekday = layoutText(v.weekday, { size: 67, min: 39, maxWidth: 360, maxLines: 2, weight: 700, lh: 1.0 });
    drawLines(weekday, 540, dateTop + 100 - weekday.height / 2);
  }
  if (v.time) {
    ctx.save();
    ctx.fillStyle = '#292929';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = font(800, 89);
    ctx.fillText(v.time, 867, dateTop + 37);
    ctx.font = font(700, 58);
    ctx.fillText('HORAS', 867, dateTop + 118);
    ctx.restore();
  }

  // Os suportes selecionados aparecem centralizados ABAIXO do dia da semana.
  if (hasSupports) {
    const size = 101;
    const gap = 19;
    const total = v.supports.length * size + (v.supports.length - 1) * gap;
    let x = (1080 - total) / 2;
    for (const key of v.supports) {
      const img = icons[key];
      if (img) {
        // Mantém proporção e centraliza cada símbolo em sua célula.
        const ratio = Math.min(size / img.width, size / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.drawImage(img, x + (size - w) / 2, iconsTop + (size - h) / 2, w, h);
      }
      x += size + gap;
    }
  }

  drawLines(address, 540, addressTop);
  // Rodapé imediatamente abaixo do endereço, quando preenchido.
  drawLines(footer, 540, footerTop, '#3d3d3d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function updateWeekday() {
  const date = formattedDate(inputs.data.value);
  inputs.dia.value = date ? date.weekday : '';
  drawFlyer();
}

for (const [key, input] of Object.entries(inputs)) {
  input.addEventListener('input', () => {
    notify();
    if (key === 'data') updateWeekday();
    else drawFlyer();
  });
}
inputs.data.addEventListener('change', updateWeekday);
for (const checkbox of document.querySelectorAll('input[name="suportes"]')) {
  checkbox.addEventListener('change', () => { notify(); drawFlyer(); });
}

fileInput.addEventListener('change', async () => {
  const revision = ++uploadRevision;
  const file = fileInput.files?.[0];
  if (!file) { churchPhoto = null; fileInfo.textContent = ''; drawFlyer(); return; }
  if (!file.type.startsWith('image/')) { notify('Escolha uma imagem JPG, PNG ou WEBP.'); fileInput.value = ''; return; }
  if (file.size > 10 * 1024 * 1024) { notify('A foto deve ter no máximo 10 MB.'); fileInput.value = ''; return; }
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    if (revision !== uploadRevision) return;
    churchPhoto = image;
    imageCounter++;
    fileInfo.textContent = file.name;
    notify();
    drawFlyer();
  } catch {
    if (revision === uploadRevision) notify('Não foi possível abrir a imagem selecionada.');
  } finally { URL.revokeObjectURL(url); }
});

// O upload visual também pode ser acionado pelo teclado.
document.getElementById('botao-upload').addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click(); }
});

document.getElementById('limpar').addEventListener('click', () => {
  uploadRevision++;
  form.reset();
  churchPhoto = null;
  fileInput.value = '';
  fileInfo.textContent = '';
  notify();
  drawFlyer();
});

function makeBlob() {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Erro ao produzir JPG')), 'image/jpeg', 0.95);
  });
}

function downloadBlob(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'convite-ccb.jpg';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

exportButton.addEventListener('click', async () => {
  exportButton.disabled = true;
  try {
    await iconsReady;
    if (document.fonts?.ready) await document.fonts.ready;
    drawFlyer();
    const blob = await makeBlob();
    downloadBlob(blob);
    notify('Convite baixado com sucesso em JPG (1080 × 1920).');
  } catch (error) {
    console.error(error);
    notify('Não foi possível exportar o JPG. Tente novamente.');
  } finally { exportButton.disabled = false; }
});

drawFlyer();

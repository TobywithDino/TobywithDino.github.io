const CANVAS_W = 500;
const HINT_H   = 12;   // pixels of AI image shown at seam
const DRAW_H   = 250;  // user drawing area height

let isEraser = false;
let painting = false;
let lastX = 0, lastY = 0;

// ── Elements ──
const landing    = document.getElementById('landing');
const loading    = document.getElementById('loading');
const studio     = document.getElementById('studio');
const result     = document.getElementById('result');
const btnStart   = document.getElementById('btn-start');
const hintClip   = document.getElementById('hint-clip');
const aiFullImg  = document.getElementById('ai-full');
const seamLine   = document.getElementById('seam-line');
const drawCanvas = document.getElementById('draw-canvas');
const ctx        = drawCanvas.getContext('2d');
const resultCanvas = document.getElementById('result-canvas');
const rctx       = resultCanvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize   = document.getElementById('brush-size');
const btnBrush    = document.getElementById('btn-brush');
const btnEraser   = document.getElementById('btn-eraser');
const btnClear    = document.getElementById('btn-clear');
const btnConfirm  = document.getElementById('btn-confirm');
const btnDownload = document.getElementById('btn-download');
const btnAgain    = document.getElementById('btn-again');

// ── Transitions ──
function show(el) { el.style.display = 'flex'; }
function hide(el) { el.style.display = 'none'; }

// ── Landing → Loading → Studio ──
btnStart.addEventListener('click', () => {
  hide(landing);
  show(loading);

  // Simulate AI generation delay (min 5s)
  setTimeout(() => {
    hide(loading);
    setupStudio();
    show(studio);
  }, 5000);
});

function setupStudio() {
  // Seam line sits right below the hint clip (absolute within frame-wrapper)
  seamLine.style.top = HINT_H + 'px';

  // Set up drawing canvas
  drawCanvas.width  = CANVAS_W;
  drawCanvas.height = DRAW_H;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_W, DRAW_H);

  // Position the full img so its vertical midpoint aligns with
  // the bottom edge of hint-clip — showing the bottom of the top half
  function positionHint() {
    const dispH = (aiFullImg.naturalHeight / aiFullImg.naturalWidth) * CANVAS_W;
    // Shift image up so midpoint sits at the bottom of the clip area
    aiFullImg.style.top = -(dispH / 2 - HINT_H) + 'px';
    requestAnimationFrame(() => {
      hintClip.style.opacity = '1';
      seamLine.style.opacity = '1';
    });
  }

  if (aiFullImg.complete && aiFullImg.naturalWidth > 0) {
    positionHint();
  } else {
    aiFullImg.onload = positionHint;
  }
}

// ── Toolbar ──
btnBrush.addEventListener('click', () => {
  isEraser = false;
  btnBrush.classList.add('active');
  btnEraser.classList.remove('active');
  drawCanvas.style.cursor = 'crosshair';
});

btnEraser.addEventListener('click', () => {
  isEraser = true;
  btnEraser.classList.add('active');
  btnBrush.classList.remove('active');
  drawCanvas.style.cursor = 'cell';
});

btnClear.addEventListener('click', () => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_W, DRAW_H);
});

// ── Drawing ──
function getPos(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width  / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top)  * scaleY
  };
}

function startPaint(e) {
  e.preventDefault();
  painting = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, brushSize.value / 2, 0, Math.PI * 2);
  ctx.fillStyle = isEraser ? '#ffffff' : colorPicker.value;
  ctx.fill();
}

function paint(e) {
  e.preventDefault();
  if (!painting) return;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = isEraser ? '#ffffff' : colorPicker.value;
  ctx.lineWidth   = brushSize.value;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.stroke();
  lastX = pos.x;
  lastY = pos.y;
}

function stopPaint() { painting = false; }

drawCanvas.addEventListener('mousedown',  startPaint);
drawCanvas.addEventListener('mousemove',  paint);
drawCanvas.addEventListener('mouseup',    stopPaint);
drawCanvas.addEventListener('mouseleave', stopPaint);
drawCanvas.addEventListener('touchstart', startPaint, { passive: false });
drawCanvas.addEventListener('touchmove',  paint,      { passive: false });
drawCanvas.addEventListener('touchend',   stopPaint);

// ── Confirm → Result ──
btnConfirm.addEventListener('click', () => {
  buildResult();
  hide(studio);
  show(result);
});

function buildResult() {
  const AI_HALF_H = 250;
  resultCanvas.width  = CANVAS_W;
  resultCanvas.height = AI_HALF_H + DRAW_H;

  const img = new Image();
  img.src = 'default.jpg';
  img.onload = () => {
    rctx.drawImage(
      img,
      0, 0, img.naturalWidth, img.naturalHeight / 2,
      0, 0, CANVAS_W, AI_HALF_H
    );
    rctx.drawImage(drawCanvas, 0, AI_HALF_H);
  };
  if (img.complete) {
    rctx.drawImage(
      img,
      0, 0, img.naturalWidth, img.naturalHeight / 2,
      0, 0, CANVAS_W, AI_HALF_H
    );
    rctx.drawImage(drawCanvas, 0, AI_HALF_H);
  }
}

// ── Download ──
btnDownload.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'exquisite-corpse.png';
  link.href = resultCanvas.toDataURL('image/png');
  link.click();
});

// ── Again ──
btnAgain.addEventListener('click', () => {
  hintClip.style.opacity = '0';
  seamLine.style.opacity = '0';
  hide(result);
  show(landing);
});

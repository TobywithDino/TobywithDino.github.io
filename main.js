// main.js — Floating cats, meow sound, button interactions
// TobywithDino Personal Website

'use strict';

/* ── Config ── */
const CAT_COUNT = 8;        // number of floating cats (6~10)
const CAT_EMOJIS = ['🐱', '🐈', '😸', '😺', '🐾', '😻'];
const FLOAT_ANIMATIONS = [
  'float-up-down',
  'float-left-right',
  'float-diagonal',
  'float-spin-drift',
];

/* ── Web Audio fallback for meow ── */
function playFallbackMeow() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Simple sine wave glide to simulate a "meow" tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (_e) {
    // Audio not supported — silently skip
  }
}

/* ── Meow sound player ── */
let meowAudio = null;
let meowLoaded = false;
let meowFailed = false;

function initMeowAudio() {
  meowAudio = new Audio('assets/meow.mp3');
  meowAudio.preload = 'auto';
  meowAudio.addEventListener('canplaythrough', () => { meowLoaded = true; });
  meowAudio.addEventListener('error', () => { meowFailed = true; });
}

function playMeow() {
  if (!meowFailed && meowLoaded && meowAudio) {
    // Clone to allow rapid successive plays
    const clone = meowAudio.cloneNode();
    clone.volume = 0.7;
    clone.play().catch(() => playFallbackMeow());
  } else {
    playFallbackMeow();
  }
}

/* ── Create a single floating cat element ── */
function createCat() {
  const el = document.createElement('span');
  el.classList.add('floating-cat');

  // Random emoji
  el.textContent = CAT_EMOJIS[Math.floor(Math.random() * CAT_EMOJIS.length)];

  // Random size between 1.5rem and 2.5rem
  const size = (1.5 + Math.random() * 1.0).toFixed(2);
  el.style.fontSize = `${size}rem`;

  // Random opacity between 0.25 and 0.45
  el.style.opacity = (0.25 + Math.random() * 0.20).toFixed(2);

  // Random starting position
  el.style.left = `${Math.random() * 95}vw`;
  el.style.top = `${Math.random() * 90}vh`;

  // Random animation
  const anim = FLOAT_ANIMATIONS[Math.floor(Math.random() * FLOAT_ANIMATIONS.length)];
  const duration = (8 + Math.random() * 10).toFixed(1); // 8s ~ 18s
  const delay = (Math.random() * 5).toFixed(1);
  el.style.animation = `${anim} ${duration}s ${delay}s ease-in-out infinite`;

  // Click → meow + bounce
  el.addEventListener('click', () => {
    playMeow();
    el.classList.add('bounce');
    setTimeout(() => el.classList.remove('bounce'), 320);
  });

  return el;
}

/* ── Spawn all cats ── */
function spawnCats() {
  const container = document.getElementById('cats-container');
  if (!container) return;
  for (let i = 0; i < CAT_COUNT; i++) {
    container.appendChild(createCat());
  }
}

/* ── Handle broken avatar image ── */
function initAvatar() {
  const img = document.getElementById('avatar-img');
  if (!img) return;
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initMeowAudio();
  spawnCats();
  initAvatar();
});

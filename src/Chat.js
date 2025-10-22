(function(){
  const scriptEl = document.currentScript;
  const CSS_ID = 'p4h-wave-chat-styles';
  const CSS_TEXT = String.raw`
/* ===== P4H Live Chat Widget (responsive + drag + swipe, fixed close over handle) ===== */
:root{
  --vh: 1vh;
  --p4h-peek-height: calc(68px + 14px + env(safe-area-inset-bottom, 0)); /* JS sets real vh for iOS */
  --p4h-primary-color: #143382;
  --p4h-primary-color-rgb: 20, 51, 130;
  --p4h-secondary-color: #f1b800;
  --p4h-secondary-color-rgb: 241, 184, 0;
  --p4h-primary-contrast-color: #ffffff;
  --p4h-secondary-contrast-color: #0e2541;
  --p4h-text-primary-color: #0e2541;
  --p4h-text-secondary-color: #2c5cc5;
}

.p4h-chat-launcher{
  position:fixed;
  left:20px;
  bottom:20px;
  z-index:2147483647;
  width:64px;
  height:64px;
  border-radius:50%;
  background:var(--p4h-primary-color, #143382);
  color:var(--p4h-primary-contrast-color, #fff);
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 8px 24px rgba(var(--p4h-primary-color-rgb, 20, 51, 130), 0.32);
  cursor:pointer;
  user-select:none;
  font:600 16px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
  -webkit-tap-highlight-color: transparent;
  transition:transform 0.2s ease, box-shadow 0.2s ease, background-color 0.25s ease;
}
.p4h-chat-launcher[data-align="right"]{
  left:auto;
  right:20px;
}
.p4h-chat-launcher:hover,
.p4h-chat-launcher:focus-visible{
  transform:translateY(-3px);
  box-shadow:0 12px 32px rgba(var(--p4h-primary-color-rgb, 20, 51, 130), 0.4);
}
.p4h-chat-launcher:focus-visible{
  outline:3px solid rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.8);
  outline-offset:4px;
}
.p4h-chat-launcher[data-hidden="true"]{ display:none; }
.p4h-chat-badge{
  position:absolute;
  top:-6px;
  right:-6px;
  background:var(--p4h-secondary-color, #f1b800);
  color:var(--p4h-secondary-contrast-color, #0e2541);
  border-radius:999px;
  padding:3px 7px;
  font-size:12px;
}
.p4h-chat-badge:empty{
  display:none;
}

/* Desktop/tablet default panel */
.p4h-chat-panel{
  position:fixed;
  left:20px;
  z-index:2147483646;
  --p4h-bottom-offset: 90px;
  bottom:var(--p4h-bottom-offset);
  width:380px;
  height:min(80vh, 760px);
  max-width:calc(100vw - 32px);
  max-height:calc(100vh - 120px);
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 16px 40px rgba(0,0,0,.35);
  display:none;
  background:#fff;
  --p4h-shift: 0px;
  --p4h-swipe-x: 0px;
  transform:translateY(6px);
  opacity:0;
}
.p4h-chat-panel[data-align="right"]{
  left:auto;
  right:20px;
}
.p4h-chat-body{
  position:relative;
  height:100%;
  display:flex;
  flex-direction:column;
  background:#fff;
}
.p4h-chat-iframe{
  flex:1;
  width:100%;
  height:100%;
  border:0;
  display:block;
  overflow:hidden;
}
.p4h-chat-fallback{
  position:absolute;
  inset:0;
  display:none;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  gap:16px;
  padding:32px;
  color:var(--p4h-text-primary-color, #0e2541);
  background:linear-gradient(180deg, rgba(255,255,255,0.97), rgba(236,241,252,0.97));
  background:linear-gradient(
    180deg,
    color-mix(in srgb, var(--p4h-primary-color, #143382) 6%, #ffffff) 0%,
    color-mix(in srgb, var(--p4h-primary-color, #143382) 18%, #ffffff) 100%
  );
  border-top:1px solid rgba(var(--p4h-primary-color-rgb, 20, 51, 130), 0.12);
}
.p4h-chat-fallback:not([hidden]){
  display:flex;
}
.p4h-chat-fallback__title{
  margin:0;
  font:600 18px/1.4 "Segoe UI", system-ui, -apple-system, sans-serif;
}
.p4h-chat-fallback__body{
  margin:0;
  font:400 15px/1.6 "Segoe UI", system-ui, -apple-system, sans-serif;
}
.p4h-chat-fallback__list{
  list-style:none;
  padding:0;
  margin:0;
  display:flex;
  flex-direction:column;
  gap:8px;
  width:100%;
}
.p4h-chat-fallback__item{
  font:600 15px/1.4 "Segoe UI", system-ui, -apple-system, sans-serif;
  color:var(--p4h-text-primary-color, #0e2541);
}
.p4h-chat-fallback__link{
  color:var(--p4h-text-secondary-color, #2c5cc5);
  text-decoration:underline;
  font-weight:600;
}
.p4h-chat-fallback__link:hover{
  text-decoration:none;
}

.p4h-peek-hint{
  display:none;
  position:absolute;
  top:0;
  left:0;
  right:0;
  padding:10px 16px;
  background:rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.92);
  color:var(--p4h-secondary-contrast-color, #0e2541);
  box-shadow:0 8px 20px rgba(0, 0, 0, 0.18);
  border-bottom:1px solid rgba(0,0,0,0.08);
  border-radius:0 0 12px 12px;
  text-shadow:0 1px 2px rgba(0,0,0,0.25);
  letter-spacing:0.015em;
  font:600 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial;
  text-align:left;
  pointer-events:none;
  z-index:3;
  transition:opacity 0.18s ease;
}
.p4h-peek-hint[data-align="right"]{
  text-align:right;
}

.p4h-chat-panel[data-open="true"]{
  opacity:1;
  transform:none;
}
.p4h-chat-panel[data-open="true"][data-swiping="true"]{
  transform:translate3d(var(--p4h-swipe-x, 0px), var(--p4h-shift, 0px), 0);
}
.p4h-chat-panel[data-peek="true"]{
  opacity:1;
  transform:translateY(calc(100% + var(--p4h-bottom-offset) - var(--p4h-peek-height)));
}
.p4h-chat-panel[data-align="right"][data-peek="true"]{
  left:auto;
  right:20px;
}
.p4h-chat-panel[data-peek="true"][data-swiping="true"]{
  transform:translate3d(var(--p4h-swipe-x, 0px), calc(100% + var(--p4h-bottom-offset) - var(--p4h-peek-height) + var(--p4h-shift, 0px)), 0);
}
.p4h-chat-panel[data-peek="true"] .p4h-peek-hint{
  display:flex;
  align-items:center;
  justify-content:flex-start;
  gap:6px;
}
.p4h-chat-panel[data-peek="true"] .p4h-peek-hint[data-align="right"]{
  justify-content:flex-end;
}
.p4h-chat-panel[data-peek="true"] .p4h-chat-iframe{
  pointer-events:none;
  opacity:0;
  transition:opacity 0.18s ease;
}
.p4h-chat-panel[data-reveal="true"] .p4h-peek-hint{
  opacity:0;
}
.p4h-chat-panel[data-peek="true"][data-reveal="true"] .p4h-chat-iframe{
  pointer-events:auto;
  opacity:1;
}
.p4h-chat-panel[data-peek="true"][data-reveal="true"]{
  background:#fff;
  color:var(--p4h-text-primary-color, #0e2541);
}
.p4h-chat-panel[data-closing]{
  pointer-events:none;
}

/* Overlay controls ABOVE the handle */
.p4h-chat-controls{
  position:absolute;
  top:10px;
  right:10px;
  z-index:4;  /* higher than handle */
  color:var(--p4h-primary-contrast-color, #fff);
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:6px;
  padding:0;
  pointer-events:auto;
}
.p4h-chat-controls[data-align="left"]{
  left:10px;
  right:auto;
  justify-content:flex-start;
}
.p4h-chat-btn{
  appearance:none;
  border:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:36px;
  height:36px;
  padding:0 12px;
  background:rgba(10, 16, 28, 0.42);
  color:var(--p4h-primary-contrast-color, #fff);
  cursor:pointer;
  font-size:19px;
  font-weight:600;
  line-height:1;
  border-radius:12px;
  border:1px solid rgba(255,255,255,0.28);
  box-shadow:0 4px 12px rgba(0,0,0,0.16);
  backdrop-filter:blur(6px);
  transition:background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}
.p4h-chat-btn:hover{
  background:rgba(10, 16, 28, 0.6);
  border-color:rgba(255,255,255,0.4);
  box-shadow:0 6px 16px rgba(0,0,0,0.22);
}
.p4h-chat-btn:focus-visible{
  outline:2px solid rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.85);
  outline-offset:3px;
  background:rgba(10, 16, 28, 0.66);
  border-color:rgba(255,255,255,0.45);
}
.p4h-chat-btn:active{
  transform:translateY(1px) scale(0.97);
  box-shadow:0 2px 8px rgba(0,0,0,0.2);
  background:rgba(5, 10, 20, 0.66);
}
.p4h-chat-btn + .p4h-chat-btn{ margin-left:4px; }

.p4h-chat-panel[data-peek="true"] .p4h-chat-controls{
  top:50%;
  transform:translateY(-50%);
}
.p4h-chat-panel[data-peek="true"] .p4h-chat-controls[data-align="left"]{
  left:10px;
  right:auto;
}
.p4h-chat-panel[data-peek="true"][data-reveal="true"] .p4h-chat-controls{
  top:calc(10px + env(safe-area-inset-top,0));
  transform:none;
}
.p4h-chat-panel[data-peek="true"][data-reveal="true"] .p4h-chat-controls[data-align="left"]{
  left:10px;
  right:auto;
}

/* Drag handle BELOW controls so close is clickable */
.p4h-drag-handle{
  position:absolute;
  top:0;
  left:0;
  right:0;
  height:clamp(48px, 16%, 120px);
  cursor:grab;
  user-select:none;
  touch-action:none;
  z-index:2;
  background:linear-gradient(
    to bottom,
    rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.32),
    rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0)
  ); /* subtle hint */
}

/* ===== Tablets (<=1024px) ===== */
@media (max-width: 1024px){
  .p4h-chat-panel{
    left:16px;
    --p4h-bottom-offset: 84px;
    bottom:var(--p4h-bottom-offset);
    width:min(560px, 92vw);
    height:min(78vh, 780px);
  }
  .p4h-chat-panel[data-align="right"]{
    left:auto;
    right:16px;
  }
  .p4h-chat-launcher{ left:16px; bottom:16px; }
  .p4h-chat-launcher[data-align="right"]{ left:auto; right:16px; }
}

/* ===== Phones (<=600px): TRUE fullscreen sheet + swipe-down ===== */
@media (max-width: 600px){
  .p4h-chat-panel{
    left:0;
    right:0;
    margin:0 auto;
    --p4h-bottom-offset: calc(78px + env(safe-area-inset-bottom, 0));
    bottom:var(--p4h-bottom-offset);
    width:calc(100vw - 32px);
    max-width:420px;
    height:85vh;                            /* fallback */
    height:calc(var(--vh) * 85);            /* iOS JS-computed */
    height:85dvh;                           /* modern browsers */
    max-height:calc(100vh - var(--p4h-bottom-offset) - 12px);
    max-height:calc(100dvh - var(--p4h-bottom-offset) - 12px);
    border-radius:18px;
    box-shadow:0 12px 32px rgba(0,0,0,.28);
    padding-bottom:env(safe-area-inset-bottom,0);
  }
  .p4h-chat-panel[data-peek="true"] .p4h-chat-iframe{
    pointer-events:none;
  }
  .p4h-chat-panel[data-peek="true"]{
    position:fixed;
    left:0;
    right:0;
    margin:0 auto;
    bottom:calc(env(safe-area-inset-bottom, 0) + 14px);
    width:calc(100vw - 24px);
    max-width:420px;
    height:68px;
    max-height:68px;
    transform:none;
    background:var(--p4h-primary-color, #143382);
    color:var(--p4h-primary-contrast-color, #fff);
    border-radius:18px;
    box-shadow:0 10px 24px rgba(0,0,0,0.28);
  }
  .p4h-chat-panel[data-peek="true"][data-reveal="true"]{
    height:calc(var(--vh) * 85);
    max-height:calc(100vh - var(--p4h-bottom-offset) - 12px);
    max-height:calc(100dvh - var(--p4h-bottom-offset) - 12px);
    background:#fff;
    color:var(--p4h-text-primary-color, #0e2541);
    box-shadow:0 16px 40px rgba(0,0,0,0.35);
  }
  .p4h-chat-panel[data-peek="true"][data-reveal="true"] .p4h-drag-handle{
    height:clamp(48px, 16%, 120px);
    background:linear-gradient(
      to bottom,
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.32),
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0)
    );
  }
  .p4h-chat-panel[data-peek="true"] .p4h-peek-hint{
    display:flex;
    align-items:center;
    justify-content:flex-start;
    height:100%;
    padding:0 18px;
    background:rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.9);
    background:linear-gradient(
      90deg,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 82%, #000 18%) 0%,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 88%, #000 12%) 100%
    );
    color:var(--p4h-secondary-contrast-color, #0e2541);
  }
  .p4h-chat-panel[data-peek="true"] .p4h-peek-hint[data-align="right"]{
    justify-content:flex-end;
  }
  .p4h-chat-panel[data-peek="true"] .p4h-chat-iframe{
    display:none;
  }
  .p4h-chat-panel[data-peek="true"][data-reveal="true"] .p4h-chat-iframe{
    display:block;
  }
  .p4h-chat-panel[data-peek="true"][data-reveal="true"] .p4h-peek-hint{
    opacity:0;
  }
  .p4h-drag-handle{ height:clamp(56px, 18%, 140px); }
  .p4h-chat-panel[data-peek="true"] .p4h-drag-handle{
    pointer-events:auto;
    background:linear-gradient(
      180deg,
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.9) 0%,
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.75) 100%
    );
    background:linear-gradient(
      180deg,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 68%, #000 32%) 0%,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 46%, #000 54%) 100%
    );
    height:100%;
  }
  .p4h-chat-controls{
    top:calc(10px + env(safe-area-inset-top,0));
    right:10px;
  }
  .p4h-chat-controls[data-align="left"]{
    left:10px;
    right:auto;
    justify-content:flex-start;
  }
  .p4h-chat-btn{
    font-size:22px;
    padding:10px 12px;
  }
  .p4h-chat-launcher{
    left:14px;
    bottom:calc(14px + env(safe-area-inset-bottom,0));
    width:68px;
    height:68px;
    font-size:18px;
  }
  .p4h-chat-launcher[data-align="right"]{
    left:auto;
    right:14px;
  }

  .p4h-chat-panel[data-peek="true"] .p4h-drag-handle::after{
    content:'';
    position:absolute;
    left:50%;
    top:16px;
    width:42px;
    height:5px;
    border-radius:999px;
    background:rgba(0,0,0,0.18);
    transform:translateX(-50%);
    transition:opacity 0.18s ease;
    opacity:0.55;
  }
  .p4h-chat-panel[data-peek="true"][data-nudge="true"] .p4h-drag-handle::after{
    opacity:0.92;
  }
}

@media (max-width: 600px) and (prefers-reduced-motion: no-preference){
  .p4h-chat-panel[data-peek="true"][data-nudge="true"]{
    animation:p4h-peek-nudge 0.95s ease-out 0.24s 2;
  }
}

@media (min-width: 601px) and (max-width: 1024px){
  .p4h-chat-panel[data-peek="true"]{
    position:fixed;
    left:16px;
    right:auto;
    bottom:calc(env(safe-area-inset-bottom, 0) + 12px);
    height:68px;
    max-height:68px;
    width:min(560px, 92vw);
    transform:none;
    background:var(--p4h-primary-color, #143382);
    color:var(--p4h-primary-contrast-color, #fff);
    border-radius:18px;
    box-shadow:0 14px 30px rgba(0,0,0,0.24);
  }
  .p4h-chat-panel[data-align="right"][data-peek="true"]{
    left:auto;
    right:16px;
  }
  .p4h-chat-panel[data-peek="true"] .p4h-chat-iframe{
    display:none;
  }
  .p4h-chat-panel[data-peek="true"] .p4h-peek-hint{
    display:flex;
    align-items:center;
    justify-content:flex-start;
    height:100%;
    padding:0 20px;
    background:rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.9);
    background:linear-gradient(
      90deg,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 80%, #000 20%) 0%,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 86%, #000 14%) 100%
    );
    color:var(--p4h-secondary-contrast-color, #0e2541);
  }
  .p4h-chat-panel[data-peek="true"] .p4h-peek-hint[data-align="right"]{
    justify-content:flex-end;
  }
  .p4h-chat-panel[data-peek="true"] .p4h-drag-handle{
    height:100%;
    background:linear-gradient(
      180deg,
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.88) 0%,
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.7) 100%
    );
    background:linear-gradient(
      180deg,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 62%, #000 38%) 0%,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 40%, #000 60%) 100%
    );
  }
}

@media (min-width: 1025px){
  .p4h-chat-panel[data-peek="true"]{
    height:64px;
    max-height:64px;
    transform:none;
    background:var(--p4h-primary-color, #143382);
    color:var(--p4h-primary-contrast-color, #fff);
  }
  .p4h-chat-panel[data-peek="true"] .p4h-chat-iframe{
    display:none;
  }
  .p4h-chat-panel[data-peek="true"] .p4h-peek-hint{
    display:flex;
    align-items:center;
    justify-content:flex-start;
    height:100%;
    padding:0 16px;
    background:rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.88);
    background:linear-gradient(
      90deg,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 78%, #000 22%) 0%,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 84%, #000 16%) 100%
    );
    color:var(--p4h-secondary-contrast-color, #0e2541);
  }
  .p4h-chat-panel[data-peek="true"] .p4h-drag-handle{
    height:100%;
    background:linear-gradient(
      180deg,
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.84) 0%,
      rgba(var(--p4h-secondary-color-rgb, 241, 184, 0), 0.66) 100%
    );
    background:linear-gradient(
      180deg,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 58%, #000 42%) 0%,
      color-mix(in srgb, rgb(var(--p4h-secondary-color-rgb, 241, 184, 0)) 36%, #000 64%) 100%
    );
  }
}

/* Landscape phones & narrow landscape windows */
@media (max-width: 1024px) and (orientation: landscape){
  .p4h-chat-panel{
    left:12px;
    right:auto;
    top:calc(env(safe-area-inset-top, 0) + 12px);
    --p4h-bottom-offset: calc(12px + env(safe-area-inset-bottom, 0));
    bottom:var(--p4h-bottom-offset);
    width:min(560px, calc(100vw - 24px));
    max-width:100%;
    height:auto;
    max-height:none;
    border-radius:16px;
  }
  .p4h-chat-panel[data-peek="true"]{
    left:12px;
    right:auto;
    width:min(560px, calc(100vw - 24px));
    top:auto;
    bottom:calc(env(safe-area-inset-bottom, 0) + 6px);
  }
  .p4h-chat-launcher{
    left:12px;
    bottom:calc(12px + env(safe-area-inset-bottom,0));
  }
}

@keyframes p4h-peek-nudge{
  0%, 100%{
    transform:translateY(0);
  }
  45%{
    transform:translateY(-16px);
  }
  60%{
    transform:translateY(-16px);
  }
}

/* Motion polish */
@media (prefers-reduced-motion: no-preference){
  .p4h-chat-panel{
    transition:opacity .18s ease, transform .18s ease;
  }
}
`;

  function readScriptAttr(name){
    if(!scriptEl) return null;
    const raw = scriptEl.getAttribute(name);
    if(raw == null) return null;
    const trimmed = raw.trim();
    if(!trimmed || trimmed.toLowerCase() === 'null') return null;
    return trimmed;
  }

  function normalizeColor(value, fallback){
    const option = document.createElement('option');
    option.style.color = '';
    option.style.color = fallback;
    const fallbackColor = option.style.color || fallback;
    if(value){
      option.style.color = '';
      option.style.color = value;
      if(option.style.color){
        return option.style.color;
      }
    }
    return fallbackColor;
  }

  function colorToRgbComponents(color, fallback){
    if(!color){
      return fallback;
    }
    const normalized = color.trim().toLowerCase();
    const rgbMatch = normalized.match(/rgba?\(([^)]+)\)/);
    if(rgbMatch){
      const parts = rgbMatch[1].split(',').slice(0, 3).map((part)=>{
        const num = parseFloat(part.trim());
        return Number.isFinite(num) ? Math.round(num) : 0;
      });
      if(parts.length === 3 && parts.every((num)=>Number.isFinite(num))){
        return parts.join(', ');
      }
    }
    if(normalized.startsWith('#')){
      let hex = normalized.slice(1);
      if(hex.length === 3){
        hex = hex.split('').map((ch)=>ch + ch).join('');
      }
      if(hex.length === 6){
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        if([r, g, b].every((num)=>Number.isFinite(num))){
          return `${r}, ${g}, ${b}`;
        }
      }
    }
    return fallback;
  }

  function pickContrastColor(rgbString, lightColor, darkColor){
    if(!rgbString){
      return lightColor;
    }
    const parts = rgbString.split(',').map((part)=>parseInt(part.trim(), 10));
    if(parts.length !== 3 || parts.some((num)=>!Number.isFinite(num))){
      return lightColor;
    }
    const [r, g, b] = parts;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.6 ? darkColor : lightColor;
  }

  const chatUrlFromAttr = readScriptAttr('data-chat-url');
  const CHAT_URL = chatUrlFromAttr ? chatUrlFromAttr : null;
  const hasChatUrl = !!CHAT_URL;
  const CONTACT_PHONE = readScriptAttr('data-contact-phone');
  const CONTACT_EMAIL = readScriptAttr('data-contact-email');
  const primaryColorAttr = readScriptAttr('data-primary-color');
  const secondaryColorAttr = readScriptAttr('data-secondary-color');
  const textPrimaryAttr = readScriptAttr('data-text-primary-color');
  const textSecondaryAttr = readScriptAttr('data-text-secondary-color');
  const buttonOpenTextAttr = readScriptAttr('data-button-open-text');
  const buttonOpenAlignAttr = readScriptAttr('data-button-open-align');
  const buttonControlsAlignAttr = readScriptAttr('data-button-controls-align');
  const legacyPillTextAttr = readScriptAttr('data-pill-text');
  const DEFAULT_PRIMARY = '#143382';
  const DEFAULT_SECONDARY = '#f1b800';
  const DEFAULT_PRIMARY_RGB = '20, 51, 130';
  const DEFAULT_SECONDARY_RGB = '241, 184, 0';
  const DEFAULT_TEXT_PRIMARY = '#0e2541';
  const DEFAULT_TEXT_SECONDARY = '#2c5cc5';
  const PRIMARY_COLOR = normalizeColor(primaryColorAttr, DEFAULT_PRIMARY);
  const SECONDARY_COLOR = normalizeColor(secondaryColorAttr, DEFAULT_SECONDARY);
  const PRIMARY_COLOR_RGB = colorToRgbComponents(PRIMARY_COLOR, DEFAULT_PRIMARY_RGB);
  const SECONDARY_COLOR_RGB = colorToRgbComponents(SECONDARY_COLOR, DEFAULT_SECONDARY_RGB);
  const PRIMARY_CONTRAST_COLOR = pickContrastColor(PRIMARY_COLOR_RGB, '#ffffff', '#0e1c40');
  const SECONDARY_CONTRAST_COLOR = pickContrastColor(SECONDARY_COLOR_RGB, '#ffffff', '#0e2541');
  const TEXT_PRIMARY_COLOR = normalizeColor(textPrimaryAttr, DEFAULT_TEXT_PRIMARY);
  const TEXT_SECONDARY_COLOR = normalizeColor(textSecondaryAttr, DEFAULT_TEXT_SECONDARY);
  const BUTTON_OPEN_TEXT = buttonOpenTextAttr || legacyPillTextAttr || null;
  const BUTTON_OPEN_ALIGN = (() => {
    if(!buttonOpenAlignAttr) return 'left';
    const value = buttonOpenAlignAttr.trim().toLowerCase();
    return value === 'right' ? 'right' : 'left';
  })();
  const BUTTON_CONTROLS_ALIGN = (() => {
    if(!buttonControlsAlignAttr) return 'right';
    const value = buttonControlsAlignAttr.trim().toLowerCase();
    return value === 'left' ? 'left' : 'right';
  })();

  function buildTelHref(phone){
    if(!phone) return null;
    const trimmed = phone.trim();
    let normalized = '';
    let hasPlus = false;
    for(const ch of trimmed){
      if(ch === '+' && !hasPlus){
        normalized += '+';
        hasPlus = true;
      } else if(ch >= '0' && ch <= '9'){
        normalized += ch;
      }
    }
    if(!normalized){
      return `tel:${encodeURIComponent(trimmed)}`;
    }
    return `tel:${normalized}`;
  }

  function buildFallbackContent(container){
    if(!container) return;
    container.textContent = '';
    container.setAttribute('role', 'alert');

    const title = document.createElement('p');
    title.className = 'p4h-chat-fallback__title';
    title.textContent = 'Sorry, we can’t open chat right now.';
    container.appendChild(title);

    const body = document.createElement('p');
    body.className = 'p4h-chat-fallback__body';
    if(CONTACT_PHONE || CONTACT_EMAIL){
      body.textContent = 'You can still reach our team using one of the options below:';
    } else {
      body.textContent = 'Please try again in a few moments or reach out through your usual channels.';
    }
    container.appendChild(body);

    if(CONTACT_PHONE || CONTACT_EMAIL){
      const list = document.createElement('ul');
      list.className = 'p4h-chat-fallback__list';

      if(CONTACT_PHONE){
        const item = document.createElement('li');
        item.className = 'p4h-chat-fallback__item';
        item.textContent = 'Call us at ';
        const link = document.createElement('a');
        link.className = 'p4h-chat-fallback__link';
        link.href = buildTelHref(CONTACT_PHONE);
        link.textContent = CONTACT_PHONE;
        item.appendChild(link);
        list.appendChild(item);
      }

      if(CONTACT_EMAIL){
        const item = document.createElement('li');
        item.className = 'p4h-chat-fallback__item';
        item.textContent = 'Email us at ';
        const link = document.createElement('a');
        link.className = 'p4h-chat-fallback__link';
        link.href = `mailto:${CONTACT_EMAIL}`;
        link.textContent = CONTACT_EMAIL;
        item.appendChild(link);
        list.appendChild(item);
      }

      container.appendChild(list);
    }
  }

  function showFallback(container, frame){
    if(!container || !frame) return;
    buildFallbackContent(container);
    container.hidden = false;
    container.removeAttribute('hidden');
    frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
  }

  function hideFallback(container, frame){
    if(!container || !frame) return;
    container.hidden = true;
    if(!container.hasAttribute('hidden')){
      container.setAttribute('hidden', '');
    }
    frame.hidden = false;
    frame.removeAttribute('aria-hidden');
  }

  function applyThemeColors(){
    const target = document.documentElement;
    if(!target) return;
    target.style.setProperty('--p4h-primary-color', PRIMARY_COLOR);
    target.style.setProperty('--p4h-primary-color-rgb', PRIMARY_COLOR_RGB);
    target.style.setProperty('--p4h-secondary-color', SECONDARY_COLOR);
    target.style.setProperty('--p4h-secondary-color-rgb', SECONDARY_COLOR_RGB);
    target.style.setProperty('--p4h-primary-contrast-color', PRIMARY_CONTRAST_COLOR);
    target.style.setProperty('--p4h-secondary-contrast-color', SECONDARY_CONTRAST_COLOR);
    target.style.setProperty('--p4h-text-primary-color', TEXT_PRIMARY_COLOR);
    target.style.setProperty('--p4h-text-secondary-color', TEXT_SECONDARY_COLOR);
  }

  const MARKUP = `
<div id="p4hChatLauncher" class="p4h-chat-launcher" aria-label="Open live chat" title="Chat with us">
  💬
  <span id="p4hChatBadge" class="p4h-chat-badge" aria-hidden="true"></span>
</div>

<div id="p4hChatPanel" class="p4h-chat-panel" role="dialog" aria-modal="true" aria-label="Live chat">
  <div class="p4h-drag-handle" aria-hidden="true"></div>
  <div class="p4h-peek-hint" aria-hidden="true">Swipe up to show chat</div>
  <div class="p4h-chat-controls" role="toolbar" aria-label="Chat controls">
    <button id="p4hChatMinimize" class="p4h-chat-btn" title="Minimize" aria-label="Minimize">–</button>
    <button id="p4hChatClose" class="p4h-chat-btn" title="Close" aria-label="Close">×</button>
  </div>
  <div class="p4h-chat-body">
    <iframe
      id="p4hChatFrame"
      class="p4h-chat-iframe"
      title="Live chat"
      loading="lazy"
      scrolling="no"
      referrerpolicy="no-referrer-when-downgrade"
      allow="clipboard-read; clipboard-write">
    </iframe>
    <div id="p4hChatFallback" class="p4h-chat-fallback" hidden></div>
  </div>
</div>
`;

  let initialized = false;

  function ensureStyles(){
    if(document.getElementById(CSS_ID)) return;
    const style = document.createElement('style');
    style.id = CSS_ID;
    style.textContent = CSS_TEXT;
    document.head.appendChild(style);
  }

  function injectMarkup(){
    if(document.getElementById('p4hChatLauncher')) return;
    const template = document.createElement('template');
    template.innerHTML = MARKUP.trim();
    document.body.appendChild(template.content.cloneNode(true));
  }

  function init(){
    if(initialized) return;
    applyThemeColors();
    ensureStyles();
    injectMarkup();

    const $launcher = document.getElementById('p4hChatLauncher');
    const $panel    = document.getElementById('p4hChatPanel');
    const $frame    = document.getElementById('p4hChatFrame');
    if(!$launcher || !$panel || !$frame) return;

    initialized = true;

    const $peekHint = $panel.querySelector('.p4h-peek-hint');
    const $close    = document.getElementById('p4hChatClose');
    const $minimize = document.getElementById('p4hChatMinimize');
    const $handle   = $panel.querySelector('.p4h-drag-handle');
    const $controls = $panel.querySelector('.p4h-chat-controls');
    const $fallback = document.getElementById('p4hChatFallback');
    const $badge    = document.getElementById('p4hChatBadge');

    if($launcher){
      $launcher.dataset.align = BUTTON_OPEN_ALIGN;
    }
    if($panel){
      $panel.dataset.align = BUTTON_OPEN_ALIGN;
    }
    if($controls){
      $controls.dataset.align = BUTTON_CONTROLS_ALIGN;
    }
    if($peekHint){
      $peekHint.dataset.align = BUTTON_CONTROLS_ALIGN === 'left' ? 'right' : 'left';
    }

    let chatDisabled = !hasChatUrl;
    let loaded = false;
    let loadSucceeded = false;
    let endpointState = hasChatUrl ? 'pending' : 'fail'; // 'pending' | 'ok' | 'unknown' | 'fail'
    let peekPromptTimer = null;
    let peekPromptClearTimer = null;
    const PEEK_THRESHOLD = 120;
    const OPEN_THRESHOLD = 64;
    const CLOSE_PEEK_THRESHOLD = 28;
    const HORIZONTAL_CLOSE_THRESHOLD = 120;
    const SWIPE_MODE_LOCK_DISTANCE = 12;

    function setVh(){
      document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
    }
    setVh();
    window.addEventListener('resize', ()=>{
      setVh();
      clampPanelToViewport();
    });

    function ensureLoaded(){
      if(chatDisabled || loaded) return;
      $frame.src = CHAT_URL;
      loaded = true;
    }

    const isPeek = () => $panel.getAttribute('data-peek') === 'true';
    const hideLauncher = () => { if($launcher) $launcher.dataset.hidden = 'true'; };
    const showLauncher = () => { if($launcher) delete $launcher.dataset.hidden; };
    const isPhone = ()=>{
      const narrowViewport = window.matchMedia('(max-width: 600px)').matches;
      const coarseLandscape = window.matchMedia('(pointer: coarse) and (max-height: 520px)').matches;
      return narrowViewport || coarseLandscape;
    };

    function updatePeekHint(peek){
      if(!$peekHint) return;
      if(chatDisabled){
        $peekHint.textContent = 'Chat unavailable';
        return;
      }
      if(peek){
        $peekHint.textContent = isPhone()
          ? 'Tap + or swipe up to reopen chat'
          : 'Chat minimized — click + to reopen';
      } else {
        $peekHint.textContent = 'Swipe up to show chat';
      }
    }

    function stopPeekPrompt(){
      if(peekPromptTimer){
        clearTimeout(peekPromptTimer);
        peekPromptTimer = null;
      }
      if(peekPromptClearTimer){
        clearTimeout(peekPromptClearTimer);
        peekPromptClearTimer = null;
      }
      if($panel){
        $panel.removeAttribute('data-nudge');
      }
    }

    function queuePeekPrompt(){
      if(!isPhone()) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(reduceMotion) return;
      stopPeekPrompt();
      peekPromptTimer = window.setTimeout(()=>{
        if(!$panel) return;
        $panel.setAttribute('data-nudge', 'true');
        peekPromptClearTimer = window.setTimeout(()=>{
          if($panel){
            $panel.removeAttribute('data-nudge');
          }
          peekPromptClearTimer = null;
        }, 1800);
      }, 320);
    }

    function updateMinimizeButton(){
      if(!$minimize) return;
      if(chatDisabled){
        $minimize.style.display = 'none';
        return;
      }
      $minimize.style.display = '';
      const peek = isPeek();
      const label = peek ? 'Expand chat' : 'Minimize chat';
      $minimize.textContent = peek ? '+' : '–';
      $minimize.setAttribute('aria-label', label);
      $minimize.setAttribute('title', label);
    }

    function renderUnavailableState(reason){
      if(chatDisabled && endpointState === 'fail') return;
      chatDisabled = true;
      loaded = true;
      loadSucceeded = false;
      endpointState = 'fail';
      const errorValue = reason || 'unavailable';
      $panel.setAttribute('data-chat-error', errorValue);
      showFallback($fallback, $frame);
      updateMinimizeButton();
      updatePeekHint(isPeek());
    }

    updateMinimizeButton();

    if($badge){
      if(BUTTON_OPEN_TEXT){
        $badge.textContent = BUTTON_OPEN_TEXT;
      } else {
        $badge.remove();
      }
    }

    if(chatDisabled){
      renderUnavailableState('missing-url');
      return;
    }

    function clampPanelToViewport(padding = 16){
      if(!$panel) return;
      const rect = $panel.getBoundingClientRect();
      if(rect.width === 0 && rect.height === 0) return;
      const hasInlineLeft = $panel.style.left !== '';
      const hasInlineTop = $panel.style.top !== '';
      if(!hasInlineLeft && !hasInlineTop) return;
      const safe = Number.isFinite(padding) ? padding : 16;

      if(hasInlineLeft){
        const minLeft = safe;
        const maxLeft = Math.max(minLeft, window.innerWidth - rect.width - safe);
        let targetLeft = rect.left;
        if(rect.left < minLeft){
          targetLeft = minLeft;
        } else if(rect.right > window.innerWidth - safe){
          targetLeft = maxLeft;
        }
        targetLeft = Math.min(Math.max(targetLeft, minLeft), maxLeft);
        if(Math.abs(targetLeft - rect.left) > 0.5){
          $panel.style.left = `${Math.round(targetLeft)}px`;
          $panel.style.right = '';
        }
      }

      if(hasInlineTop){
        const minTop = safe;
        const maxTop = window.innerHeight - rect.height - safe;
        let targetTop = rect.top;
        if(rect.top < minTop){
          targetTop = minTop;
        } else if(rect.bottom > window.innerHeight - safe){
          targetTop = Math.min(rect.top, maxTop);
        }
        const clampTop = maxTop < minTop ? minTop : Math.min(Math.max(targetTop, minTop), maxTop);
        if(Math.abs(clampTop - rect.top) > 0.5){
          $panel.style.top = `${Math.round(clampTop)}px`;
          $panel.style.bottom = '';
        }
      }
    }

    function setOpenState(){
      $panel.style.display = 'block';
      $panel.setAttribute('data-open', 'true');
      $panel.removeAttribute('data-peek');
      $panel.removeAttribute('data-swiping');
      $panel.removeAttribute('data-closing');
      $panel.removeAttribute('aria-hidden');
      stopPeekPrompt();
      $panel.removeAttribute('data-reveal');
      if(!chatDisabled){
        hideFallback($fallback, $frame);
      } else {
        showFallback($fallback, $frame);
      }
      $panel.style.removeProperty('--p4h-shift');
      $panel.style.removeProperty('--p4h-swipe-x');
      $panel.style.transform = '';
      $panel.style.opacity = '';
      updateMinimizeButton();
      updatePeekHint(false);
      hideLauncher();
      requestAnimationFrame(()=>{ clampPanelToViewport(); });
    }

    function setPeekState(){
      $panel.removeAttribute('data-open');
      $panel.setAttribute('data-peek', 'true');
      $panel.style.display = 'block';
      stopPeekPrompt();
      $panel.removeAttribute('data-reveal');
      if(isPhone()){
        $panel.style.top = '';
        $panel.style.left = '';
        $panel.style.right = '';
        $panel.style.bottom = '';
      } else {
        $panel.style.bottom = '';
      }
      if(isPhone()){
        $panel.setAttribute('aria-hidden', 'true');
      } else {
        $panel.removeAttribute('aria-hidden');
      }
      $panel.removeAttribute('data-swiping');
      $panel.removeAttribute('data-closing');
      if(chatDisabled){
        if($fallback){
          $fallback.hidden = true;
          if(!$fallback.hasAttribute('hidden')){
            $fallback.setAttribute('hidden', '');
          }
        }
        if($frame){
          $frame.hidden = true;
          $frame.setAttribute('aria-hidden', 'true');
        }
      } else {
        hideFallback($fallback, $frame);
        if($frame){
          $frame.hidden = true;
          $frame.setAttribute('aria-hidden', 'true');
        }
      }
      $panel.style.transform = '';
      $panel.style.removeProperty('--p4h-shift');
      $panel.style.removeProperty('--p4h-swipe-x');
      if($panel.contains(document.activeElement)){
        try { document.activeElement.blur(); } catch(e){}
      }
      $panel.style.opacity = '';
      updateMinimizeButton();
      updatePeekHint(true);
      hideLauncher();
      queuePeekPrompt();
    }

    const isOpen = () => $panel.getAttribute('data-open') === 'true';

    function openChat(){
      ensureLoaded();
      setOpenState();
      if(!chatDisabled){
        setTimeout(()=>{ try { $frame.contentWindow?.focus(); } catch(e){} }, 150);
      }
    }
    function closeChat(options = {}){
      const wasPeek = $panel.getAttribute('data-peek') === 'true';
      const wasOpen = isOpen();
      if(!wasPeek && !wasOpen) return;

      const duration = 220;
      $panel.setAttribute('data-closing', wasPeek ? 'peek' : 'open');
      stopPeekPrompt();
      $panel.removeAttribute('data-reveal');
      const horizontalClose = options.horizontal === true;
      const closeDirection = horizontalClose ? (options.direction >= 0 ? 1 : -1) : 0;
      void window.getComputedStyle($panel).transform;

      requestAnimationFrame(()=>{
        const rect = $panel.getBoundingClientRect();
        if(horizontalClose){
          const horizontalTravel = Math.max(rect.width * 1.1, window.innerWidth * 0.75);
          const travelX = closeDirection * horizontalTravel;
          $panel.style.transform = `translate3d(${travelX}px, 0, 0)`;
        } else {
          const travelY = wasPeek
            ? Math.max(120, Math.ceil(window.innerHeight - rect.top + 40))
            : 24;
          $panel.style.transform = `translateY(${travelY}px)`;
        }
        $panel.style.opacity = '0';
      });

      setTimeout(()=>{
        $panel.removeAttribute('data-open');
        $panel.removeAttribute('data-peek');
        $panel.removeAttribute('data-swiping');
        $panel.removeAttribute('data-closing');
        $panel.removeAttribute('aria-hidden');
        $panel.removeAttribute('data-reveal');
        if(!chatDisabled){
          hideFallback($fallback, $frame);
        } else {
          showFallback($fallback, $frame);
        }
        $panel.style.display = 'none';
        $panel.style.opacity = '';
        $panel.style.transform = '';
        $panel.style.removeProperty('--p4h-shift');
        $panel.style.removeProperty('--p4h-swipe-x');
        updateMinimizeButton();
        updatePeekHint(false);
        showLauncher();
      }, duration);
    }
    const toggleChat = () => { isOpen() ? closeChat() : openChat(); };

    $launcher.addEventListener('click', toggleChat);
    if($minimize){
      $minimize.addEventListener('click', ()=>{
        if(chatDisabled) return;
        if(isPeek()){
          ensureLoaded();
          setOpenState();
        } else {
          if(!isOpen()){
            ensureLoaded();
          }
          setPeekState();
        }
      });
    }
    if($close){
      $close.addEventListener('click', closeChat);
    }
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && isOpen()) closeChat(); });

    let dragging=false, startX=0, startY=0, startLeft=0, startTop=0, panelW=0, panelH=0;

    if($handle){
      $handle.addEventListener('pointerdown', (e)=>{
        if (isPhone()) return;
        dragging = true;
        $handle.setPointerCapture(e.pointerId);
        const rect = $panel.getBoundingClientRect();
        panelW = rect.width;
        panelH = rect.height;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = rect.left;
        startTop = rect.top;
        $panel.style.right = '';
        $panel.style.bottom = '';
        $panel.style.left = `${startLeft}px`;
        $panel.style.top = `${startTop}px`;
        $handle.style.cursor = 'grabbing';
      });
    }
    window.addEventListener('pointermove', (e)=>{
      if(!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxLeft = window.innerWidth - panelW;
      const maxTop = window.innerHeight - panelH;
      $panel.style.left = Math.max(0, Math.min(maxLeft, startLeft + dx)) + 'px';
      $panel.style.top  = Math.max(0, Math.min(maxTop,  startTop + dy)) + 'px';
    });
    window.addEventListener('pointerup', ()=>{
      if(!dragging) return;
      dragging = false;
      if($handle){
        $handle.style.cursor = 'grab';
      }
    });

    let swiping=false, swipeStartY=0, swipeStartX=0, deltaY=0, deltaX=0, peekAtStart=false, swipeMode=null, swipeShiftX=0;
    const handleTouchStart = (e)=>{
      if(!isPhone()) return;
      if(swiping) return;
      if(e.target.closest('.p4h-chat-controls')) return;
      const isPeekState = $panel.getAttribute('data-peek') === 'true';
      const startedOnHandle = $handle && $handle.contains(e.target);
      if(isPeekState && e.target.closest('.p4h-chat-controls')) return;
      if(!isPeekState && !startedOnHandle) return;
      swiping = true;
      swipeMode = null;
      deltaY = 0;
      deltaX = 0;
      swipeShiftX = 0;
      swipeStartY = e.touches[0].clientY;
      swipeStartX = e.touches[0].clientX;
      peekAtStart = isPeekState;
      stopPeekPrompt();
      $panel.style.transition = 'none';
      $panel.style.willChange = 'transform';
      $panel.setAttribute('data-swiping', 'true');
      $panel.style.removeProperty('--p4h-shift');
      $panel.style.removeProperty('--p4h-swipe-x');
    };
    const handleTouchMove = (e)=>{
      if(!swiping) return;
      const touch = e.touches[0];
      deltaY = touch.clientY - swipeStartY;
      deltaX = touch.clientX - swipeStartX;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if(swipeMode === null){
        if(absX < SWIPE_MODE_LOCK_DISTANCE && absY < SWIPE_MODE_LOCK_DISTANCE){
          return;
        }
        if(peekAtStart && absX > absY){
          swipeMode = 'horizontal';
        } else {
          swipeMode = 'vertical';
        }
      }
      $panel.setAttribute('data-swiping', 'true');
      if(swipeMode === 'horizontal'){
        const rect = $panel.getBoundingClientRect();
        const limit = Math.max(90, Math.min(window.innerWidth, rect.width) * 0.45);
        swipeShiftX = Math.max(-limit, Math.min(deltaX, limit));
        $panel.style.setProperty('--p4h-swipe-x', `${swipeShiftX}px`);
        $panel.style.removeProperty('--p4h-shift');
      } else {
        const rawHeight = $panel.clientHeight || window.innerHeight;
        const limit = peekAtStart ? window.innerHeight : Math.min(rawHeight, window.innerHeight);
        const translate = peekAtStart
          ? Math.max(-limit, Math.min(0, deltaY))
          : Math.max(0, Math.min(deltaY, limit));
        swipeShiftX = 0;
        $panel.style.setProperty('--p4h-shift', `${translate}px`);
        $panel.style.setProperty('--p4h-swipe-x', '0px');
        if(peekAtStart){
          const revealThreshold = -32;
          if(translate < revealThreshold){
            $panel.setAttribute('data-reveal', 'true');
            if(!chatDisabled){
              ensureLoaded();
              hideFallback($fallback, $frame);
            }
            if($frame){
              $frame.hidden = false;
              $frame.removeAttribute('aria-hidden');
            }
          } else {
            $panel.removeAttribute('data-reveal');
            if($frame){
              $frame.hidden = true;
              $frame.setAttribute('aria-hidden', 'true');
            }
          }
        }
      }
    };
    const finishSwipe = ()=>{
      if(!swiping) return;
      swiping = false;
      $panel.style.transition = '';
      $panel.style.removeProperty('willChange');
      $panel.style.removeProperty('--p4h-shift');
      $panel.style.removeProperty('--p4h-swipe-x');
      $panel.removeAttribute('data-swiping');
      const isTap = Math.abs(deltaY) <= 10 && Math.abs(deltaX) <= 10;
      const horizontalDistance = Math.abs(swipeShiftX);
      if(swipeMode === 'horizontal' && peekAtStart){
        if(horizontalDistance > HORIZONTAL_CLOSE_THRESHOLD){
          closeChat({ horizontal: true, direction: swipeShiftX });
        } else {
          if(peekAtStart){
            setPeekState();
          } else {
            setOpenState();
          }
        }
      } else {
        const shouldPeek = !peekAtStart && deltaY > PEEK_THRESHOLD;
        const shouldOpen = peekAtStart && (deltaY < -OPEN_THRESHOLD || isTap);
        const shouldClosePeek = peekAtStart && deltaY > CLOSE_PEEK_THRESHOLD;
        if(shouldClosePeek){
          closeChat();
        } else if(shouldPeek){
          setPeekState();
        } else if(shouldOpen){
          ensureLoaded();
          setOpenState();
        } else {
          if(peekAtStart){
            setPeekState();
          } else {
            if(!isOpen()){
              ensureLoaded();
            }
            setOpenState();
          }
        }
      }
      if(!peekAtStart){
        $panel.removeAttribute('data-reveal');
      }
      deltaY = 0;
      deltaX = 0;
      swipeShiftX = 0;
      swipeMode = null;
    };
    [$handle, $panel].forEach((el)=>{
      if(!el) return;
      el.addEventListener('touchstart', handleTouchStart, {passive:true});
      el.addEventListener('touchmove', handleTouchMove, {passive:true});
      el.addEventListener('touchend', finishSwipe);
      el.addEventListener('touchcancel', finishSwipe);
    });

    function verifyChatUrl(){
      if(chatDisabled) return;
      if(typeof fetch !== 'function') return;
      let resolvedUrl;
      try {
        resolvedUrl = new URL(CHAT_URL, window.location.href).toString();
      } catch (_) {
        return;
      }
      endpointState = 'pending';
      fetch(resolvedUrl, {
        method: 'HEAD',
        mode: 'cors',
        redirect: 'follow',
        cache: 'no-store',
        credentials: 'omit'
      }).then((response)=>{
        if(chatDisabled) return;
        if(response.status >= 400){
          renderUnavailableState('unreachable');
        } else if(response.status >= 200){
          endpointState = 'ok';
        }
      }).catch(()=>{
        if(chatDisabled || endpointState === 'fail') return;
        fetch(resolvedUrl, {
          method: 'GET',
          mode: 'no-cors',
          redirect: 'follow',
          cache: 'no-store',
          credentials: 'omit'
        }).then(()=>{
          if(chatDisabled || endpointState === 'fail') return;
          if(endpointState === 'pending'){
            endpointState = 'unknown';
          }
        }).catch(()=>{
          if(chatDisabled || endpointState === 'fail') return;
          renderUnavailableState('unreachable');
        });
      });
    }

    if(hasChatUrl){
      verifyChatUrl();
    }

    if(hasChatUrl){
      const loadHandler = ()=>{
        if(chatDisabled) return;
        if(endpointState === 'fail'){
          renderUnavailableState('unreachable');
          return;
        }
        loadSucceeded = true;
        hideFallback($fallback, $frame);
      };

      const errorHandler = ()=>{
        if(chatDisabled) return;
        renderUnavailableState('unreachable');
      };

      $frame.addEventListener('load', loadHandler, {once:false});
      $frame.addEventListener('error', errorHandler, {once:false});

      const fallbackTimer = setTimeout(()=>{
        if(chatDisabled || loadSucceeded) return;
        renderUnavailableState('unreachable');
      }, 3500);

      const clearTimer = ()=>{
        clearTimeout(fallbackTimer);
        $frame.removeEventListener('load', clearTimer);
        $frame.removeEventListener('error', clearTimer);
      };
      $frame.addEventListener('load', clearTimer, {once:true});
      $frame.addEventListener('error', clearTimer, {once:true});

      ensureLoaded();

      const link = document.createElement('link');
      link.rel = 'preconnect';
      try {
        link.href = new URL(CHAT_URL, window.location.href).origin;
        document.head.appendChild(link);
      } catch (_) {
        // Ignore malformed URLs provided via data-chat-url.
      }
    } else {
      renderUnavailableState('missing-url');
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

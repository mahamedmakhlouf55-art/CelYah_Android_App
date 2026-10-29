// التنقل بين الشاشات + عناصر واجهة مشتركة
import { cfg, S, onChange, isOnline } from './store.js';
import { t } from './i18n.js';
import { icon } from './icons.js';

export const root = document.getElementById('app');
export const screens = {};            // name -> (params) => { html, nav?, mount?(el), update?(what), cleanup?() }
const stack = [];
let cur = null, curName = '', curParams = {};

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function navHTML(active) {
  const items = [['home', 'home', 'nav_home'], ['chat', 'chat', 'nav_chat'], ['camera', 'camera', 'nav_camera'], ['control', 'move', 'nav_control'], ['settings', 'gear', 'nav_settings']];
  return `<nav class="nav">${items.map(([id, ic, k]) => `<button data-nav="${id}" class="${id === active ? 'on' : ''}">${icon(ic, 24)}<span>${t(k)}</span></button>`).join('')}</nav>`;
}

// رأس شاشة فرعية: رجوع + عنوان + (اختياري) حالة + ترس
export function hdrSub(title, { sub = '', gear = true, back = true } = {}) {
  return `<div class="hdr">
    ${back ? `<button class="icon-btn" data-back aria-label="${t('back')}">${icon('left', 22, 'rtl-flip')}</button>` : '<span style="width:44px"></span>'}
    <div class="mid"><div class="ttl">${title}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
    ${gear ? `<button class="icon-btn" data-go="settings" aria-label="${t('settings')}">${icon('gear', 22)}</button>` : '<span style="width:44px"></span>'}
  </div>`;
}
export const onlineSub = () => `<span class="dot ${isOnline() ? '' : 'off'}"></span><span>${isOnline() ? t('online') : t('offline')}</span>`;
export const toggleHTML = (id, on) => `<button class="tg ${on ? 'on' : ''}" id="${id}" role="switch" aria-checked="${!!on}"></button>`;

export function toast(msgOrKey) {
  const msg = t(msgOrKey);
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; root.appendChild(d);
  setTimeout(() => d.remove(), 2800);
}

export function sheet(html, onMount) {
  const bg = document.createElement('div'); bg.className = 'sheet-bg';
  bg.innerHTML = `<div class="sheet">${html}</div>`;
  bg.addEventListener('click', (e) => { if (e.target === bg) bg.remove(); });
  root.appendChild(bg); onMount?.(bg.firstElementChild, () => bg.remove());
  return bg;
}

function bindCommon(el) {
  el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  el.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', back));
  el.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => go(b.dataset.nav, {}, 'reset')));
  el.querySelectorAll('.tg').forEach((b) => { if (!b._tg) { b._tg = 1; b.addEventListener('click', () => { b.classList.toggle('on'); b.setAttribute('aria-checked', b.classList.contains('on')); b.dispatchEvent(new CustomEvent('toggle', { detail: b.classList.contains('on') })); }); } });
}

export function go(name, params = {}, mode = 'push') {
  if (!screens[name]) { console.warn('no screen', name); return; }
  if (mode === 'reset') stack.length = 0;
  else if (mode === 'push' && curName) stack.push([curName, curParams]);
  render(name, params);
}
export function back() { const p = stack.pop(); if (p) render(p[0], p[1]); else render('home', {}); }

export function render(name, params = {}) {
  try { cur?.cleanup?.(); } catch (e) { console.error(e); }
  curName = name; curParams = params;
  const def = screens[name](params);
  cur = def;
  root.querySelectorAll('.screen,.nav,.sheet-bg').forEach((n) => n.remove());
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="screen ${def.nav ? 'has-nav' : ''} ${def.cls || ''}" data-screen="${name}">${def.html}</div>${def.nav ? navHTML(def.nav) : ''}`;
  while (wrap.firstChild) root.appendChild(wrap.firstChild);
  bindCommon(root);
  def.mount?.(root.querySelector('.screen'));
}
export const rerender = () => render(curName, curParams);
export const currentName = () => curName;

onChange((what) => { try { cur?.update?.(what); } catch (e) { console.error(e); } });

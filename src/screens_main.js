// الشاشات الأساسية: البداية، الرئيسية، الشات، الكاميرا، التحكم
import { cfg, save, S, isOnline } from './store.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { heroHTML, avatarHTML } from './robot-art.js';
import { RobotFace, startFace, stopFace, FACES } from './face.js';
import * as L from './link.js';
import { askGemini, parseReply, speak, listen, stopListening, voiceSupported } from './gemini.js';
import { screens, go, hdrSub, onlineSub, toast, esc, toggleHTML } from './router.js';

/* ---------- وش الروبوت ---------- */
function mountFace(canvas, name, opts) {
  const f = new RobotFace(canvas, opts); f.setName(name || S.face || 'normal'); L.attachFace(f); startFace(f); return f;
}
function mountHeroFace(el, name) {
  const hero = el.querySelector('.hero'); if (!hero) return null;
  const full = hero.classList.contains('full');
  return mountFace(hero.querySelector('.hero-face'), name, full ? { viewY: 30, viewH: 154 } : { viewY: 34, viewH: 140 });
}
const killFaces = (arr) => arr.forEach((f) => { stopFace(f); L.detachFace(f); });

/* ---------- 1) البداية ---------- */
const SLIDES = [['ob1_t', 'ob1_d', 'love'], ['ob2_t', 'ob2_d', 'curious'], ['ob3_t', 'ob3_d', 'excited']];
screens.splash = () => {
  let i = 0, timer = 0, face = null;
  return {
    cls: 'splash',
    html: `<div><h1>${t('app')}${icon('heart', 26)}</h1><div class="robot-sub">ROBOT</div><div class="tag">${t('tagline')}</div></div>
      ${heroHTML({ full: true })}
      <div class="slide-text" id="sTxt"></div>
      <div class="dots" id="sDots">${SLIDES.map(() => '<i></i>').join('')}</div>
      <button class="btn pri" id="start">${t('get_started')} ${icon('right', 20, 'rtl-flip')}</button>`,
    mount(el) {
      face = mountHeroFace(el, 'love');
      const show = () => {
        el.querySelector('#sTxt').innerHTML = `<b>${t(SLIDES[i][0])}</b><span>${t(SLIDES[i][1])}</span>`;
        el.querySelectorAll('#sDots i').forEach((d, k) => d.classList.toggle('on', k === i));
        face?.setName(SLIDES[i][2]);
      };
      show(); timer = setInterval(() => { i = (i + 1) % SLIDES.length; show(); }, 3200);
      el.querySelectorAll('#sDots i').forEach((d, k) => d.addEventListener('click', () => { i = k; show(); }));
      el.querySelector('#start').addEventListener('click', () => { cfg.onboarded = true; save(); go('home', {}, 'reset'); });
    },
    cleanup() { clearInterval(timer); killFaces([face].filter(Boolean)); },
  };
};

/* ---------- 2) الرئيسية ---------- */
screens.home = () => {
  let face = null;
  const upd = (el) => {
    el.querySelector('#hStat').className = 'stat' + (isOnline() ? '' : ' off');
    el.querySelector('#hStat').innerHTML = `<span class="dot ${isOnline() ? '' : 'off'}"></span>${isOnline() ? t('online') : t('offline')}`;
    const known = S.batt >= 0, ic = el.querySelector('#bIcon');
    ic.className = 'batt-icon' + (!known ? ' unk' : S.batt < 20 && !S.charging ? ' low' : '');
    el.querySelector('#bPct').textContent = known ? S.batt + '%' : '--%';
    el.querySelector('#bLbl').textContent = !known ? t('battery_unknown') : S.charging ? t('charging') : t('on_battery');
    const en = S.energy == null ? 0 : Math.round(S.energy);
    el.querySelector('#eRing').style.setProperty('--p', en + '%');
    el.querySelector('#eTxt').textContent = S.energy == null ? '--' : en + '%';
  };
  return {
    nav: 'home',
    html: `<div class="hdr hdr-home">
        <div class="start"><div class="brand">${t('app')}${icon('heart', 18)}</div><div class="stat" id="hStat"></div></div>
        <button class="icon-btn" data-go="connection" aria-label="${t('connection')}">${icon('wifi', 22)}</button>
        <button class="icon-btn" data-go="settings" aria-label="${t('settings')}">${icon('gear', 22)}</button>
      </div>
      <div class="home-hero">${heroHTML({ full: true })}</div>
      <button class="card batt-card" data-go="status" style="width:100%;text-align:start">
        <div class="batt-icon" id="bIcon">${icon('bolt', 26)}</div>
        <div style="flex:1"><div class="big" id="bPct" dir="ltr" style="text-align:start"></div><small id="bLbl"></small></div>
        <div style="text-align:center"><div class="ring" id="eRing"><span id="eTxt" dir="ltr"></span></div><small style="color:var(--dim);font-size:11px">${t('energy')}</small></div>
      </button>
      <div class="grid2">
        <button class="card qcard" data-go="chat"><span class="tile">${icon('chat', 26)}</span><b>${t('chat')}</b><small>${t('chat_sub')}</small></button>
        <button class="card qcard" data-go="camera"><span class="tile">${icon('camera', 26)}</span><b>${t('live_cam')}</b><small>${t('live_cam_sub')}</small></button>
      </div>`,
    mount(el) { face = mountHeroFace(el); upd(el); L.send('STATUS'); },
    update(what) { const el = document.querySelector('.screen'); if (el && (what === 'stat' || what === 'conn' || what === '*')) upd(el); },
    cleanup() { killFaces([face].filter(Boolean)); },
  };
};

/* ---------- 3) الشات ---------- */
const EMOJIS = ['😀', '😂', '😍', '🥰', '😎', '🤖', '👍', '❤️', '🎉', '😴', '😢', '🤔'];
let chatBusy = false, listening = false;
screens.chat = () => {
  let face = null, el = null;
  const fmt = (ts) => new Date(ts).toLocaleTimeString(cfg.lang === 'ar' ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
  const bubble = (m) => {
    const d = document.createElement('div'); d.className = 'msg ' + (m.r === 'me' ? 'me' : 'bot');
    d.innerHTML = (m.r === 'bot' ? avatarHTML(34) : '') + `<div class="bubble"></div>`;
    const b = d.querySelector('.bubble'); b.textContent = m.text;
    const tm = document.createElement('time'); tm.textContent = fmt(m.ts); b.appendChild(tm);
    return d;
  };
  const area = () => el.querySelector('#msgs');
  const add = (m, persist = true) => {
    if (persist) { cfg.chat.push(m); if (cfg.chat.length > 60) cfg.chat.shift(); save(); }
    area().appendChild(bubble(m)); area().scrollTop = area().scrollHeight;
  };
  const sys = (text) => { const d = document.createElement('div'); d.className = 'sysmsg'; d.textContent = text; area().appendChild(d); area().scrollTop = area().scrollHeight; return d; };

  async function sendChat(text) {
    text = (text || '').trim(); if (!text || chatBusy) return;
    el.querySelector('#txt').value = '';
    add({ r: 'me', text, ts: Date.now() });
    if (!cfg.gemKey) {
      if (L.send('CHAT:' + text)) { L.hooks.chatLine = (reply) => add({ r: 'bot', text: reply, ts: Date.now() }); } else sys(t('not_linked'));
      return;
    }
    chatBusy = true; el.querySelector('#send').disabled = true;
    L.send('STATE:thinking'); face?.setName('thinking');
    const wait = sys(t('thinking'));
    try {
      const history = cfg.chat.filter((m) => m.r === 'me' || m.r === 'bot').slice(-14).map((m) => ({ role: m.r === 'me' ? 'user' : 'model', text: m.text }));
      const { face: fc, text: reply } = parseReply(await askGemini(history));
      wait.remove();
      face?.setName(fc); L.send('SAY:' + fc + '|');
      if (cfg.textResp) add({ r: 'bot', text: reply, ts: Date.now() });
      else cfg.chat.push({ r: 'bot', text: reply, ts: Date.now() });
      if (cfg.voiceResp) await speak(reply);
    } catch (e) { wait.remove(); sys('⚠️ Gemini: ' + e.message); face?.setName('confused'); }
    chatBusy = false; const b = el.querySelector('#send'); if (b) b.disabled = false;
    if (cfg.converse && document.body.contains(el)) micToggle(true);       // محادثة مستمرة: يسمع تاني
  }

  async function micToggle(forceStart = false) {
    const mic = el.querySelector('#mic');
    if (listening && !forceStart) { listening = false; mic.classList.remove('rec'); stopListening(); return; }
    if (!voiceSupported()) { sys(t('mic_fail')); return; }
    listening = true; mic.classList.add('rec'); L.send('STATE:listening'); const w = sys(t('listening'));
    let txt = null; try { txt = await listen(); } catch (e) { console.warn(e); }
    w.remove(); listening = false; mic.classList.remove('rec');
    if (txt) sendChat(txt); else if (!cfg.converse) sys(t('mic_fail'));
  }

  return {
    nav: 'chat',
    html: `${hdrSub(`${t('app')} ♥`, { sub: onlineSub() })}
      <div class="card live-card"><canvas id="lf"></canvas>
        <span class="badge tl"><span class="rec"></span>${t('live')}</span>
        <button class="expand-btn" id="lfx" aria-label="expand">${icon('expand', 18)}</button></div>
      <div class="chat-area" id="msgs"></div>
      <div class="emojis hidden" id="emo">${EMOJIS.map((e) => `<button>${e}</button>`).join('')}</div>
      <div class="inputbar">
        <button id="emoBtn" aria-label="emoji" style="color:var(--dim)">${icon('smile', 24)}</button>
        <input id="txt" placeholder="${t('type_msg')}" autocomplete="off" enterkeyhint="send">
        <button class="mic" id="mic" aria-label="mic">${icon('mic', 22)}</button>
        <button class="mic" id="send" aria-label="send" style="background:var(--grad)">${icon('send', 20, 'rtl-flip')}</button>
      </div>`,
    mount(root) {
      el = root;
      face = mountFace(el.querySelector('#lf'), undefined, { viewY: 30, viewH: 150 });
      if (!cfg.chat.length) { cfg.chat.push({ r: 'bot', text: t('hello_msg'), ts: Date.now() }); save(); }
      cfg.chat.forEach((m) => area().appendChild(bubble(m)));
      if (!cfg.gemKey) sys(t('need_gemini'));
      area().scrollTop = area().scrollHeight;
      el.querySelector('#send').addEventListener('click', () => sendChat(el.querySelector('#txt').value));
      el.querySelector('#txt').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(e.target.value); });
      el.querySelector('#mic').addEventListener('click', () => micToggle());
      el.querySelector('#emoBtn').addEventListener('click', () => el.querySelector('#emo').classList.toggle('hidden'));
      el.querySelectorAll('#emo button').forEach((b) => b.addEventListener('click', () => { const i = el.querySelector('#txt'); i.value += b.textContent; i.focus(); }));
      el.querySelector('#lfx').addEventListener('click', () => el.querySelector('.live-card').requestFullscreen?.().catch(() => {}));
      L.hooks.chatLine = (reply) => add({ r: 'bot', text: reply, ts: Date.now() });
      L.send('VIEW:1');
    },
    update(what) { if (what === 'conn' && el) { const s = el.querySelector('.hdr .sub'); if (s) s.innerHTML = onlineSub(); } },
    cleanup() { killFaces([face].filter(Boolean)); listening = false; stopListening(); },
  };
};

/* ---------- لوحة التحكم المشتركة (الكاميرا + شاشة التحكم) ---------- */
function padHTML() {
  return `<div class="seg" id="modeSeg"><button data-v="AUTO" class="${S.mode === 'AUTO' ? 'on' : ''}">${t('auto')}</button><button data-v="MANUAL" class="${S.mode === 'MANUAL' ? 'on' : ''}">${t('manual')}</button></div>
    <div class="dpad-wrap">
      <div class="dpad">
        <button class="u" data-d="F" aria-label="forward">${icon('up', 30)}</button><button class="l" data-d="L" aria-label="left">${icon('left', 30)}</button>
        <button class="r" data-d="R" aria-label="right">${icon('right', 30)}</button><button class="d" data-d="B" aria-label="back">${icon('down', 30)}</button>
        <button class="c stop" id="padStop" aria-label="${t('stop')}"></button>
      </div>
      <div class="vslider"><div class="vtrack" id="vt"><div class="vfill" id="vf"></div><div class="vknob" id="vk"></div></div><b id="vp" dir="ltr">${cfg.speed}%</b><small>${t('speed')}</small></div>
    </div>
    <div class="acts">
      <button class="act" data-g="pick">${icon('pick', 26)}<span>${t('pick')}</span></button>
      <button class="act" data-g="wave">${icon('hand', 26)}<span>${t('wave')}</span></button>
      <button class="act" data-g="home">${icon('home', 26)}<span>${t('home_btn')}</span></button>
    </div>`;
}
function bindPad(el) {
  let timer = 0, dir = null;
  const stopDrive = (sendStop = true) => { clearInterval(timer); timer = 0; el.querySelectorAll('.dpad button.hold').forEach((b) => b.classList.remove('hold')); if (dir && sendStop) { L.send('DRIVE:S'); L.send('STOP'); } dir = null; };
  el.querySelectorAll('.dpad button[data-d]').forEach((b) => {
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.setPointerCapture(e.pointerId); stopDrive(false); dir = b.dataset.d; b.classList.add('hold'); L.send('DRIVE:' + dir); timer = setInterval(() => L.send('DRIVE:' + dir), 250); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => b.addEventListener(ev, () => stopDrive(true)));
  });
  el.querySelector('#padStop')?.addEventListener('click', () => { stopDrive(false); L.send('DRIVE:S'); L.send('STOP'); });
  const vis = () => { if (document.hidden) stopDrive(true); };
  document.addEventListener('visibilitychange', vis);
  el.querySelectorAll('.act').forEach((b) => b.addEventListener('click', () => L.send('GESTURE:' + b.dataset.g)));
  el.querySelectorAll('#modeSeg button').forEach((b) => b.addEventListener('click', () => {
    S.mode = b.dataset.v; el.querySelectorAll('#modeSeg button').forEach((x) => x.classList.toggle('on', x === b)); L.send('MODE:' + S.mode);
  }));
  // شريط السرعة العمودي
  const vt = el.querySelector('#vt'), setSp = (p) => {
    cfg.speed = p; el.querySelector('#vf').style.height = p + '%'; el.querySelector('#vk').style.bottom = `calc(${p}% - 6px)`; el.querySelector('#vp').textContent = p + '%';
  };
  setSp(cfg.speed);
  let spT = 0;
  const fromEvent = (e) => { const r = vt.getBoundingClientRect(); setSp(Math.round(Math.max(10, Math.min(100, (1 - (e.clientY - r.top) / r.height) * 100)) / 5) * 5); clearTimeout(spT); spT = setTimeout(() => { save(); L.send('SPEED:' + cfg.speed); }, 150); };
  vt.addEventListener('pointerdown', (e) => { vt.setPointerCapture(e.pointerId); fromEvent(e); vt._d = true; });
  vt.addEventListener('pointermove', (e) => { if (vt._d) fromEvent(e); });
  ['pointerup', 'pointercancel'].forEach((ev) => vt.addEventListener(ev, () => { vt._d = false; }));
  return () => { stopDrive(true); document.removeEventListener('visibilitychange', vis); };
}

/* ---------- 4) الكاميرا المباشرة ---------- */
screens.camera = () => {
  let unpad = null, ctl = 0, lastUrl = null, frames = 0, fpsT = performance.now(), el = null;
  const resLabel = () => (cfg.camRes ? 'HD 640×480' : '320×240');
  const msg = (k) => { const m = el.querySelector('#cmsg'); m.querySelector('span').textContent = k ? t(k) : ''; m.classList.remove('hidden'); el.querySelector('#cimg').style.display = 'none'; };
  const refreshBtn = () => { const b = el.querySelector('#camBtn'); b.innerHTML = S.camRunning ? `${icon('stop', 18)} ${t('cam_stop')}` : `${icon('camera', 18)} ${t('cam_start')}`; b.className = 'btn sm ' + (S.camRunning ? 'ghost' : 'pri'); el.querySelector('#liveBadge').classList.toggle('hidden', !S.camRunning); };
  const start = () => {
    if (!L.mqttReady()) { msg('cam_net'); return; }
    S.camRunning = true; msg('cam_wait'); refreshBtn(); L.sendNet('STREAM:1'); clearInterval(ctl); ctl = setInterval(() => L.sendNet('STREAM:1'), 15000);
  };
  const stop = () => { L.sendNet('STREAM:0'); S.camRunning = false; clearInterval(ctl); msg('cam_off'); refreshBtn(); };
  return {
    cls: 'camscreen',
    html: `${hdrSub(t('cam_title'), { sub: `${onlineSub()} <span>• ${resLabel()}</span>` })}
      <div class="cam-view" id="cv">
        <img id="cimg" alt="">
        <div class="msg-center" id="cmsg"><span></span></div>
        <span class="badge tl hidden" id="liveBadge"><span class="rec"></span>${t('live')}</span>
        <span class="badge tr" id="resBadge">${cfg.camRes ? 'HD' : 'SD'}</span>
        <button class="expand-btn" id="cfull" aria-label="fullscreen">${icon('expand', 18)}</button>
      </div>
      <button class="btn sm pri" id="camBtn" style="align-self:center"></button>
      ${padHTML()}
      <button class="btn danger" id="stopAll">${icon('stop', 20)} ${t('stop')}</button>`,
    mount(root) {
      el = root; unpad = bindPad(el);
      el.querySelector('#camBtn').addEventListener('click', () => (S.camRunning ? stop() : start()));
      el.querySelector('#stopAll').addEventListener('click', () => { L.send('DRIVE:S'); L.send('STOP'); });
      el.querySelector('#cfull').addEventListener('click', () => el.querySelector('#cv').classList.toggle('full'));
      L.hooks.video = (payload) => {
        if (!S.camRunning) return;
        const url = URL.createObjectURL(new Blob([payload], { type: 'image/jpeg' })), img = el.querySelector('#cimg');
        img.onload = () => { if (lastUrl) URL.revokeObjectURL(lastUrl); lastUrl = url; };
        img.src = url; img.style.display = 'block'; el.querySelector('#cmsg').classList.add('hidden');
        frames++; const n = performance.now(); if (n - fpsT > 1000) { el.querySelector('#resBadge').textContent = `${cfg.camRes ? 'HD' : 'SD'} · ${(frames * 1000 / (n - fpsT)).toFixed(1)} fps`; frames = 0; fpsT = n; }
      };
      msg(S.camRunning ? 'cam_wait' : 'cam_off'); refreshBtn();
      if (cfg.camAuto && !S.camRunning && L.mqttReady()) start();
    },
    update(what) {
      if (!el) return;
      if (what === 'conn') { const s = el.querySelector('.hdr .sub'); if (s) s.innerHTML = `${onlineSub()} <span>• ${resLabel()}</span>`; }
      if (what === 'cam') { if (S.camInfo === 'cam_err') { msg('cam_err'); S.camInfo = ''; } refreshBtn(); }
    },
    cleanup() { unpad?.(); clearInterval(ctl); L.hooks.video = () => {}; if (S.camRunning) { L.sendNet('STREAM:0'); S.camRunning = false; } },
  };
};

/* ---------- 5) التحكم الكامل ---------- */
const HIDE = new Set(['lookleft', 'lookright', 'lookup', 'lookdown']);
let holdFace = false;
screens.control = () => {
  let unpad = null;
  return {
    nav: 'control',
    html: `${hdrSub(t('control_title'), { sub: onlineSub() })}
      <div class="card">${padHTML()}</div>
      <div class="card"><div class="lbl" style="margin:0 0 4px">${t('arm')}: <b id="armV">90</b>°</div><input type="range" id="arm" min="0" max="180" value="90"></div>
      <div class="card"><div class="lbl" style="margin:0 0 8px">${t('activity')}</div>
        <div class="seg" id="liveSeg"><button data-l="1" class="${cfg.live === 1 ? 'on' : ''}">${t('calm')}</button><button data-l="2" class="${cfg.live === 2 ? 'on' : ''}">${t('active')}</button><button data-l="3" class="${cfg.live === 3 ? 'on' : ''}">${t('hyper')}</button></div>
        <div class="btns" style="margin-top:10px"><button class="btn ghost sm" id="sleep">${icon('power', 18)} ${t('sleep')}</button><button class="btn ghost sm" id="wake">${icon('bolt', 18)} ${t('wake')}</button></div></div>
      <div class="card"><div class="switch"><span>${t('hold_face')}<br><span class="hint">${t('hold_hint')}</span></span>${toggleHTML('hold', holdFace)}</div>
        <div class="chips" id="chips">${FACES.filter((f) => !HIDE.has(f.en)).map((f) => `<button data-f="${f.en}">${esc(cfg.lang === 'ar' ? f.ar : f.en)}</button>`).join('')}</div></div>`,
    mount(el) {
      unpad = bindPad(el);
      let armT = 0; const arm = el.querySelector('#arm');
      arm.addEventListener('input', () => { el.querySelector('#armV').textContent = arm.value; const n = Date.now(); if (n - armT > 120) { armT = n; L.send('SERVO:' + arm.value); } });
      arm.addEventListener('change', () => L.send('SERVO:' + arm.value));
      el.querySelectorAll('#liveSeg button').forEach((b) => b.addEventListener('click', () => { cfg.live = +b.dataset.l; save(); el.querySelectorAll('#liveSeg button').forEach((x) => x.classList.toggle('on', x === b)); L.send('LIVE:' + cfg.live); }));
      el.querySelector('#sleep').addEventListener('click', () => L.send('SLEEP'));
      el.querySelector('#wake').addEventListener('click', () => L.send('WAKE'));
      el.querySelector('#hold').addEventListener('toggle', (e) => { holdFace = e.detail; });
      el.querySelectorAll('#chips button').forEach((b) => b.addEventListener('click', () => L.send(holdFace ? 'FACE:' + b.dataset.f : 'SAY:' + b.dataset.f + '|')));
    },
    update(what) { if (what === 'conn') { const s = document.querySelector('.hdr .sub'); if (s) s.innerHTML = onlineSub(); } },
    cleanup() { unpad?.(); },
  };
};

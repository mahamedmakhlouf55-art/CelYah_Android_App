// شاشات الاتصال والإعدادات
import { cfg, save, S, isOnline } from './store.js';
import { t, applyLang } from './i18n.js';
import { icon } from './icons.js';
import { heroHTML, avatarHTML } from './robot-art.js';
import { RobotFace, startFace, stopFace } from './face.js';
import * as L from './link.js';
import { screens, go, rerender, hdrSub, onlineSub, toast, esc, toggleHTML, sheet } from './router.js';

const num = (x) => `<bdi dir="ltr">${x}</bdi>`;
const barsHTML = (n = 4) => `<span class="bars">${[6, 10, 14, 18].map((h, i) => `<i style="height:${h}px;opacity:${i < n ? 1 : .25}"></i>`).join('')}</span>`;
const rssiBars = (r) => (r > -55 ? 4 : r > -67 ? 3 : r > -78 ? 2 : 1);

async function connectRobot(id) {
  if (!L.bleSupported()) { toast('bt_unsupported'); return; }
  try { await L.bleConnect(id); rerender(); }
  catch (e) { if (e && e.name !== 'NotFoundError' && !/cancel|User/i.test(e.message || '')) toast(e.message || 'error'); }
}

/* ---------- الاتصال ---------- */
screens.connection = () => ({
  html: `${hdrSub(t('connection'), { gear: false })}
    <button class="conn-row" id="cBle"><span class="tile">${icon('bluetooth', 28)}</span><span class="txt"><b>${t('bluetooth')}</b><small>${S.ble ? `${t('connected')} · ${esc(S.bleName)}` : t('bt_sub')}</small></span>${icon('right', 22, 'rtl-flip chev')}</button>
    <button class="conn-row" data-go="wifi"><span class="tile" style="background:linear-gradient(180deg,#3aa0ff,#1a62e0)">${icon('wifi', 28)}</span><span class="txt"><b>${t('wifi_internet')}</b><small>${esc(S.ssid) || t('wifi_sub')}</small></span>${icon('right', 22, 'rtl-flip chev')}</button>
    <button class="conn-row" data-go="remote"><span class="tile" style="background:linear-gradient(180deg,#3a8cff,#1450c8)">${icon('globe', 28)}</span><span class="txt"><b>${t('remote')}</b><small>${S.net ? t('srv_connected') : t('remote_sub')}</small></span>${icon('right', 22, 'rtl-flip chev')}</button>
    <div class="h2">${t('saved_devices')}</div>
    <div class="card list">${cfg.devices.length ? cfg.devices.map((d, i) => `<button class="row" data-dev="${i}">${avatarHTML(46)}<span class="txt"><b>${esc(d.name)}</b><small>${esc(d.model)}</small></span>${S.ble && i === 0 ? barsHTML(4) : ''}</button>`).join('') : `<div class="hint" style="padding:12px">${t('no_devices')}</div>`}</div>
    <button class="conn-row" data-go="manage"><span class="tile t-grey">${icon('sliders', 26)}</span><span class="txt"><b>${t('manage_devices')}</b></span>${icon('right', 22, 'rtl-flip chev')}</button>`,
  mount(el) {
    el.querySelector('#cBle').addEventListener('click', () => {
      if (S.ble) sheet(`<h3>${t('bluetooth')}</h3><button class="btn danger" id="dc">${t('disconnect')}</button>`, (s, close) => s.querySelector('#dc').addEventListener('click', async () => { await L.bleDisconnect(); close(); rerender(); }));
      else connectRobot();
    });
    el.querySelectorAll('[data-dev]').forEach((b) => b.addEventListener('click', () => connectRobot(L.isNative() ? cfg.devices[+b.dataset.dev].id : undefined)));
  },
  update(what) { if (what === 'conn') rerender(); },
});

/* ---------- إعداد الواي فاي ---------- */
const wifiMsgText = () => ({
  scanning: t('scanning'), scan_done: `${t('found_n')} ${S.wifiNets.length}`, sent: t('wifi_sent'), connecting: `${t('wifi_connecting')} ${S.ssid}`,
  connected: `${t('wifi_connected')}${S.ssid ? ' (' + S.ssid + ')' : ''}`, failed: t('wifi_failed'), none: t('wifi_none'),
}[S.wifiMsg] || '');
screens.wifi = () => {
  let face = null;
  return {
    html: `${hdrSub(t('wifi_setup'), { gear: false })}
      <div class="avatar-hero">${heroHTML({ full: false })}</div>
      <div class="hint" style="text-align:center;font-size:14.5px">${t('wifi_desc')}</div>
      <div class="field">${icon('wifi', 22)}<input id="wSsid" placeholder="${t('network')}" autocomplete="off" value="${esc(S.ssid)}"><button id="wScan" aria-label="scan" style="color:var(--acc)">${icon('refresh', 20)}</button></div>
      <div class="field">${icon('lock', 22)}<input id="wPass" type="password" placeholder="${t('password')}" autocomplete="off"><button id="wEye" style="color:var(--dim)">${icon('eye', 22)}</button></div>
      <div class="switch"><span>${t('auto_reconnect')}</span>${toggleHTML('wAuto', cfg.wifiAuto)}</div>
      <button class="btn pri" id="wGo">${t('connect')}</button>
      <div class="status-msg" id="wMsg"></div>`,
    mount(el) {
      face = new RobotFace(el.querySelector('.hero-face'), { viewY: 34, viewH: 140 }); face.setName('curious'); startFace(face);
      const msg = () => { const m = el.querySelector('#wMsg'); m.textContent = wifiMsgText(); m.className = 'status-msg ' + (S.wifiOk === true ? 'ok' : S.wifiOk === false ? 'bad' : ''); };
      msg();
      el.querySelector('#wEye').addEventListener('click', () => { const i = el.querySelector('#wPass'); i.type = i.type === 'password' ? 'text' : 'password'; el.querySelector('#wEye').innerHTML = icon(i.type === 'password' ? 'eye' : 'eyeoff', 22); });
      el.querySelector('#wAuto').addEventListener('toggle', (e) => { cfg.wifiAuto = e.detail; save(); L.send('WIFI:AUTO:' + (e.detail ? 1 : 0)); });
      const openScan = () => {
        if (!S.ble) { toast('need_ble'); return; }
        L.scanWifi();
        sheet(`<h3>${t('select_network')}</h3><div id="nets" style="display:flex;flex-direction:column;gap:8px"></div><div class="hint" id="scn">${t('scanning')}</div>`, (s) => {
          const draw = () => {
            s.querySelector('#nets').innerHTML = [...S.wifiNets].sort((a, b) => b.rssi - a.rssi).map((n, i) => `<button class="netrow" data-i="${i}">${icon(n.open ? 'wifi' : 'lock', 20)}<span>${esc(n.ssid)}</span>${barsHTML(rssiBars(n.rssi))}</button>`).join('');
            const sorted = [...S.wifiNets].sort((a, b) => b.rssi - a.rssi);
            s.querySelectorAll('.netrow').forEach((b) => b.addEventListener('click', () => { el.querySelector('#wSsid').value = sorted[+b.dataset.i].ssid; s.parentElement.remove(); el.querySelector('#wPass').focus(); }));
            s.querySelector('#scn').textContent = S.wifiMsg === 'scan_done' ? '' : t('scanning');
          };
          draw(); s._draw = draw; window.__wifiDraw = draw;
        });
      };
      el.querySelector('#wScan').addEventListener('click', openScan);
      el.querySelector('#wGo').addEventListener('click', () => {
        const ssid = el.querySelector('#wSsid').value.trim(); if (!ssid) return toast('enter_ssid');
        if (!L.sendWifi(ssid, el.querySelector('#wPass').value)) toast('need_ble'); else msg();
      });
      face._msg = msg;
    },
    update(what) { if (what === 'wifi') { const el = document.querySelector('.screen'); face?._msg?.(); window.__wifiDraw?.(); } },
    cleanup() { if (face) stopFace(face); window.__wifiDraw = null; },
  };
};

/* ---------- التحكم عن بُعد (MQTT) ---------- */
screens.remote = () => ({
  html: `${hdrSub(t('remote_title'), { gear: false })}
    <div class="hint">${t('remote_hint')}</div>
    <div class="lbl">${t('server_host')}</div><div class="field">${icon('globe', 22)}<input id="mHost" dir="ltr" placeholder="xxxxxxxx.s1.eu.hivemq.cloud" value="${esc(cfg.mHost)}" autocomplete="off"></div>
    <div class="grid2"><div><div class="lbl">${t('robot_port')}</div><div class="field"><input id="mRP" type="number" dir="ltr" value="${cfg.mRobotPort}"></div></div>
      <div><div class="lbl">${t('app_port')}</div><div class="field"><input id="mWP" type="number" dir="ltr" value="${cfg.mWssPort}"></div></div></div>
    <div class="lbl">${t('username')}</div><div class="field"><input id="mUser" dir="ltr" value="${esc(cfg.mUser)}" autocomplete="off"></div>
    <div class="lbl">${t('password')}</div><div class="field">${icon('lock', 22)}<input id="mPass" type="password" dir="ltr" value="${esc(cfg.mPass)}" autocomplete="off"></div>
    <div class="lbl">${t('robot_id')}</div><div class="field"><input id="mPre" dir="ltr" value="${esc(cfg.mPrefix)}" autocomplete="off"></div>
    <button class="btn pri" id="mSave">${t('save_connect')}</button>
    <button class="btn ghost" id="mRobot">${icon('bluetooth', 20)} ${t('send_robot')}</button>
    <div class="status-msg" id="mMsg"></div>`,
  mount(el) {
    const read = () => {
      cfg.mHost = el.querySelector('#mHost').value.trim().replace(/^(wss?|mqtts?|https?):\/\//, '').replace(/[:/].*$/, '');
      cfg.mRobotPort = parseInt(el.querySelector('#mRP').value) || 8883; cfg.mWssPort = parseInt(el.querySelector('#mWP').value) || 8884;
      cfg.mUser = el.querySelector('#mUser').value.trim(); cfg.mPass = el.querySelector('#mPass').value;
      cfg.mPrefix = el.querySelector('#mPre').value.trim().replace(/^\/+|\/+$/g, '') || cfg.mPrefix; save();
    };
    const m = el.querySelector('#mMsg'), say = (k, cls = '') => { m.textContent = t(k); m.className = 'status-msg ' + cls; };
    if (S.net) say('srv_connected', 'ok');
    el.querySelector('#mSave').addEventListener('click', () => { read(); const e = L.mqttConnect(); if (e) say(e, 'bad'); else say('srv_connecting'); });
    el.querySelector('#mRobot').addEventListener('click', () => {
      read(); if (!cfg.mHost || !cfg.mUser || !cfg.mPass) return say('srv_missing', 'bad');
      const e = L.sendCloudConfig(); if (e) return toast(e === 'need_ble' ? 'need_ble' : 'error'); say('robot_sent');
    });
  },
  update(what) {
    if (what !== 'conn') return; const m = document.querySelector('#mMsg'); if (!m) return;
    if (S.cloudMsg) { m.textContent = t(S.cloudMsg); m.className = 'status-msg ' + (S.cloudMsg === 'robot_cloud_ok' ? 'ok' : ''); }
    else if (S.net) { m.textContent = t('srv_connected'); m.className = 'status-msg ok'; }
  },
});

/* ---------- إعدادات Gemini ---------- */
const MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];
screens.gemini = () => ({
  html: `${hdrSub(t('gemini_settings'), { gear: false })}
    <div class="gem-logo">Gemini <span>✦</span></div>
    <div class="lbl">${t('api_key')}</div><div class="field"><input id="gKey" type="password" dir="ltr" value="${esc(cfg.gemKey)}" autocomplete="off" placeholder="AIza..."><button id="gEye" style="color:var(--dim)">${icon('eye', 22)}</button></div>
    <div class="hint">${t('key_hint')}</div>
    <div class="lbl">${t('model')}</div><div class="field"><select id="gModel">${[...new Set([cfg.gemModel, ...MODELS])].map((m) => `<option ${m === cfg.gemModel ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select>${icon('down', 20)}</div>
    <div class="lbl">${t('voice_lang')}</div><div class="field">${icon('mic', 20)}<select id="gLang"><option value="ar-EG" ${cfg.voiceLang === 'ar-EG' ? 'selected' : ''}>${t('arabic')}</option><option value="en-US" ${cfg.voiceLang === 'en-US' ? 'selected' : ''}>${t('english')}</option></select>${icon('down', 20)}</div>
    <div class="card"><div class="switch"><span>${t('voice_resp')}</span>${toggleHTML('gVoice', cfg.voiceResp)}</div>
      <div class="switch"><span>${t('text_resp')}</span>${toggleHTML('gText', cfg.textResp)}</div>
      <div class="switch"><span>${t('enable_conv')}</span>${toggleHTML('gConv', cfg.converse)}</div></div>
    <div class="lbl">${t('persona')}</div><div class="field"><textarea id="gPersona" rows="3">${esc(cfg.persona)}</textarea></div>
    <button class="btn pri" id="gSave">${t('save')}</button>`,
  mount(el) {
    const st = { gVoice: cfg.voiceResp, gText: cfg.textResp, gConv: cfg.converse };
    ['gVoice', 'gText', 'gConv'].forEach((id) => el.querySelector('#' + id).addEventListener('toggle', (e) => { st[id] = e.detail; }));
    el.querySelector('#gEye').addEventListener('click', () => { const i = el.querySelector('#gKey'); i.type = i.type === 'password' ? 'text' : 'password'; });
    el.querySelector('#gSave').addEventListener('click', () => {
      cfg.gemKey = el.querySelector('#gKey').value.trim(); cfg.gemModel = el.querySelector('#gModel').value; cfg.voiceLang = el.querySelector('#gLang').value;
      cfg.voiceResp = st.gVoice; cfg.textResp = st.gText; cfg.converse = st.gConv; cfg.persona = el.querySelector('#gPersona').value; save(); toast('saved');
    });
  },
});

/* ---------- حالة الروبوت ---------- */
screens.status = () => {
  let timer = 0;
  const rows = () => {
    const known = S.batt >= 0, tempOk = S.temp != null && S.temp < 65;
    return `
    <div class="stat-row">${avatarHTML(52)}<div class="txt"><b style="font-size:17px">${esc(S.bleName || cfg.devices[0]?.name || 'Celyah')}</b><small class="${isOnline() ? 'good' : ''}"><span class="dot ${isOnline() ? '' : 'off'}"></span> ${isOnline() ? t('online') : t('offline')}</small></div></div>
    <div class="stat-row"><span class="tile t-green">${icon('battery', 26)}</span><div class="txt"><div style="display:flex;justify-content:space-between"><b>${t('battery')}</b><b>${known ? num(S.batt + '%') : '--'}</b></div><div class="pbar"><i style="width:${known ? S.batt : 0}%"></i></div><small>${known ? (S.charging ? t('charging') : t('on_battery')) : t('battery_unknown')}</small></div></div>
    <div class="stat-row"><span class="tile t-blue">${icon('wifi', 26)}</span><div class="txt"><b>${t('wifi')}</b><small class="good">${esc(S.ssid) || '—'}</small></div><div class="val ${S.ssid ? 'good' : ''}">${S.ssid ? t('connected') : t('not_connected')} ${S.ssid && S.rssi ? barsHTML(rssiBars(S.rssi)) : ''}</div></div>
    <div class="stat-row"><span class="tile t-blue" style="background:linear-gradient(180deg,#3a8cff,#1450c8)">${icon('globe', 26)}</span><div class="txt"><b>${t('internet')}</b></div><div class="val ${S.cloud || S.net ? 'good' : ''}">${S.cloud || S.net ? t('connected') : t('not_connected')}</div></div>
    <div class="stat-row"><span class="tile t-violet">${icon('bluetooth', 26)}</span><div class="txt"><b>${t('bluetooth')}</b><small class="good">${S.ble ? esc(S.bleName) : ''}</small></div><div class="val ${S.ble ? 'good' : ''}">${S.ble ? t('connected') : t('not_connected')}</div></div>
    <div class="grid2s">
      <div class="mini"><span class="tile t-red">${icon('thermo', 20)}</span><div><b>${S.temp != null ? num(Math.round(S.temp) + '°C') : '--'}</b><small class="${tempOk ? 'good' : ''}">${S.temp == null ? '' : tempOk ? t('normal') : t('hot')}</small></div></div>
      <div class="mini"><span class="tile t-blue">${icon('disk', 20)}</span><div><b>${S.heap != null ? num(S.heap + ' KB') : '--'}</b><small>${t('memory')}</small></div></div>
      <div class="mini"><span class="tile t-violet">${icon('bolt', 20)}</span><div><b>${S.energy != null ? num(Math.round(S.energy) + '%') : '--'}</b><small>${t('energy')}</small></div></div>
      <div class="mini"><span class="tile t-grey">${icon('robot', 20)}</span><div><b>${S.upMin != null ? S.upMin + ' ' + t('min') : '--'}</b><small>${t('uptime')}</small></div></div>
    </div>`;
  };
  return {
    html: `${hdrSub(t('robot_status'), { gear: false })}<div id="rows" style="display:flex;flex-direction:column;gap:12px">${rows()}</div>`,
    mount() { L.send('STATUS'); timer = setInterval(() => L.send('STATUS'), 5000); },
    update(what) { if (['stat', 'conn', 'wifi'].includes(what)) { const r = document.querySelector('#rows'); if (r) r.innerHTML = rows(); } },
    cleanup() { clearInterval(timer); },
  };
};

/* ---------- الإعدادات ---------- */
const SET_ROWS = [
  ['status', 'robot', 't-green', 'robot_status', null], ['connection', 'bluetooth', 't-orange', 'set_connection', null], ['wifi', 'wifi', 't-blue', 'set_wifi', null],
  ['remote', 'globe', 't-violet', 'set_remote', null], ['set_camera', 'camera', 't-pink', 'set_camera', null], ['set_ai', 'spark', 't-red', 'set_ai', null],
  ['set_move', 'move', 't-orange', 'set_move', null], ['set_display', 'monitor', 't-cyan', 'set_display', null], ['set_notif', 'bell', 't-yellow', 'set_notif', null], ['about', 'info', 't-grey', 'set_about', null],
];
screens.settings = () => ({
  nav: 'settings',
  html: `${hdrSub(t('settings'), { gear: false, back: false })}
    <div class="card list">${SET_ROWS.map(([s, ic, cl, k]) => `<button class="row" data-go="${s === 'set_ai' ? 'gemini' : s}"><span class="tile ${cl}">${icon(ic, 22)}</span><span class="txt"><b>${t(k)}</b></span>${icon('right', 20, 'rtl-flip chev')}</button>`).join('')}</div>`,
});

const segHTML = (id, items, cur) => `<div class="seg" id="${id}">${items.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(cur) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
function bindSeg(el, id, fn) { el.querySelectorAll(`#${id} button`).forEach((b) => b.addEventListener('click', () => { el.querySelectorAll(`#${id} button`).forEach((x) => x.classList.toggle('on', x === b)); fn(b.dataset.v); })); }

screens.set_camera = () => ({
  html: `${hdrSub(t('set_camera'), { gear: false })}
    <div class="lbl">${t('resolution')}</div>${segHTML('rs', [[0, t('res_low')], [1, t('res_hd')]], cfg.camRes)}
    <div class="lbl">${t('quality')}</div>${segHTML('qs', [[10, t('q_high')], [14, t('q_med')], [24, t('q_low')]], cfg.camQ)}
    <div class="card"><div class="switch"><span>${t('auto_start')}</span>${toggleHTML('ca', cfg.camAuto)}</div></div>`,
  mount(el) {
    bindSeg(el, 'rs', (v) => { cfg.camRes = +v; save(); L.send('CAMRES:' + v); });
    bindSeg(el, 'qs', (v) => { cfg.camQ = +v; save(); L.send('CAMQ:' + v); });
    el.querySelector('#ca').addEventListener('toggle', (e) => { cfg.camAuto = e.detail; save(); });
  },
});
screens.set_move = () => ({
  html: `${hdrSub(t('set_move'), { gear: false })}
    <div class="lbl">${t('default_speed')}: <b id="spV" dir="ltr">${cfg.speed}%</b></div><input type="range" id="sp" min="10" max="100" step="5" value="${cfg.speed}">
    <div class="lbl">${t('activity')}</div>${segHTML('ls', [[1, t('calm')], [2, t('active')], [3, t('hyper')]], cfg.live)}
    <div class="card"><div class="switch"><span>${t('idle_wheels')}</span>${toggleHTML('iw', cfg.idleWheels)}</div><div class="hint">${t('idle_hint')}</div></div>`,
  mount(el) {
    const sp = el.querySelector('#sp');
    sp.addEventListener('input', () => { el.querySelector('#spV').textContent = sp.value + '%'; });
    sp.addEventListener('change', () => { cfg.speed = +sp.value; save(); L.send('SPEED:' + cfg.speed); });
    bindSeg(el, 'ls', (v) => { cfg.live = +v; save(); L.send('LIVE:' + v); });
    el.querySelector('#iw').addEventListener('toggle', (e) => { cfg.idleWheels = e.detail; save(); L.send('IDLEWHEELS:' + (e.detail ? 'ON' : 'OFF')); });
  },
});
screens.set_display = () => ({
  html: `${hdrSub(t('set_display'), { gear: false })}
    <div class="lbl">${t('language')}</div>${segHTML('lg', [['ar', 'العربية'], ['en', 'English']], cfg.lang)}
    <div class="lbl">${t('rotation')}</div>${segHTML('rt', [[0, t('rot0')], [1, t('rot1')], [2, t('rot2')], [3, t('rot3')]], cfg.rot)}`,
  mount(el) {
    bindSeg(el, 'lg', (v) => { cfg.lang = v; save(); applyLang(); rerender(); });
    bindSeg(el, 'rt', (v) => { cfg.rot = +v; save(); L.send('ROT:' + v); });
  },
});
screens.set_notif = () => ({
  html: `${hdrSub(t('set_notif'), { gear: false })}
    <div class="card"><div class="switch"><span>${t('notif_offline')}</span>${toggleHTML('n1', cfg.notifOffline)}</div><div class="switch"><span>${t('notif_batt')}</span>${toggleHTML('n2', cfg.notifBattery)}</div></div>`,
  mount(el) {
    el.querySelector('#n1').addEventListener('toggle', (e) => { cfg.notifOffline = e.detail; save(); });
    el.querySelector('#n2').addEventListener('toggle', (e) => { cfg.notifBattery = e.detail; save(); });
  },
});
screens.about = () => ({
  html: `${hdrSub(t('set_about'), { gear: false })}
    <div class="avatar-hero">${avatarHTML(96)}</div>
    <div class="card"><div class="h2" style="margin:0">${t('app')} ♥</div><div class="hint">${t('about_ver')}: 1.0.0</div><p class="hint" style="font-size:14px">${t('about_text')}</p></div>
    <div class="card"><div class="h2" style="margin:0">${t('privacy')}</div><p class="hint" style="font-size:14px">${t('privacy_text')}</p></div>`,
});
screens.manage = () => ({
  html: `${hdrSub(t('manage_devices'), { gear: false })}
    <div class="card list">${cfg.devices.length ? cfg.devices.map((d, i) => `<div class="row">${avatarHTML(44)}<span class="txt"><b>${esc(d.name)}</b><small>${esc(d.model)}</small></span>
      <button class="icon-btn" data-ren="${i}" aria-label="${t('rename')}">${icon('edit', 18)}</button><button class="icon-btn" data-del="${i}" aria-label="${t('forget')}" style="color:#ff8aa0">${icon('trash', 18)}</button></div>`).join('') : `<div class="hint" style="padding:12px">${t('no_devices')}</div>`}</div>`,
  mount(el) {
    el.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => { cfg.devices.splice(+b.dataset.del, 1); save(); rerender(); }));
    el.querySelectorAll('[data-ren]').forEach((b) => b.addEventListener('click', () => {
      const d = cfg.devices[+b.dataset.ren];
      sheet(`<h3>${t('robot_name')}</h3><div class="field"><input id="rn" value="${esc(d.name)}"></div><button class="btn pri" id="rs">${t('save')}</button>`, (s, close) =>
        s.querySelector('#rs').addEventListener('click', () => { d.name = s.querySelector('#rn').value.trim() || d.name; d.custom = true; save(); close(); rerender(); }));
    }));
  },
});

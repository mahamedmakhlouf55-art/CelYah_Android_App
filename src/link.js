// الاتصال بالروبوت: بلوتوث (محلي) + MQTT (من أي مكان) + قراءة الأحداث الجاية منه
import { cfg, save, S, emit, rand } from './store.js';

export const NUS = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const NUS_RX = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';   // التطبيق -> الروبوت
const NUS_TX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';   // الروبوت -> التطبيق
const enc = new TextEncoder(), dec = new TextDecoder();
export const b64 = (s) => btoa(String.fromCharCode(...enc.encode(s)));
export const unb64 = (s) => { try { return dec.decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0))); } catch { return s; } };

export const hooks = { toast: () => {}, chatLine: () => {}, video: () => {} };
const faces = new Set();
export const attachFace = (f) => faces.add(f);
export const detachFace = (f) => faces.delete(f);

export const isNative = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
export const bleSupported = () => isNative() || !!navigator.bluetooth;

/* ===================== بلوتوث ===================== */
let nativeLib = null, devId = null, webRx = null, webDev = null, bleBuf = '', bleQ = Promise.resolve();
async function nativeBle() {
  if (!nativeLib) nativeLib = (await import('@capacitor-community/bluetooth-le')).BleClient;
  return nativeLib;
}
function bleData(text) {
  bleBuf += text;
  let i;
  while ((i = bleBuf.indexOf('\n')) >= 0) { const l = bleBuf.slice(0, i).trim(); bleBuf = bleBuf.slice(i + 1); if (l) handleLine(l, 'ble'); }
}
function bleLost() {
  S.ble = false; devId = null; webRx = null; emit('conn');
  if (cfg.notifOffline) hooks.toast('toast_offline');
}

export async function bleConnect(savedId) {
  if (isNative()) {
    const B = await nativeBle();
    await B.initialize({ androidNeverForLocation: true });
    let id = savedId, name = 'Celyah';
    if (!id) { const d = await B.requestDevice({ services: [NUS] }); id = d.deviceId; name = d.name || name; }
    await B.connect(id, () => bleLost());
    await B.startNotifications(id, NUS, NUS_TX, (dv) => bleData(dec.decode(new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength))));
    devId = id; S.bleName = name;
    rememberDevice(id, name);
  } else if (navigator.bluetooth) {
    webDev = await navigator.bluetooth.requestDevice({ filters: [{ services: [NUS] }], optionalServices: [NUS] });
    webDev.addEventListener('gattserverdisconnected', bleLost);
    const srv = await webDev.gatt.connect(), svc = await srv.getPrimaryService(NUS);
    webRx = await svc.getCharacteristic(NUS_RX);
    const tx = await svc.getCharacteristic(NUS_TX);
    await tx.startNotifications();
    tx.addEventListener('characteristicvaluechanged', (ev) => bleData(dec.decode(ev.target.value)));
    S.bleName = webDev.name || 'Celyah';
    rememberDevice(webDev.id || S.bleName, S.bleName);
  } else throw new Error('unsupported');
  S.ble = true; emit('conn');
  hooks.toast('toast_conn');
  bleRaw('APP:1'); bleRaw('CLOUD:STATUS'); bleRaw('WIFI:STATUS'); bleRaw('STATUS');
  setTimeout(syncSettings, 800);
}
export async function bleDisconnect() {
  try { if (isNative()) { const B = await nativeBle(); if (devId) await B.disconnect(devId); } else webDev?.gatt?.disconnect(); } catch {}
  S.ble = false; devId = null; webRx = null; emit('conn');
}
function bleRaw(line) {
  const bytes = enc.encode(line + '\n');
  bleQ = bleQ.then(async () => {
    for (let i = 0; i < bytes.length; i += 20) {
      const chunk = bytes.slice(i, i + 20);
      if (isNative()) { const B = await nativeBle(); await B.writeWithoutResponse(devId, NUS, NUS_RX, new DataView(chunk.buffer)); }
      else if (webRx.writeValueWithoutResponse) await webRx.writeValueWithoutResponse(chunk); else await webRx.writeValue(chunk);
    }
  }).catch((e) => console.warn('BLE write', e));
}
function rememberDevice(id, name) {
  const d = cfg.devices.find((x) => x.id === id);
  if (d) { if (!d.custom) d.name = name; } else cfg.devices.unshift({ id, name, model: 'ESP32-S3', custom: false });
  save();
}

/* ===================== إنترنت (MQTT) ===================== */
let mq = null;
export function mqttConnect() {
  if (mq) { try { mq.end(true); } catch {} mq = null; }
  S.net = false; S.robotOnline = null; emit('conn');
  if (!cfg.mHost || !cfg.mPrefix) return 'srv_missing';
  if (typeof mqtt === 'undefined') return 'srv_lib';
  mq = mqtt.connect(`wss://${cfg.mHost}:${cfg.mWssPort}/mqtt`, { username: cfg.mUser, password: cfg.mPass, clientId: 'celyah-app-' + rand(8), reconnectPeriod: 3000, connectTimeout: 10000, clean: true });
  mq.on('connect', () => {
    S.net = true; emit('conn');
    mq.subscribe([cfg.mPrefix + '/evt', cfg.mPrefix + '/status', cfg.mPrefix + '/video']);
    sendNet('VIEW:1'); setTimeout(syncSettings, 1500);
  });
  mq.on('close', () => { S.net = false; emit('conn'); });
  mq.on('error', (e) => { S.wifiMsg = e.message; console.warn('MQTT', e.message); });
  mq.on('message', (topic, payload) => {
    if (topic.endsWith('/video')) return hooks.video(payload);
    const text = dec.decode(payload).trim();
    if (topic.endsWith('/status')) {
      const was = S.robotOnline; S.robotOnline = text === 'online'; emit('conn');
      if (was === true && !S.robotOnline && cfg.notifOffline) hooks.toast('toast_offline');
      if (S.robotOnline) setTimeout(() => sendNet('STATUS'), 500);
      return;
    }
    text.split('\n').forEach((l) => { if (l) handleLine(l.trim(), 'net'); });
  });
  return null;
}
export function mqttDisconnect() { try { mq?.end(true); } catch {} mq = null; S.net = false; emit('conn'); }
export const mqttReady = () => !!(mq && S.net);

/* ===================== إرسال ===================== */
export function send(cmd) {
  if (S.ble) { bleRaw(cmd); return true; }
  if (S.net && mq) { mq.publish(cfg.mPrefix + '/cmd', cmd); return true; }
  return false;
}
export function sendNet(cmd) { if (S.net && mq) { mq.publish(cfg.mPrefix + '/cmd', cmd); return true; } return false; }
export function sendBle(cmd) { if (S.ble) { bleRaw(cmd); return true; } return false; }
export const requestStatus = () => send('STATUS');

// يبعت إعدادات التطبيق للروبوت (السرعة، النشاط، الدوران...) عشان تتطبق بعد أي اتصال
export function syncSettings() {
  if (!(S.ble || S.net)) return;
  send('SPEED:' + cfg.speed); send('LIVE:' + cfg.live); send('ROT:' + cfg.rot);
  send('IDLEWHEELS:' + (cfg.idleWheels ? 'ON' : 'OFF')); send('WIFI:AUTO:' + (cfg.wifiAuto ? 1 : 0));
  send('CAMRES:' + cfg.camRes); send('CAMQ:' + cfg.camQ);
}

/* ===================== قراءة الأحداث ===================== */
export function handleLine(l, src) {
  if (l.startsWith('ST:')) {                       // وش لايف: ST:face|gx|gy|blink|asleep
    const p = l.slice(3).split('|');
    S.face = p[0]; S.asleep = p[4] === '1';
    faces.forEach((f) => { f.setName(p[0]); f.telemetry(parseFloat(p[1]) || 0, parseFloat(p[2]) || 0, parseFloat(p[3]) || 0, S.asleep); });
    return;
  }
  if (src === 'net' && S.ble && !/^(CLOUD:|ERR:|STAT:)/.test(l)) return;   // تجاهل التكرار لما البلوتوث متصل
  if (l.startsWith('FACE:')) { S.face = l.slice(5); faces.forEach((f) => f.setName(S.face)); emit('face'); }
  else if (l.startsWith('STAT:')) {
    if (l.startsWith('STAT:s=')) S.ssid = unb64(l.slice(7));
    else l.slice(5).split('|').forEach((kv) => {
      const [k, v] = kv.split('='), n = parseFloat(v);
      if (k === 'b') S.batt = n; else if (k === 'c') S.charging = n === 1; else if (k === 'r') S.rssi = n; else if (k === 't') S.temp = n;
      else if (k === 'e') S.energy = n; else if (k === 'u') S.upMin = n; else if (k === 'h') S.heap = n; else if (k === 'n') S.cloud = n === 1; else if (k === 'm') S.mode = n ? 'AUTO' : 'MANUAL';
    });
    if (S.batt >= 0 && S.batt < 20 && !S.charging && cfg.notifBattery && !handleLine._lowShown) { handleLine._lowShown = true; hooks.toast('toast_batt'); }
    if (S.batt >= 30) handleLine._lowShown = false;
    emit('stat');
  }
  else if (l.startsWith('WIFI:AP:')) { const p = l.slice(8).split('|'); S.wifiNets.push({ ssid: unb64(p[0]), rssi: +p[1], open: p[2] === 'OPEN' }); emit('wifi'); }
  else if (l === 'WIFI:SCANNING') { S.wifiNets = []; S.wifiMsg = 'scanning'; emit('wifi'); }
  else if (l === 'WIFI:SCAN_DONE') { S.wifiMsg = 'scan_done'; emit('wifi'); }
  else if (l.startsWith('WIFI:CONNECTING:')) { S.wifiMsg = 'connecting'; S.ssid = l.slice(16); S.wifiOk = null; emit('wifi'); }
  else if (l.startsWith('WIFI:CONNECTED:')) { S.wifiMsg = 'connected'; S.wifiOk = true; emit('wifi'); setTimeout(() => send('STATUS'), 400); }
  else if (l === 'WIFI:FAILED') { S.wifiMsg = 'failed'; S.wifiOk = false; emit('wifi'); }
  else if (l === 'WIFI:DISCONNECTED') { S.wifiMsg = 'none'; S.wifiOk = false; emit('wifi'); }
  else if (l === 'CLOUD:ONLINE') { S.robotOnline = true; S.cloudMsg = 'robot_cloud_ok'; emit('conn'); }
  else if (l === 'CLOUD:OFFLINE') { S.cloudMsg = 'robot_cloud_wait'; emit('conn'); }
  else if (l === 'CLOUD:NOCFG') { S.cloudMsg = 'robot_cloud_nocfg'; emit('conn'); }
  else if (l === 'CLOUD:HASCAM') { S.hasCam = true; const d = cfg.devices[0]; if (d && !d.custom) d.model = 'ESP32-S3-CAM'; save(); emit('conn'); }
  else if (l === 'CLOUD:NOCAM') { S.hasCam = false; emit('conn'); }
  else if (l === 'CLOUD:CAM:0') { S.camRunning = false; emit('cam'); }
  else if (l === 'ERR:CAM') { S.camRunning = false; S.camInfo = 'cam_err'; emit('cam'); }
  else if (l.startsWith('CHAT:')) hooks.chatLine(l.slice(5));
}

/* ===================== مفاتيح الصيانة ===================== */
let timers = [];
export function startLinkTimers() {
  timers.forEach(clearInterval);
  timers = [
    setInterval(() => { if (S.net) sendNet('VIEW:1'); }, 15000),            // استمرار بث وش الروبوت
    setInterval(() => { if (S.ble || S.net) send('STATUS'); }, 20000),      // تحديث الحالة
  ];
}
// اتصال تلقائي بآخر جهاز / سيرفر
export async function autoConnect() {
  if (cfg.mHost) mqttConnect();
  if (isNative() && cfg.devices.length) { try { await bleConnect(cfg.devices[0].id); } catch (e) { console.warn('auto BLE', e); } }
}
export function sendCloudConfig() {
  if (!S.ble) return 'need_ble';
  const line = `CLOUD:SET:${b64(cfg.mHost)}|${cfg.mRobotPort}|${b64(cfg.mUser)}|${b64(cfg.mPass)}|${b64(cfg.mPrefix)}`;
  if (line.length > 250) return 'too_long';
  bleRaw(line); setTimeout(() => bleRaw('CLOUD:STATUS'), 6000); setTimeout(() => bleRaw('CLOUD:STATUS'), 14000);
  return null;
}
export function sendWifi(ssid, pass) {
  if (!S.ble) return false;
  bleRaw('WIFI:SET:' + b64(ssid) + '|' + b64(pass)); S.wifiMsg = 'sent'; emit('wifi'); return true;
}
export const scanWifi = () => { if (!S.ble) return false; S.wifiNets = []; S.wifiMsg = 'scanning'; emit('wifi'); bleRaw('WIFI:SCAN'); return true; };

// الإعدادات المحفوظة + حالة التطبيق اللحظية
const KEY = 'celyah.app.v1';
export const rand = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join('');

const defaults = {
  lang: 'ar', onboarded: false,
  gemKey: '', gemModel: 'gemini-flash-latest', voiceLang: 'ar-EG', voiceResp: true, textResp: true, converse: false, persona: '',
  mHost: '', mUser: '', mPass: '', mPrefix: 'celyah/' + rand(12), mRobotPort: 8883, mWssPort: 8884,
  wifiAuto: true, camRes: 0, camQ: 14, camAuto: true,
  speed: 60, idleWheels: true, live: 2, rot: 1, notifOffline: true, notifBattery: true,
  devices: [], chat: [],
};

function load() {
  try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return { ...defaults }; }
}
export const cfg = load();
export function save() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch {} }
save();

// حالة لحظية (مش بتتحفظ)
export const S = {
  ble: false, bleName: '', net: false, robotOnline: null, hasCam: null,
  camRunning: false, mode: 'AUTO', face: 'normal', asleep: false,
  batt: -1, charging: false, rssi: 0, temp: null, energy: null, upMin: null, ssid: '', heap: null, cloud: null,
  wifiNets: [], wifiMsg: '', wifiOk: null, camInfo: '',
};
export const isOnline = () => S.ble || (S.net && S.robotOnline !== false);

const subs = new Set();
export const onChange = (fn) => { subs.add(fn); return () => subs.delete(fn); };
export const emit = (what = '*') => subs.forEach((f) => { try { f(what); } catch (e) { console.error(e); } });

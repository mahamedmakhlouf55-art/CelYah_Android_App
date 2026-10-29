// رسم وش الروبوت على Canvas (نسخة JavaScript من كود الروبوت - نفس الأشكال والألوان)
export const FACES = [{"en":"normal","ar":"عادي","l":[0,0,0,0,30,0],"r":[0,0,0,0,30,0],"fx":0},{"en":"happy","ar":"سعيد","l":[0,0,0,0,0,6],"r":[0,0,0,0,0,6],"fx":0},{"en":"excited","ar":"متحمس","l":[0,0,0,0,32,2],"r":[0,0,0,0,32,2],"fx":8},{"en":"love","ar":"محب","l":[0,0,0,0,32,3],"r":[0,0,0,0,32,3],"fx":64},{"en":"wink","ar":"غمز","l":[0,0,0,0,30,0],"r":[0,0,0,0,0,6],"fx":0},{"en":"playful","ar":"مرح","l":[0,0,0,0,0,6],"r":[0,0,0,0,30,0],"fx":0},{"en":"curious","ar":"فضولي","l":[0,0,0,0,38,0],"r":[0,0,0,0,38,0],"fx":0},{"en":"lookleft","ar":"ينظر لليسار","l":[0,0,-45,0,30,0],"r":[0,0,-45,0,30,0],"fx":131072},{"en":"lookright","ar":"ينظر لليمين","l":[0,0,45,0,30,0],"r":[0,0,45,0,30,0],"fx":131072},{"en":"lookup","ar":"ينظر لأعلى","l":[0,0,0,-45,30,0],"r":[0,0,0,-45,30,0],"fx":131072},{"en":"lookdown","ar":"ينظر لأسفل","l":[22,0,0,45,28,0],"r":[22,0,0,45,28,0],"fx":131072},{"en":"surprised","ar":"مندهش","l":[0,0,0,0,30,5],"r":[0,0,0,0,30,5],"fx":8},{"en":"angry","ar":"غاضب","l":[25,28,0,8,30,0],"r":[25,28,0,8,30,0],"fx":0},{"en":"grumpy","ar":"متضايق","l":[40,8,0,10,28,0],"r":[40,8,0,10,28,0],"fx":0},{"en":"sad","ar":"حزين","l":[28,-22,0,12,30,0],"r":[28,-22,0,12,30,0],"fx":2},{"en":"scared","ar":"خائف","l":[0,0,0,0,22,0],"r":[0,0,0,0,22,0],"fx":2560},{"en":"sleepy","ar":"نعسان","l":[0,0,0,0,0,7],"r":[0,0,0,0,0,7],"fx":16},{"en":"bored","ar":"زهقان","l":[50,0,0,10,26,0],"r":[50,0,0,10,26,0],"fx":0},{"en":"confused","ar":"مرتبك","l":[0,0,0,0,30,0],"r":[10,-8,10,-10,30,0],"fx":32},{"en":"dizzy","ar":"دوخان","l":[0,0,0,0,40,4],"r":[0,0,0,0,40,4],"fx":0},{"en":"skeptical","ar":"مريب","l":[38,0,0,5,28,0],"r":[28,16,0,5,28,0],"fx":0},{"en":"mischievous","ar":"مشاغب","l":[30,20,0,6,28,0],"r":[30,20,0,6,28,0],"fx":8},{"en":"shy","ar":"خجول","l":[0,0,-20,18,30,0],"r":[0,0,-20,18,30,0],"fx":131073},{"en":"crying","ar":"يبكي","l":[0,0,0,5,38,0],"r":[0,0,0,5,38,0],"fx":4},{"en":"laughing","ar":"يضحك","l":[0,0,0,0,0,8],"r":[0,0,0,0,0,9],"fx":1024},{"en":"focused","ar":"مركز","l":[38,16,0,6,24,0],"r":[38,16,0,6,24,0],"fx":0},{"en":"proud","ar":"فخور","l":[0,0,0,-10,34,0],"r":[0,0,0,-10,34,0],"fx":8},{"en":"thinking","ar":"يفكر","l":[0,0,35,-40,30,0],"r":[0,0,35,-40,30,0],"fx":131200},{"en":"shocked","ar":"مصدوم","l":[0,0,0,0,24,5],"r":[0,0,0,0,24,5],"fx":256},{"en":"adorable","ar":"لطيف","l":[0,0,0,0,0,6],"r":[0,0,0,0,0,6],"fx":64},{"en":"loading","ar":"جاري التحميل","l":[0,0,0,0,40,10],"r":[0,0,0,0,40,10],"fx":4096},{"en":"battery","ar":"البطارية","l":[0,0,0,0,40,11],"r":[0,0,0,0,40,12],"fx":0},{"en":"charging","ar":"جاري الشحن","l":[0,0,0,0,40,13],"r":[0,0,0,0,40,13],"fx":8192},{"en":"connecting","ar":"جاري الاتصال","l":[0,0,0,0,40,14],"r":[0,0,0,0,40,14],"fx":16384},{"en":"error","ar":"خطأ","l":[0,0,0,0,40,15],"r":[0,0,0,0,40,15],"fx":32768},{"en":"complete","ar":"اكتمل","l":[0,0,0,0,40,3],"r":[0,0,0,0,40,3],"fx":65544},{"en":"worried","ar":"قلقان","l":[10,-14,-12,8,22,0],"r":[10,-14,-12,8,22,0],"fx":2048},{"en":"embarrassed","ar":"محرج","l":[18,0,-25,18,22,0],"r":[18,0,-25,18,22,0],"fx":133121},{"en":"disappointed","ar":"محبط","l":[35,-12,0,25,26,0],"r":[35,-12,0,25,26,0],"fx":0},{"en":"relieved","ar":"مرتاح","l":[0,0,0,0,0,7],"r":[0,0,0,0,0,7],"fx":2048},{"en":"touched","ar":"متأثر","l":[0,0,0,0,0,6],"r":[0,0,0,0,0,6],"fx":3},{"en":"smug","ar":"واثق","l":[40,0,18,-8,28,0],"r":[40,0,18,-8,28,0],"fx":131080},{"en":"goofy","ar":"عبيط","l":[0,0,40,0,30,0],"r":[0,0,-40,0,30,0],"fx":132096},{"en":"pleading","ar":"يترجى","l":[8,-16,0,-6,40,0],"r":[8,-16,0,-6,40,0],"fx":8},{"en":"dreamy","ar":"حالم","l":[20,0,25,-30,28,2],"r":[20,0,25,-30,28,2],"fx":136},{"en":"panic","ar":"مذعور","l":[0,0,0,0,14,0],"r":[0,0,0,0,14,0],"fx":2816}];
export const faceData = { batteryPct: 80, loadPct: -1 };
const now = () => performance.now();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let fx = null;   // سياق الرسم الحالي (بيتغير حسب الوش اللي بيترسم)

const EW = 100, EH = 108, LEX = 10, REX = 130, EY0 = 66;
const rc = (r, g, b) => `rgb(${Math.min(255, Math.round(r * 1.25))},${g},${b})`;
const COL = { body: rc(185, 105, 250), glow: rc(95, 30, 165), light: rc(235, 195, 255), dark: rc(35, 0, 65), white: "#fff",
  pink: rc(255, 130, 210), blue: rc(110, 140, 255), line: rc(70, 15, 125), low: rc(205, 140, 255) };
const FXF = { BLUSH: 1, TEAR: 2, TEARBIG: 4, SPARK: 8, ZZZ: 16, Q: 32, HEARTS: 64, THOUGHT: 128, LINES: 256, SHAKE: 512, JIGGLE: 1024, SWEAT: 2048,
  BAR_LOAD: 4096, BAR_CHG: 8192, DOTS: 16384, BAR_ERR: 32768, BAR_DONE: 65536, NOGAZE: 131072 };
const S = { NORM: 0, NONE: 1, STAR: 2, HEART: 3, SPIRAL: 4, RING: 5, ARC_UP: 6, ARC_DN: 7, CHEV_R: 8, CHEV_L: 9, SPINNER: 10, BATT: 11, PCT: 12, BOLT: 13, WIFI: 14, X: 15 };

function rr(x, y, w, h, r, f) { fx.beginPath(); fx.roundRect(x, y, w, h, r); fx.fillStyle = f; fx.fill(); }
function circ(x, y, r, f) { fx.beginPath(); fx.arc(x, y, Math.max(0, r), 0, 6.2832); fx.fillStyle = f; fx.fill(); }
function tri(a, b, c, d, e, f, col) { fx.beginPath(); fx.moveTo(a, b); fx.lineTo(c, d); fx.lineTo(e, f); fx.closePath(); fx.fillStyle = col; fx.fill(); }
function line(a, b, c, d, col) { fx.beginPath(); fx.moveTo(a, b); fx.lineTo(c, d); fx.strokeStyle = col; fx.lineWidth = 1.2; fx.stroke(); }
function heart(x, y, s, c) { const r = Math.max(2, s / 2); circ(x - r, y, r + 1, c); circ(x + r, y, r + 1, c); tri(x - 2 * r + 1, y + r / 3, x + 2 * r - 1, y + r / 3, x, y + 2 * r + r / 3, c); }
function star(cx, cy, R, c) {
  const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? R * 0.45 : R; p.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
  for (let i = 0; i < 10; i++) tri(cx, cy, p[i][0], p[i][1], p[(i + 1) % 10][0], p[(i + 1) % 10][1], c);
}
function spark(x, y, s, c) { tri(x, y - s, x - s / 4, y, x + s / 4, y, c); tri(x, y + s, x - s / 4, y, x + s / 4, y, c); tri(x - s, y, x, y - s / 4, x, y + s / 4, c); tri(x + s, y, x, y - s / 4, x, y + s / 4, c); }
function arc(cx, cy, r, a0, a1, th, c) { for (let a = a0; a <= a1; a += 3) { const q = a * Math.PI / 180; circ(cx + Math.cos(q) * r, cy + Math.sin(q) * r, th / 2, c); } }
function drop(x, y, s, c) { circ(x, y + s / 2, s / 2 + 1, c); tri(x, y - s, x - s / 2 - 1, y + s / 2, x + s / 2 + 1, y + s / 2, c); }
function bolt(cx, cy, k, c) {
  const bx = [6, -12, -1, -7, 12, 1], by = [-26, 3, 3, 26, -5, -5], x = [], y = [];
  for (let i = 0; i < 6; i++) { x[i] = cx + bx[i] * k / 100; y[i] = cy + by[i] * k / 100; }
  tri(x[0], y[0], x[1], y[1], x[5], y[5], c); tri(x[1], y[1], x[2], y[2], x[5], y[5], c);
  tri(x[5], y[5], x[4], y[4], x[3], y[3], c); tri(x[5], y[5], x[3], y[3], x[2], y[2], c);
}
function ctext(t, cx, y, size, col) { fx.font = `bold ${8 * size}px ui-monospace,monospace`; fx.textBaseline = "top"; fx.textAlign = "center"; fx.fillStyle = col; fx.fillText(t, cx, y); }
function ltext(t, x, y, size, col) { fx.font = `bold ${8 * size}px ui-monospace,monospace`; fx.textBaseline = "top"; fx.textAlign = "left"; fx.fillStyle = col; fx.fillText(t, x, y); }



function drawEye(e, ox, oy, left, x0, y0, blink) {
  const cx = x0 + EW / 2, cy = y0 + EH / 2, t = now();
  rr(x0 - 3, y0 - 3, EW + 6, EH + 6, 43, COL.glow);
  rr(x0, y0, EW, EH, 40, COL.body);
  rr(x0 + 8, y0 + EH - 34, EW - 16, 26, 13, COL.low);
  rr(x0 + 14, y0 + 9, 32, 14, 7, COL.light);
  circ(x0 + EW - 18, y0 + 18, 4, COL.light);
  const px = cx + ox, py = cy + oy, r = e.sz;
  switch (e.st) {
    case S.NORM: circ(px, py, r, COL.dark); circ(px - r / 3, py - r / 3, Math.max(3, r / 4), COL.white); circ(px + r / 3, py + r / 2, Math.max(2, r / 9), COL.pink); break;
    case S.STAR: circ(px, py, r, COL.dark); star(px, py + 1, r * 0.78, rc(255, 235, 255)); break;
    case S.HEART: circ(px, py, r, COL.dark); heart(px, py - 4, r * 0.62, rc(255, 120, 210)); break;
    case S.SPIRAL: circ(px, py, r, COL.dark); { const rot = t / 160; for (let a = 0; a < 17; a += 0.12) { const rr_ = a * 1.9; circ(px + Math.cos(a + rot) * rr_, py + Math.sin(a + rot) * rr_, 2, rc(200, 160, 255)); } } break;
    case S.RING: circ(px, py, r, COL.dark); circ(px, py, r * 0.62, rc(225, 175, 255)); circ(px, py, r * 0.34, COL.dark); break;
    case S.ARC_UP: arc(cx, cy + 14, 32, 205, 335, 9, COL.dark); break;
    case S.ARC_DN: arc(cx, cy - 14, 32, 25, 155, 9, COL.dark); break;
    case S.CHEV_R: for (let d = -3; d <= 3; d++) { line(cx - 22, cy - 28 + d, cx + 22, cy + d, COL.dark); line(cx + 22, cy + d, cx - 22, cy + 28 + d, COL.dark); } break;
    case S.CHEV_L: for (let d = -3; d <= 3; d++) { line(cx + 22, cy - 28 + d, cx - 22, cy + d, COL.dark); line(cx - 22, cy + d, cx + 22, cy + 28 + d, COL.dark); } break;
    case S.SPINNER: { circ(px, py, r, COL.dark); const head = Math.floor(t / 70) % 12; for (let i = 0; i < 12; i++) { const a = (i * 30 - 90) * Math.PI / 180, idx = (head - i + 12) % 12, v = 255 - idx * 17; circ(px + Math.cos(a) * 26, py + Math.sin(a) * 26, 4, rc(v, Math.floor(v * 0.7), 255)); } break; }
    case S.BATT: { circ(px, py, r, COL.dark); const bx0 = px - 13, by0 = py - 17, bw = 26, bh = 40, col = faceData.batteryPct < 20 ? rc(255, 70, 70) : rc(60, 230, 140);
      fx.strokeStyle = col; fx.lineWidth = 2; fx.beginPath(); fx.roundRect(bx0 + 1, by0 + 1, bw - 2, bh - 2, 3); fx.stroke(); fx.fillStyle = col; fx.fillRect(px - 5, by0 - 5, 10, 5);
      const lh = (bh - 8) * faceData.batteryPct / 100; fx.fillRect(bx0 + 4, by0 + bh - 4 - lh, bw - 8, lh); break; }
    case S.PCT: circ(px, py, r, COL.dark); ctext(faceData.batteryPct + "%", px, py - 10, 3, rc(90, 230, 230)); break;
    case S.BOLT: circ(px, py, r, COL.dark); bolt(px, py, 100, rc(235, 225, 255)); break;
    case S.WIFI: { circ(px, py, r, COL.dark); const n = Math.floor(t / 350) % 4, on = rc(120, 190, 255), off = rc(50, 35, 90), wy = py + 16;
      arc(px, wy, 11, 225, 315, 5, n >= 1 ? on : off); arc(px, wy, 21, 225, 315, 5, n >= 2 ? on : off); arc(px, wy, 31, 225, 315, 5, n >= 3 ? on : off); circ(px, wy, 4, on); break; }
    case S.X: { circ(px, py, r, COL.dark); const red = rc(255, 60, 90); for (let d = -2; d <= 2; d++) { line(px - 15 + d, py - 15, px + 15 + d, py + 15, red); line(px + 15 + d, py - 15, px - 15 + d, py + 15, red); } break; }
  }
  const cp = Math.max(e.cover, blink * 100);
  if (cp > 0.5) {
    const c = Math.floor(cp * EH / 100), tl = Math.trunc(e.tilt * (1 - blink));
    const xo = left ? x0 - 3 : x0 + EW + 3, xi = left ? x0 + EW + 3 : x0 - 3;
    const yo = Math.max(y0 + c - tl, y0 - 6), yi = Math.max(y0 + c + tl, y0 - 6);
    tri(xo, y0 - 6, xi, y0 - 6, xi, yi, "#000"); tri(xo, y0 - 6, xi, yi, xo, yo, "#000");
    const ax = xo + (xi - xo) * 0.07, ay = yo + (yi - yo) * 0.07, bx = xo + (xi - xo) * 0.93, by = yo + (yi - yo) * 0.93;
    for (let d = 0; d < 4; d++) line(ax, ay + d, bx, by + d, COL.line);
  }
}

function drawFx(f, sx, sy) {
  const t = now(), m = f.fx;
  if (m & FXF.BLUSH) for (let i = 0; i < 3; i++) {
    line(LEX + 6 + i * 9 + sx, EY0 + EH - 14 + sy, LEX + 12 + i * 9 + sx, EY0 + EH - 24 + sy, COL.pink);
    line(REX + EW - 34 + i * 9 + sx, EY0 + EH - 14 + sy, REX + EW - 28 + i * 9 + sx, EY0 + EH - 24 + sy, COL.pink);
  }
  if (m & FXF.TEAR) { const ph = Math.floor(t / 45) % 36; drop(LEX + EW - 24 + sx, EY0 + EH - 6 + ph, 9, COL.blue); drop(REX + 24 + sx, EY0 + EH - 6 + ((ph + 14) % 36), 9, COL.blue); }
  if (m & FXF.TEARBIG) { const b = 3 * Math.sin(t / 180); circ(LEX + 36, EY0 + EH + 2 + b, 15, COL.blue); circ(LEX + 62, EY0 + EH + 14 + b, 9, COL.blue); circ(REX + 64, EY0 + EH + 2 - b, 15, COL.blue); circ(REX + 38, EY0 + EH + 14 - b, 9, COL.blue); }
  if (m & FXF.SPARK) { spark(18 + sx, 48 + sy, 9 + 3 * Math.sin(t / 200), rc(255, 230, 255)); spark(222 + sx, 44 + sy, 9 + 3 * Math.cos(t / 230), rc(255, 230, 255)); }
  if (m & FXF.ZZZ) { const b = 3 * Math.sin(t / 300), c = rc(230, 190, 255); ltext("z", 168, 54 + b, 2, c); ltext("Z", 188, 32 + b, 3, c); ltext("Z", 210, 6 + b, 4, c); }
  if (m & FXF.Q) ltext("?", 196, 4 + 3 * Math.sin(t / 250), 6, rc(235, 200, 255));
  if (m & FXF.HEARTS) { const b = 3 * Math.sin(t / 220); heart(26 + sx, 40 + sy + b, 12, COL.pink); heart(212 + sx, 28 + sy - b, 14, COL.pink); heart(224 + sx, 60 + sy + b, 8, rc(255, 150, 220)); }
  if (m & FXF.THOUGHT) { const c = rc(225, 190, 255); circ(172, 52, 4, c); circ(186, 40, 6, c); rr(190, 8, 46, 30, 14, c); }
  if (m & FXF.LINES) for (let i = 0; i < 4; i++) { const h = 22 + (i % 2) * 10; fx.fillStyle = rc(210, 150, 255); fx.fillRect(LEX + 18 + i * 20, 8, 1, h); fx.fillRect(REX + 18 + i * 20, 8, 1, h); }
  if (m & FXF.SWEAT) drop(222 + sx, 40 + sy + 3 * Math.sin(t / 150), 10, COL.blue);
  const BX = 40, BY = 196, BW = 160, BH = 18;
  const outline = (col) => { fx.strokeStyle = col; fx.lineWidth = 1.5; fx.beginPath(); fx.roundRect(BX, BY, BW, BH, 9); fx.stroke(); };
  if (m & FXF.BAR_LOAD) { const pct = faceData.loadPct >= 0 ? faceData.loadPct : Math.floor(t / 60) % 101; outline(rc(200, 120, 255)); const w = (BW - 4) * pct / 100; if (w >= 14) rr(BX + 2, BY + 2, w, BH - 4, 7, rc(190, 110, 250)); ctext(pct + "%", BX + BW / 2, BY + 5, 1, "#fff"); }
  if (m & FXF.BAR_CHG) { const pct = Math.floor(t / 40) % 101; outline(rc(80, 220, 200)); const w = (BW - 4) * pct / 100; if (w >= 14) rr(BX + 2, BY + 2, w, BH - 4, 7, rc(60, 220, 140)); bolt(BX + BW / 2, BY + BH / 2, 45, rc(255, 140, 230)); }
  if (m & FXF.DOTS) { const n = Math.floor(t / 300) % 6; for (let i = 0; i < 5; i++) circ(80 + i * 20, 208, 5, i < n ? rc(230, 200, 255) : rc(60, 40, 95)); }
  if (m & FXF.BAR_ERR) { const red = (Math.floor(t / 400) % 2) ? rc(255, 60, 90) : rc(190, 30, 60); outline(red); tri(120, 191, 107, 216, 133, 216, red); ctext("!", 120, 200, 1, "#fff"); }
  if (m & FXF.BAR_DONE) { outline(rc(80, 50, 130)); circ(120, 205, 14, rc(60, 230, 170)); fx.strokeStyle = "#fff"; fx.lineWidth = 3; fx.beginPath(); fx.moveTo(112, 206); fx.lineTo(118, 212); fx.lineTo(129, 200); fx.stroke(); }
}


const FI = Object.fromEntries(FACES.map((f, i) => [f.en, i]));
export const faceIndex = (en) => FI[en];
const eyeOf = (face, i) => { const a = i ? face.r : face.l; return { cover: a[0], tilt: a[1], px: a[2], py: a[3], sz: a[4], st: a[5] }; };
const blinkable = (st) => st === S.NORM || st === S.STAR || st === S.HEART || st === S.RING;

// وش واحد = Canvas واحد. viewY/viewH بيقصّوا الجزء اللي بيظهر (العيون بس) عشان يناسب الشاشة السودا في الروبوت
export class RobotFace {
  constructor(canvas, { viewY = 30, viewH = 180 } = {}) {
    this.canvas = canvas; this.viewY = viewY; this.viewH = viewH;
    canvas.width = 240; canvas.height = viewH;
    this.ctx = canvas.getContext('2d');
    this.cur = 0; this.pending = -1; this.blinkV = 0; this.blinkPhase = 0; this.nextBlink = 0;
    this.gx = 0; this.gy = 0; this.gtx = 0; this.gty = 0; this.nextGaze = 0; this.telAt = 0; this.asleep = false;
    this.ea = [{ cover: 0, tilt: 0, px: 0, py: 0, sz: 30 }, { cover: 0, tilt: 0, px: 0, py: 0, sz: 30 }];
    this.snap();
  }
  snap() { for (let i = 0; i < 2; i++) { const e = eyeOf(FACES[this.cur], i); this.ea[i] = { cover: e.cover, tilt: e.tilt, px: e.px * 0.4, py: e.py * 0.4, sz: e.sz }; } }
  setIdx(n) {
    if (n < 0 || n >= FACES.length || (n === this.cur && this.pending < 0)) return;
    const a = FACES[this.cur], b = FACES[n], same = a.l[5] === b.l[5] && a.r[5] === b.r[5];
    if (same && this.blinkPhase === 0) { this.cur = n; this.pending = -1; } else { this.pending = n; this.blinkPhase = 1; }
  }
  setName(en) { const i = FI[en]; if (i !== undefined) this.setIdx(i); }
  get name() { return FACES[this.pending >= 0 ? this.pending : this.cur].en; }
  // بيانات حية من الروبوت: نظر x,y (بكسل) + رمشة + نايم
  telemetry(gx, gy, blink, asleep) {
    this.telAt = now(); this.gtx = clamp(gx, -19, 19); this.gty = clamp(gy, -17, 17);
    if (blink > 30 && this.blinkPhase === 0) this.blinkPhase = 1;
    this.asleep = !!asleep;
  }
  draw() {
    const t = now(), f = FACES[this.cur], ea = this.ea;
    const live = t - this.telAt < 2500;
    if (!live && t > this.nextGaze) {
      const opts = [[0, 0], [0, 0], [-15, 0], [15, 0], [0, -13], [0, 11], [-13, -10], [13, -10]];
      const o = opts[Math.floor(Math.random() * opts.length)]; this.gtx = o[0] + (Math.random() * 4 - 2); this.gty = o[1] + (Math.random() * 4 - 2);
      this.nextGaze = t + 700 + Math.random() * 1800;
    }
    this.gx += (this.gtx - this.gx) * 0.55; this.gy += (this.gty - this.gy) * 0.55;
    const dx = 0.8 * Math.sin(t / 700) + 0.5 * Math.sin(t / 310 + 1), dy = 0.6 * Math.sin(t / 900 + 2);
    const gw = (f.fx & FXF.NOGAZE) ? 0 : 1, tg = [eyeOf(f, 0), eyeOf(f, 1)];
    for (let i = 0; i < 2; i++) {
      const gz = tg[i].st === S.NORM;
      const tc = tg[i].cover + (gz && tg[i].cover < 60 ? Math.max(0, this.gy) * 0.7 * gw : 0);
      const lim = Math.max(4, 48 - tg[i].sz);
      const tx = clamp(tg[i].px * 0.4 + (gz ? (this.gx + dx) * gw : 0), -lim, lim);
      const ty = clamp(tg[i].py * 0.4 + (gz ? (this.gy + dy) * gw : 0), -(lim + 2), lim + 2);
      ea[i].cover += (tc - ea[i].cover) * 0.18; ea[i].tilt += (tg[i].tilt - ea[i].tilt) * 0.18; ea[i].sz += (tg[i].sz - ea[i].sz) * 0.25;
      ea[i].px += (tx - ea[i].px) * 0.5; ea[i].py += (ty - ea[i].py) * 0.5;
    }
    if (this.blinkPhase === 0) { if (!live && t > this.nextBlink && blinkable(f.l[5]) && blinkable(f.r[5])) { this.blinkPhase = 1; this.nextBlink = t + 1800 + Math.random() * 2700; } }
    else if (this.blinkPhase === 1) { this.blinkV += 0.34; if (this.blinkV >= 1) { this.blinkV = 1; if (this.pending >= 0) { this.cur = this.pending; this.pending = -1; this.snap(); } this.blinkPhase = 2; } }
    else { this.blinkV -= 0.25; if (this.blinkV <= 0) { this.blinkV = 0; this.blinkPhase = 0; } }

    let sx = 0, sy = 0;
    if (f.fx & FXF.SHAKE) { sx = Math.floor(Math.random() * 7) - 3; sy = Math.floor(Math.random() * 5) - 2; }
    if (f.fx & FXF.JIGGLE) { sx = Math.floor(Math.random() * 3) - 1; sy = Math.floor(Math.random() * 5) - 2; }
    const breathe = Math.sin(t / (this.asleep ? 1400 : 2200)) * (this.asleep ? 2.5 : 1.2);
    const bx = Math.trunc(this.gx * 0.28 * gw), by = Math.trunc(this.gy * 0.2 * gw + breathe);
    fx = this.ctx;
    fx.save(); fx.clearRect(0, 0, 240, this.viewH); fx.translate(0, -this.viewY);
    for (let i = 0; i < 2; i++) {
      const e = { cover: Math.round(clamp(ea[i].cover, 0, 100)), tilt: Math.round(ea[i].tilt), sz: Math.round(clamp(ea[i].sz, 0, 60)), st: tg[i].st };
      drawEye(e, ea[i].px, ea[i].py, i === 0, (i ? REX : LEX) + sx + bx, EY0 + sy + by, this.blinkV);
    }
    drawFx(f, sx, sy);
    fx.restore();
  }
}

// حلقة رسم واحدة لكل الوشوش الظاهرة
const live = new Set();
let raf = 0;
function loop() { live.forEach((f) => { if (f.canvas.isConnected) f.draw(); else live.delete(f); }); raf = live.size ? requestAnimationFrame(loop) : 0; }
export function startFace(face) { live.add(face); if (!raf) raf = requestAnimationFrame(loop); }
export function stopFace(face) { live.delete(face); }

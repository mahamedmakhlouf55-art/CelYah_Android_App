// ينسخ مكتبة MQTT (نسخة المتصفح الجاهزة) لمجلد public/vendor قبل البناء
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
const src = 'node_modules/mqtt/dist/mqtt.min.js';
if (existsSync(src)) {
  mkdirSync('public/vendor', { recursive: true });
  copyFileSync(src, 'public/vendor/mqtt.min.js');
  console.log('[vendor] mqtt.min.js copied');
} else {
  console.warn('[vendor] node_modules/mqtt/dist/mqtt.min.js not found - run `npm install` first');
}

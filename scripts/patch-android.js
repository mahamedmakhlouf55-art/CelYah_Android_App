// بعد `npx cap add android`: يضيف صلاحيات البلوتوث والميكروفون ويثبّت الشاشة عمودي (آمن لو اتشغّل أكتر من مرة)
import fs from 'node:fs';
const mf = 'android/app/src/main/AndroidManifest.xml';
if (!fs.existsSync(mf)) { console.error('[patch] مفيش مشروع أندرويد. شغّل الأول: npx cap add android'); process.exit(1); }
let x = fs.readFileSync(mf, 'utf8');

if (!x.includes('xmlns:tools')) x = x.replace('<manifest ', '<manifest xmlns:tools="http://schemas.android.com/tools" ');

const perms = [
  ['android.permission.BLUETOOTH', 'android:maxSdkVersion="30"'],
  ['android.permission.BLUETOOTH_ADMIN', 'android:maxSdkVersion="30"'],
  ['android.permission.BLUETOOTH_SCAN', 'android:usesPermissionFlags="neverForLocation" tools:targetApi="s"'],
  ['android.permission.BLUETOOTH_CONNECT', ''],
  ['android.permission.ACCESS_FINE_LOCATION', 'android:maxSdkVersion="30"'],
  ['android.permission.RECORD_AUDIO', ''],
  ['android.permission.MODIFY_AUDIO_SETTINGS', ''],
];
let add = '';
for (const [name, attrs] of perms) if (!x.includes(`"${name}"`)) add += `    <uses-permission android:name="${name}" ${attrs} />\n`;
if (!x.includes('android.hardware.bluetooth_le')) add += '    <uses-feature android:name="android.hardware.bluetooth_le" android:required="false" />\n';
if (!x.includes('android.speech.RecognitionService')) add += '    <queries>\n        <intent><action android:name="android.speech.RecognitionService" /></intent>\n    </queries>\n';
if (add) x = x.replace('</manifest>', add + '</manifest>');

if (!/screenOrientation/.test(x)) x = x.replace(/(<activity\b[^>]*?)(\s*>)/, '$1 android:screenOrientation="portrait"$2');

fs.writeFileSync(mf, x);
console.log('[patch] AndroidManifest.xml جاهز ✓');

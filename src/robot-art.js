// رسومات الروبوت (SVG): الروبوت الكبير (شاشة البداية والرئيسية) + أفاتار صغير
export function heroHTML({ full = true } = {}) {
  return `<div class="hero ${full ? 'full' : 'head'}">
  <svg viewBox="0 0 300 ${full ? 330 : 215}" aria-hidden="true">
    <defs>
      <radialGradient id="gGlow" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#a45cff" stop-opacity=".55"/><stop offset="1" stop-color="#a45cff" stop-opacity="0"/></radialGradient>
      <linearGradient id="gWhite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9b3cc"/></linearGradient>
      <linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2540"/><stop offset="1" stop-color="#0e0a18"/></linearGradient>
      <linearGradient id="gVisor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a1226"/><stop offset=".5" stop-color="#05030a"/><stop offset="1" stop-color="#140c20"/></linearGradient>
      <filter id="fGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="150" cy="${full ? 175 : 120}" rx="150" ry="${full ? 150 : 110}" fill="url(#gGlow)"/>
    ${full ? `
    <!-- العجل -->
    <ellipse cx="92" cy="298" rx="46" ry="26" fill="url(#gDark)" stroke="#a45cff" stroke-width="3"/><circle cx="92" cy="298" r="13" fill="#7b3fe4"/><circle cx="92" cy="298" r="6" fill="#e2c4ff"/>
    <ellipse cx="208" cy="298" rx="46" ry="26" fill="url(#gDark)" stroke="#a45cff" stroke-width="3"/><circle cx="208" cy="298" r="13" fill="#7b3fe4"/><circle cx="208" cy="298" r="6" fill="#e2c4ff"/>
    <!-- الدراعات -->
    <ellipse cx="70" cy="248" rx="17" ry="30" fill="url(#gWhite)" stroke="#a45cff" stroke-width="2.5"/>
    <ellipse cx="230" cy="248" rx="17" ry="30" fill="url(#gWhite)" stroke="#a45cff" stroke-width="2.5"/>
    <!-- الجسم -->
    <rect x="88" y="212" width="124" height="88" rx="36" fill="url(#gWhite)"/>
    <rect x="112" y="232" width="76" height="40" rx="14" fill="#120d1e" stroke="#7b3fe4" stroke-width="2"/>
    <path d="M150 262c-14-9-20-15-20-22a8 8 0 0 1 14-5l6 6 6-6a8 8 0 0 1 14 5c0 7-6 13-20 22z" transform="translate(0 -3)" fill="#ff82d2" opacity=".95"/>` : ''}
    <!-- الراس -->
    <rect x="24" y="30" width="252" height="${full ? 182 : 170}" rx="86" fill="url(#gWhite)"/>
    <rect x="38" y="44" width="224" height="${full ? 154 : 142}" rx="74" fill="url(#gDark)"/>
    <circle cx="26" cy="${full ? 122 : 116}" r="17" fill="#7b3fe4" stroke="#e2c4ff" stroke-width="2.5"/>
    <circle cx="274" cy="${full ? 122 : 116}" r="17" fill="#7b3fe4" stroke="#e2c4ff" stroke-width="2.5"/>
    <rect x="52" y="58" width="196" height="${full ? 126 : 114}" rx="58" fill="url(#gVisor)" stroke="#8a4df0" stroke-width="2"/>
    <rect x="52" y="58" width="196" height="${full ? 126 : 114}" rx="58" fill="none" stroke="#c58bff" stroke-opacity=".5" stroke-width="6" filter="url(#fGlow)"/>
  </svg>
  <canvas class="hero-face"></canvas>
</div>`;
}

export function avatarHTML(size = 36) {
  return `<svg class="avatar" width="${size}" height="${size}" viewBox="0 0 60 60" aria-hidden="true">
    <rect x="3" y="8" width="54" height="44" rx="20" fill="#d9d4e6"/><rect x="7" y="12" width="46" height="36" rx="16" fill="#171021"/>
    <circle cx="21" cy="30" r="7" fill="#ff7bf0"/><circle cx="39" cy="30" r="7" fill="#ff7bf0"/>
    <circle cx="19" cy="28" r="2.2" fill="#fff"/><circle cx="37" cy="28" r="2.2" fill="#fff"/>
    <circle cx="3" cy="30" r="3" fill="#8a4df0"/><circle cx="57" cy="30" r="3" fill="#8a4df0"/>
  </svg>`;
}

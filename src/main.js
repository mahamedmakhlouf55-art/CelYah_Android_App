// نقطة دخول التطبيق
import { cfg, S } from './store.js';
import { applyLang, t } from './i18n.js';
import * as L from './link.js';
import { go, toast, screens, root } from './router.js';
import './screens_main.js';
import './screens_conn.js';

applyLang();
L.hooks.toast = (k) => toast(k);
L.startLinkTimers();
go(cfg.onboarded ? 'home' : 'splash', {}, 'reset');
L.autoConnect();

// للاختبار والتصوير
window.__celyah = { cfg, S, go, L, screens, t, root };

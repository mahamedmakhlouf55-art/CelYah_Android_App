// الترجمة: عربي (الافتراضي) + English
import { cfg } from './store.js';

const D = {
  ar: {
    app: 'سيليا', online: 'متصل', offline: 'غير متصل', connected: 'متصل', not_connected: 'غير متصل', save: 'حفظ', cancel: 'إلغاء', connect: 'اتصال',
    disconnect: 'قطع الاتصال', back: 'رجوع', close: 'إغلاق', saved: 'اتحفظ ✓', on: 'شغّال', off: 'مقفول', unknown: 'غير معروف', yes: 'أيوه', no: 'لأ',
    tagline: 'رفيقك الذكي', get_started: 'ابدأ',
    ob1_t: 'اتكلم مع سيليا', ob1_d: 'محادثة ذكية بصوتك أو بالكتابة بـ Gemini', ob2_t: 'شوف من أي مكان', ob2_d: 'كاميرا مباشرة وتحكم كامل عن بُعد', ob3_t: 'روبوت بشخصية', ob3_d: 'مشاعر حقيقية بتتغير حسب كلامك ومزاجها',
    charging: 'بيشحن', on_battery: 'على البطارية', battery: 'البطارية', energy: 'الطاقة', battery_unknown: 'غير معروفة',
    chat: 'الشات', chat_sub: 'اتكلم مع سيليا', live_cam: 'الكاميرا المباشرة', live_cam_sub: 'شوف واستكشف',
    nav_home: 'الرئيسية', nav_chat: 'الشات', nav_camera: 'الكاميرا', nav_control: 'التحكم', nav_settings: 'الإعدادات',
    type_msg: 'اكتب رسالة...', live: 'مباشر', thinking: 'سيليا بتفكر...', listening: 'بسمعك...', hello_msg: 'أهلا! أنا سيليا ♥ بسمعك وبتكلم معاك بذكاء Gemini. أقدر أساعدك إزاي؟',
    need_gemini: 'ضيف مفتاح Gemini من الإعدادات عشان أبقى ذكية', not_linked: 'مش متصل بالروبوت. وصّل بلوتوث أو إنترنت من الإعدادات.', mic_fail: 'ما قدرتش أسمعك، جرّب تاني',
    cam_title: 'الكاميرا المباشرة', cam_off: 'الكاميرا مقفولة', cam_wait: 'بستنى أول صورة...', cam_start: 'تشغيل الكاميرا', cam_stop: 'إيقاف الكاميرا',
    cam_net: 'الفيديو بيشتغل عبر الإنترنت. اربط الروبوت والتطبيق بالسيرفر من «التحكم عن بُعد» الأول.', cam_err: 'الكاميرا مش شغالة على الروبوت (بورد من غير كاميرا أو إعداد HAS_CAMERA)',
    auto: 'تلقائي', manual: 'يدوي', speed: 'السرعة', pick: 'التقاط', wave: 'سلام', home_btn: 'الوضع الأصلي', stop: 'إيقاف',
    control_title: 'التحكم', arm: 'الدراع', activity: 'مستوى النشاط', calm: 'هادي', active: 'نشيط', hyper: 'نشيط جداً', sleep: 'نوم', wake: 'صحّيه',
    expressions: 'الملامح', hold_face: 'تثبيت الملمح', hold_hint: 'يفضل الملمح لحد ما ترجع للوضع التلقائي',
    connection: 'الاتصال', bluetooth: 'بلوتوث', bt_sub: 'للاتصال القريب', wifi_internet: 'واي فاي / إنترنت', wifi_sub: 'للتحكم عن بُعد', remote: 'التحكم عن بُعد', remote_sub: 'تحكم من أي مكان',
    saved_devices: 'الأجهزة المحفوظة', manage_devices: 'إدارة الأجهزة', no_devices: 'مفيش أجهزة محفوظة لسه', find_robot: 'بحث عن الروبوت', rename: 'تغيير الاسم', forget: 'نسيان الجهاز', robot_name: 'اسم الروبوت', bt_unsupported: 'البلوتوث مش مدعوم هنا. استخدم تطبيق الأندرويد.',
    wifi_setup: 'إعداد الواي فاي', wifi_desc: 'وصّل سيليا بواي فاي البيت عشان تتحكم فيها عن بُعد', network: 'الشبكة', password: 'الباسورد', auto_reconnect: 'إعادة الاتصال تلقائياً', scanning: 'بيدوّر...', select_network: 'اختار شبكة', need_ble: 'اتصل بالروبوت بالبلوتوث الأول',
    wifi_sent: 'اتبعت للروبوت...', wifi_connecting: 'الروبوت بيتصل بـ', wifi_connected: 'الروبوت متصل بالواي فاي', wifi_failed: 'فشل الاتصال، راجع الباسورد', wifi_none: 'الروبوت مش متصل بواي فاي', enter_ssid: 'اكتب اسم الشبكة', found_n: 'لقى شبكات:',
    remote_title: 'التحكم عن بُعد', remote_hint: 'محتاج حساب مجاني على HiveMQ Cloud (راجع الدليل). الروبوت والتطبيق بيتقابلوا على السيرفر ده من أي مكان.', server_host: 'عنوان السيرفر', robot_port: 'منفذ الروبوت (TLS)', app_port: 'منفذ التطبيق (WSS)', username: 'اسم المستخدم', robot_id: 'معرّف الروبوت (اسم سري)', save_connect: 'حفظ وربط التطبيق', send_robot: 'إرسال للروبوت (بلوتوث)', srv_connected: 'متصل بالسيرفر ✓', srv_connecting: 'بيتصل...', srv_missing: 'اكتب بيانات السيرفر الأول', srv_lib: 'مكتبة MQTT غير متاحة', robot_sent: 'اتبعت للروبوت، بيتصل بالسيرفر...', robot_cloud_ok: 'الروبوت متصل بالسيرفر ✓', robot_cloud_wait: 'الروبوت لسه مش متصل بالسيرفر (تأكد من الواي فاي)', robot_cloud_nocfg: 'الروبوت لسه ما استلمش الإعدادات',
    gemini_settings: 'إعدادات Gemini AI', api_key: 'مفتاح API', key_hint: 'بيتخزن على موبايلك بس. مفتاح مجاني من aistudio.google.com', model: 'الموديل', voice_lang: 'لغة الصوت', voice_resp: 'ردود صوتية', text_resp: 'ردود نصية', enable_conv: 'تفعيل المحادثة المستمرة', persona: 'شخصية سيليا (اختياري)', arabic: 'العربية', english: 'English',
    robot_status: 'حالة الروبوت', wifi: 'واي فاي', internet: 'الإنترنت', temperature: 'الحرارة', normal: 'طبيعية', hot: 'عالية', memory: 'الذاكرة الحرة', uptime: 'مدة التشغيل', mode: 'الوضع', min: 'دقيقة', refresh: 'تحديث',
    settings: 'الإعدادات', set_connection: 'الاتصال', set_wifi: 'واي فاي والإنترنت', set_remote: 'التحكم عن بُعد', set_camera: 'إعدادات الكاميرا', set_ai: 'الذكاء والشات', set_move: 'إعدادات الحركة', set_display: 'إعدادات الشاشة', set_notif: 'الإشعارات', set_about: 'عن سيليا',
    resolution: 'الدقة', res_low: 'منخفضة 320×240', res_hd: 'HD 640×480', quality: 'الجودة', q_high: 'عالية', q_med: 'متوسطة', q_low: 'منخفضة', auto_start: 'تشغيل الكاميرا تلقائياً عند الفتح',
    default_speed: 'السرعة الافتراضية', idle_wheels: 'حركة العجلات التلقائية', idle_hint: 'بتشتغل في الوضع التلقائي بس. فعّلها على أرض واسعة وآمنة.',
    language: 'اللغة', rotation: 'اتجاه شاشة وش الروبوت', rot0: '٠°', rot1: '٩٠°', rot2: '١٨٠°', rot3: '٢٧٠°',
    notif_offline: 'تنبيه لو الروبوت قطع الاتصال', notif_batt: 'تنبيه لو البطارية واطية',
    about_ver: 'الإصدار', about_text: 'سيليا روبوت صديق بيتحرك ويتكلم وله مشاعر. التطبيق ده بيتحكم فيه بالبلوتوث أو من أي مكان بالإنترنت.', privacy: 'سياسة الخصوصية', privacy_text: 'كل إعداداتك ومفاتيحك بتتخزن على جهازك بس. الصوت والنصوص بتروح لـ Google Gemini لما تتكلم مع سيليا فقط.',
    toast_offline: 'الروبوت قطع الاتصال', toast_batt: 'بطارية الروبوت واطية', toast_conn: 'اتصل بالروبوت ✓',
  },
  en: {
    app: 'Celyah', online: 'Online', offline: 'Offline', connected: 'Connected', not_connected: 'Not connected', save: 'Save', cancel: 'Cancel', connect: 'Connect',
    disconnect: 'Disconnect', back: 'Back', close: 'Close', saved: 'Saved ✓', on: 'On', off: 'Off', unknown: 'Unknown', yes: 'Yes', no: 'No',
    tagline: 'Your Smart Companion', get_started: 'Get Started',
    ob1_t: 'Talk with Celyah', ob1_d: 'Smart voice or text chat powered by Gemini', ob2_t: 'See from anywhere', ob2_d: 'Live camera and full remote control', ob3_t: 'A robot with personality', ob3_d: 'Real emotions that follow your words and its mood',
    charging: 'Charging', on_battery: 'On battery', battery: 'Battery', energy: 'Energy', battery_unknown: 'Unknown',
    chat: 'Chat', chat_sub: 'Talk with Celyah', live_cam: 'Live Camera', live_cam_sub: 'View and explore',
    nav_home: 'Home', nav_chat: 'Chat', nav_camera: 'Camera', nav_control: 'Control', nav_settings: 'Settings',
    type_msg: 'Type a message...', live: 'Live', thinking: 'Celyah is thinking...', listening: 'Listening...', hello_msg: "Hi! I'm Celyah ♥ I can hear and chat with you using Gemini AI. How can I help?",
    need_gemini: 'Add your Gemini key in Settings to make me smart', not_linked: 'Not connected to the robot. Connect Bluetooth or internet in Settings.', mic_fail: "I couldn't hear you, try again",
    cam_title: 'Live Camera', cam_off: 'Camera is off', cam_wait: 'Waiting for first frame...', cam_start: 'Start camera', cam_stop: 'Stop camera',
    cam_net: 'Video runs over the internet. Link the robot and the app to the server in "Remote Access" first.', cam_err: 'Camera is not working on the robot (board without camera or HAS_CAMERA setting)',
    auto: 'Auto', manual: 'Manual', speed: 'Speed', pick: 'Pick', wave: 'Wave', home_btn: 'Home', stop: 'Stop',
    control_title: 'Control', arm: 'Arm', activity: 'Activity level', calm: 'Calm', active: 'Active', hyper: 'Hyper', sleep: 'Sleep', wake: 'Wake',
    expressions: 'Expressions', hold_face: 'Hold expression', hold_hint: 'Keeps the face until you return to Auto mode',
    connection: 'Connection', bluetooth: 'Bluetooth', bt_sub: 'For nearby connection', wifi_internet: 'Wi-Fi / Internet', wifi_sub: 'For remote access', remote: 'Remote Access', remote_sub: 'Control from anywhere',
    saved_devices: 'Saved Devices', manage_devices: 'Manage Devices', no_devices: 'No saved devices yet', find_robot: 'Find robot', rename: 'Rename', forget: 'Forget device', robot_name: 'Robot name', bt_unsupported: 'Bluetooth is not supported here. Use the Android app.',
    wifi_setup: 'Wi-Fi Setup', wifi_desc: 'Connect Celyah to your home Wi-Fi for remote access', network: 'Network', password: 'Password', auto_reconnect: 'Auto Reconnect', scanning: 'Scanning...', select_network: 'Select a network', need_ble: 'Connect to the robot over Bluetooth first',
    wifi_sent: 'Sent to the robot...', wifi_connecting: 'Robot is connecting to', wifi_connected: 'Robot is connected to Wi-Fi', wifi_failed: 'Connection failed, check the password', wifi_none: 'Robot is not on Wi-Fi', enter_ssid: 'Enter the network name', found_n: 'Networks found:',
    remote_title: 'Remote Access', remote_hint: 'Needs a free HiveMQ Cloud account (see the guide). The robot and the app meet on that server from anywhere.', server_host: 'Server host', robot_port: 'Robot port (TLS)', app_port: 'App port (WSS)', username: 'Username', robot_id: 'Robot ID (secret name)', save_connect: 'Save & link app', send_robot: 'Send to robot (Bluetooth)', srv_connected: 'Connected to server ✓', srv_connecting: 'Connecting...', srv_missing: 'Enter the server details first', srv_lib: 'MQTT library unavailable', robot_sent: 'Sent to the robot, it is connecting...', robot_cloud_ok: 'Robot is connected to the server ✓', robot_cloud_wait: 'Robot is not on the server yet (check its Wi-Fi)', robot_cloud_nocfg: 'Robot has not received the settings yet',
    gemini_settings: 'Gemini AI Settings', api_key: 'API Key', key_hint: 'Stored on your phone only. Free key at aistudio.google.com', model: 'Model', voice_lang: 'Voice Language', voice_resp: 'Voice Responses', text_resp: 'Text Responses', enable_conv: 'Enable Conversations', persona: 'Celyah personality (optional)', arabic: 'العربية', english: 'English',
    robot_status: 'Robot Status', wifi: 'Wi-Fi', internet: 'Internet', temperature: 'Temperature', normal: 'Normal', hot: 'High', memory: 'Free memory', uptime: 'Uptime', mode: 'Mode', min: 'min', refresh: 'Refresh',
    settings: 'Settings', set_connection: 'Connection', set_wifi: 'Wi-Fi & Internet', set_remote: 'Remote Access', set_camera: 'Camera Settings', set_ai: 'AI & Chat Settings', set_move: 'Movement Settings', set_display: 'Display Settings', set_notif: 'Notifications', set_about: 'About Celyah',
    resolution: 'Resolution', res_low: 'Low 320×240', res_hd: 'HD 640×480', quality: 'Quality', q_high: 'High', q_med: 'Medium', q_low: 'Low', auto_start: 'Start camera automatically when opened',
    default_speed: 'Default speed', idle_wheels: 'Automatic wheel movement', idle_hint: 'Works in Auto mode only. Enable on a wide, safe floor.',
    language: 'Language', rotation: 'Robot face screen rotation', rot0: '0°', rot1: '90°', rot2: '180°', rot3: '270°',
    notif_offline: 'Alert when the robot goes offline', notif_batt: 'Alert on low battery',
    about_ver: 'Version', about_text: 'Celyah is a friendly robot that moves, talks and has feelings. This app controls it over Bluetooth or from anywhere over the internet.', privacy: 'Privacy policy', privacy_text: 'All your settings and keys stay on your device. Voice and text go to Google Gemini only when you chat with Celyah.',
    toast_offline: 'Robot went offline', toast_batt: 'Robot battery is low', toast_conn: 'Connected to the robot ✓',
  },
};

export function t(k) {
  const d = D[cfg.lang] || D.en;
  return d[k] ?? D.en[k] ?? k;
}
export function applyLang() {
  document.documentElement.lang = cfg.lang;
  document.documentElement.dir = cfg.lang === 'ar' ? 'rtl' : 'ltr';
}
export const I18N_KEYS = Object.keys(D.en);

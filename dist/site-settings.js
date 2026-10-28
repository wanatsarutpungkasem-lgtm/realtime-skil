/* Contact links and visitor-local appearance settings. No credentials. */
(() => {
  'use strict';

  // แก้ข้อความและลิงก์ติดต่อได้ตรงนี้
  const CONTACTS = [
    { label: 'TikTok · @ohmwntsrut', url: 'https://www.tiktok.com/@ohmwntsrut' },
    { label: 'Facebook · Wanatsarut', url: 'https://www.facebook.com/wanatsarutcp/' }
  ];
  const STORAGE_KEY = 'chob-appearance-v1';
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const valid = value => /^#[0-9a-f]{6}$/i.test(value);
  const fallback = (value, otherwise) => valid(value.trim()) ? value.trim() : otherwise;
  const defaults = {
    background: fallback(css.getPropertyValue('--paper'), '#f3f1e9'),
    accent: fallback(css.getPropertyValue('--accent'), '#d9ed88')
  };
  const presets = [
    { label: 'ครีม', ...defaults },
    { label: 'สว่าง', background: '#fafafa', accent: '#b9dfff' },
    { label: 'เข้ม', background: '#191e1b', accent: '#d9ed88' },
    { label: 'ชมพู', background: '#f5e9ec', accent: '#eab3c7' }
  ];
  let selected = { ...defaults };
  let stored = false;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && valid(saved.background) && valid(saved.accent)) {
      selected = saved;
      stored = true;
    }
  } catch { /* Website remains usable when local storage is unavailable. */ }

  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const mix = (a, b, ratio) => '#' + rgb(a).map((v, i) => Math.round(v * (1 - ratio) + rgb(b)[i] * ratio).toString(16).padStart(2, '0')).join('');
  function luminance(hex) {
    const [r, g, b] = rgb(hex).map(v => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function inkFor(hex) {
    const l = luminance(hex);
    return (l + 0.05) / 0.05 >= 1.05 / (l + 0.05) ? '#111111' : '#ffffff';
  }
  function apply() {
    const ink = inkFor(selected.background);
    const vars = {
      '--paper': selected.background,
      '--ink': ink,
      '--muted': mix(selected.background, ink, 0.72),
      '--line': mix(selected.background, ink, 0.25),
      '--surface': mix(selected.background, ink, 0.055),
      '--accent': selected.accent,
      '--lime': selected.accent,
      '--on-accent': inkFor(selected.accent),
      '--title-color': mix(selected.background, ink, 0.85)
    };
    for (const [key, value] of Object.entries(vars)) root.style.setProperty(key, value);
    root.dataset.customTheme = 'true';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', selected.background);
  }
  if (stored) apply();

  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('#owner-contact')) {
    const section = document.createElement('section');
    section.id = 'owner-contact';
    section.className = 'owner-contact';
    const title = document.createElement('h2');
    title.textContent = 'ติดต่อ Wanatsarut';
    const links = document.createElement('nav');
    links.className = 'contact-links';
    links.setAttribute('aria-label', 'ช่องทางติดต่อเจ้าของเว็บไซต์');
    for (const contact of CONTACTS) {
      const link = document.createElement('a');
      link.href = contact.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = contact.label + ' ↗';
      links.append(link);
    }
    section.append(title, links);
    footer.append(section);
  }

  const header = document.querySelector('header');
  if (!header || document.querySelector('#appearance-button')) return;
  const mount = header.querySelector('.header-actions') || header;
  const wrap = document.createElement('div');
  wrap.className = 'appearance-control';
  wrap.innerHTML = `
    <button type="button" id="appearance-button" aria-label="ปรับพื้นหลังและสี" aria-expanded="false" aria-controls="appearance-panel">◐</button>
    <section id="appearance-panel" class="appearance-panel" aria-label="ปรับพื้นหลังและสี" hidden>
      <div class="appearance-heading"><h2>แต่งสีในแบบคุณ</h2><button type="button" id="appearance-close" aria-label="ปิดแผงปรับสี">×</button></div>
      <p>ตัวเลือกนี้มีผลเฉพาะเบราว์เซอร์ของคุณ</p>
      <div class="appearance-presets" role="group" aria-label="ชุดสีสำเร็จรูป"></div>
      <label class="appearance-field">สีพื้นหลัง <input id="background-color" type="color" aria-label="เลือกสีพื้นหลัง"></label>
      <label class="appearance-field">สีตกแต่ง <input id="accent-color" type="color" aria-label="เลือกสีตกแต่ง"></label>
      <button type="button" class="appearance-reset" id="appearance-reset">คืนค่าสีเริ่มต้น</button>
      <p id="appearance-status" class="appearance-status" role="status"></p>
    </section>`;
  mount.append(wrap);
  const button = wrap.querySelector('#appearance-button');
  const panel = wrap.querySelector('#appearance-panel');
  const bg = wrap.querySelector('#background-color');
  const accent = wrap.querySelector('#accent-color');
  const status = wrap.querySelector('#appearance-status');
  const group = wrap.querySelector('.appearance-presets');

  function updateControls() {
    bg.value = selected.background;
    accent.value = selected.accent;
    group.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(presets[i].background === selected.background && presets[i].accent === selected.accent)));
  }
  function save() {
    apply();
    updateControls();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      status.textContent = 'จำสีไว้ในเบราว์เซอร์นี้แล้ว';
    } catch { status.textContent = 'ใช้สีได้ในหน้านี้ แต่เบราว์เซอร์ไม่อนุญาตให้บันทึก'; }
  }
  function close(restoreFocus = false) {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus();
  }
  for (const preset of presets) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = preset.label;
    b.addEventListener('click', () => { selected = { background: preset.background, accent: preset.accent }; save(); });
    group.append(b);
  }
  button.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (open) group.querySelector('button')?.focus();
  });
  wrap.querySelector('#appearance-close').addEventListener('click', () => close(true));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(true); });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  bg.addEventListener('input', () => { selected.background = bg.value; save(); });
  accent.addEventListener('input', () => { selected.accent = accent.value; save(); });
  wrap.querySelector('#appearance-reset').addEventListener('click', () => {
    selected = { ...defaults };
    for (const key of ['--paper', '--ink', '--muted', '--line', '--surface', '--accent', '--lime', '--on-accent', '--title-color']) root.style.removeProperty(key);
    delete root.dataset.customTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', defaults.background);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    updateControls();
    status.textContent = 'คืนค่าสีเริ่มต้นแล้ว';
  });
  updateControls();
})();

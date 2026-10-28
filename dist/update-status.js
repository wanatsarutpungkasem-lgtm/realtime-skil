/* Public feed status. No credentials or paid API calls. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const footer = document.querySelector('footer');
  if (!footer) return;
  const box = document.createElement('section');
  box.className = 'update-status';
  box.setAttribute('aria-label', 'สถานะข้อมูลบนเว็บไซต์');
  box.innerHTML = '<h2>ข้อมูลบนเว็บตอนนี้</h2><p class="update-summary" role="status">กำลังตรวจไฟล์ข้อมูล…</p><p class="update-counts"></p><p class="update-times"></p><p class="update-help">ตั้งค่าซิงก์เป็นรายชั่วโมงได้ใน Apps Script · เวลาแก้ต้นฉบับอาจต่างจากเวลาขึ้นเว็บ · สถานะนี้ไม่ได้ยืนยันว่า trigger ทำงานสำเร็จ</p><button type="button">ตรวจข้อมูลใหม่</button><a class="update-reload" href="" hidden>มีข้อมูลใหม่ — โหลดหน้านี้อีกครั้ง ↻</a>';
  footer.prepend(box);
  const summary = box.querySelector('.update-summary');
  const counts = box.querySelector('.update-counts');
  const times = box.querySelector('.update-times');
  const button = box.querySelector('button');
  const reload = box.querySelector('.update-reload');
  reload.href = location.href;
  const labels = { it: 'IT', apple: 'Apple', skin: 'ดูแลตัวเอง', style: 'แบรนด์ไทย' };
  const format = value => new Intl.DateTimeFormat('th-TH', {dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Bangkok'}).format(new Date(value));
  let initial = null;
  let busy = false;
  async function check() {
    if (busy) return;
    busy = true; button.disabled = true;
    try {
      const response = await fetch(new URL('articles.json', base), {cache:'no-cache'});
      if (!response.ok) throw Error('feed');
      const data = await response.json();
      if (!Array.isArray(data.articles)) throw Error('format');
      const fingerprint = JSON.stringify(data.articles);
      if (initial === null) initial = fingerprint;
      const changed = fingerprint !== initial;
      summary.textContent = changed ? 'พบข้อมูลต่างจากตอนเปิดหน้านี้ กดโหลดหน้าอีกครั้งเพื่ออ่านชุดใหม่' : 'โหลดไฟล์ข้อมูลบนเว็บได้แล้ว';
      reload.hidden = !changed;
      const totals = Object.keys(labels).map(key => labels[key] + ' ' + data.articles.filter(a => a.category === key).length + ' เรื่อง');
      counts.textContent = totals.join(' · ');
      const stamps = data.articles.map(a => Date.parse(a.updatedAt)).filter(Number.isFinite);
      const modified = response.headers.get('last-modified');
      const details = ['ตรวจจากเบราว์เซอร์: ' + format(Date.now())];
      if (modified && Number.isFinite(Date.parse(modified))) details.push('ไฟล์ข้อมูลบนเว็บ: ' + format(modified));
      if (stamps.length) details.push('ต้นฉบับแก้ไขล่าสุด: ' + format(Math.max(...stamps)));
      times.textContent = details.join(' · ') + ' (เวลาไทย)';
    } catch {
      summary.textContent = 'ตรวจข้อมูลไม่สำเร็จ ลองใหม่ได้ ข้อมูลที่อ่านอยู่ยังคงเดิม';
    } finally {busy = false; button.disabled = false;}
  }
  button.addEventListener('click', check);
  document.addEventListener('visibilitychange', () => {if (!document.hidden) check();});
  setInterval(() => {if (!document.hidden) check();}, 5 * 60 * 1000);
  check();
})();

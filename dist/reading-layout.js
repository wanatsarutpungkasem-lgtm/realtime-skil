/* จัดข้อความรายงานให้อ่านง่าย ไม่เรียก AI และไม่แก้ต้นฉบับ */
(() => {
  'use strict';
  function format() {
    document.querySelectorAll('body[data-page="feed-article"] .prose:not([data-reading-layout])').forEach(prose => {
      const originals = Array.from(prose.querySelectorAll('.feed-paragraph'));
      if (!originals.length) return;
      const fragment = document.createDocumentFragment();
      let list = null;
      originals.forEach(original => {
        original.textContent.split(/\r?\n/).forEach(raw => {
          const line = raw.trim();
          if (!line) { list = null; return; }
          const subheading = /^\d+\.\d+(?:\.\d+)*\s+/.test(line);
          const heading = /^\d+[.)]\s+/.test(line);
          const bullet = /^[-•●]\s+/.test(line);
          let block;
          if (bullet) {
            if (!list) { list = document.createElement('ul'); list.className = 'report-list'; fragment.append(list); }
            block = document.createElement('li');
            // คงเครื่องหมายต้นฉบับไว้ด้วย ไม่ลบข้อความที่ผู้อ่านได้รับ
            block.textContent = line; list.append(block); return;
          }
          list = null;
          block = document.createElement(subheading ? 'h3' : heading ? 'h2' : 'p');
          block.className = subheading ? 'report-subheading' : heading ? 'report-heading' : 'report-paragraph';
          const label = !heading && !subheading && line.match(/^([^:：\n]{2,75}[:：])\s*(.*)$/u);
          if (label && /\p{L}/u.test(label[1]) && !/^https?:/i.test(line)) {
            const strong = document.createElement('strong'); strong.textContent = label[1];
            block.append(strong, document.createTextNode(line.slice(label[1].length)));
          } else block.textContent = line;
          if (/^\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2}/.test(line)) block.classList.add('report-timestamp');
          if (/^แหล่งอ้างอิง[:：]/.test(line)) block.classList.add('report-reference');
          fragment.append(block);
        });
      });
      prose.replaceChildren(fragment);
      prose.dataset.readingLayout = 'true';
    });
  }
  const main = document.querySelector('main');
  if (main) new MutationObserver(format).observe(main, {childList:true,subtree:true});
  format();
})();

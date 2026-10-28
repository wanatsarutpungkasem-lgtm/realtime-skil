/* Public article feed: no credentials, no paid APIs. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src);
  const labels = {it:'IT น่ารู้',apple:'โลกของ Apple',skin:'ดูแลตัวเอง',style:'แบรนด์ไทย'};
  let articles = [], loaded = false;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => {try {const u = new URL(value);return u.protocol === 'https:' ? u.href : null;} catch {return null;}};
  const date = value => new Intl.DateTimeFormat('th-TH',{dateStyle:'medium',timeZone:'Asia/Bangkok'}).format(new Date(value));
  function credit() {
    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('.creator-credit')) {
      const p = document.createElement('p');p.className='creator-credit';
      p.textContent='Created by Wanatsarut · อ้ายโอห์ม แฟนเชลซี';footer.append(p);
    }
  }
  function cards() {
    credit();
    if (!loaded || document.body.dataset.page === 'feed-article') return;
    const main = document.querySelector('main');
    if (!main || main.querySelector('#approved-feed')) return;
    const hash = location.hash || '#/';
    if (!/^#\/(?:$|archive$|category\/)/.test(hash)) return;
    const category = hash.match(/^#\/category\/(it|apple|skin|style)$/)?.[1];
    const items = articles.filter(a=>!category || a.category === category);
    if (!items.length) return;
    const section = document.createElement('section');section.id='approved-feed';section.className='section wrap';
    section.innerHTML=`<div class="section-head"><div><div class="eyebrow">FROM THE EDITOR'S DESK</div><h2>เรื่องใหม่จากคลังของเรา</h2></div></div><p class="filter-note">รายงานที่ AI รวบรวมจาก 4 หมวด · ยังไม่ได้ตรวจยืนยันทุกรายการ · วันที่แสดงคือเวลาแก้ไขต้นฉบับ</p><div class="article-grid">${items.map(a=>`<article class="story"><div class="story-top"><span class="category">${escape(labels[a.category])}</span><span class="status">${a.reviewStatus==='unverified'?'AI รวบรวม · รอตรวจ':'บทความ'}</span><span>${escape(date(a.updatedAt))}</span></div><h3><a href="${escape(new URL('article.html?id='+encodeURIComponent(a.id),base).href)}">${escape(a.title)}</a></h3><p>${escape(a.body.slice(0,160))}${a.body.length>160?'…':''}</p><a class="source-link" href="${escape(new URL('article.html?id='+encodeURIComponent(a.id),base).href)}">อ่านบทความ ↗</a></article>`).join('')}</div>`;
    const target=main.querySelector('#stories');
    if(target)target.before(section);else main.append(section);
  }
  async function renderArticle() {
    if(document.body.dataset.page!=='feed-article')return;
    const main=document.querySelector('main');
    const id=new URL(location.href).searchParams.get('id');
    let a=articles.find(x=>x.id===id);
    if(!a){main.innerHTML='<h1>ไม่พบบทความ</h1><p>บทความอาจยังไม่เผยแพร่หรือถูกนำออกจากคลัง</p><a class="source-link" href="index.html">กลับหน้าแรก</a>';return;}
    if(a.contentPath){
      if(!/^article-data\/[a-f0-9]{20}\.json$/.test(a.contentPath)){main.innerHTML='<p>เส้นทางบทความไม่ถูกต้อง</p>';return;}
      try{const r=await fetch(new URL(a.contentPath,base),{cache:'no-cache'});if(!r.ok)throw Error('article');const full=await r.json();if(full.id!==id||typeof full.body!=='string'||!Array.isArray(full.sources))throw Error('format');a=full;}catch{main.innerHTML='<h1>ยังโหลดเนื้อหาไม่ได้</h1><p>ระบบอาจกำลังอัปเดต กรุณาลองใหม่ภายหลัง</p><a href="index.html">กลับหน้าแรก</a>';return;}
    }
    document.documentElement.lang='th';document.title=a.title+' — ชอบไปเรื่อย';
    main.innerHTML=`<a class="back" href="index.html#/category/${escape(a.category)}">← ${escape(labels[a.category])}</a><article><div class="eyebrow">DAILY AI REPORT</div><h1>${escape(a.title)}</h1><p>ต้นฉบับแก้ไข ${escape(date(a.updatedAt))} · ${escape(a.author)}</p><div class="notice">${a.reviewStatus==='unverified'?'รายงานนี้ AI รวบรวมจากแหล่งต่าง ๆ ยังไม่ได้ตรวจยืนยันทุกรายการ อาจมีข้อมูลคลาดเคลื่อน โปรดตรวจแหล่งต้นฉบับก่อนนำไปใช้':'บทความที่เจ้าของเว็บไซต์เลือกเผยแพร่'}</div><div class="prose">${a.body.split(/\n\s*\n/).map(p=>`<p class="feed-paragraph">${escape(p)}</p>`).join('')}</div><h2>แหล่งอ้างอิง</h2>${!a.sources.length?'<p class="filter-note">เอกสารต้นทางไม่ได้แนบ URL แหล่งอ้างอิงที่อ่านได้ ยังไม่สามารถตรวจย้อนกลับจากหน้านี้</p>':''}<ul class="feed-sources">${a.sources.map(s=>safeUrl(s)).filter(Boolean).map(s=>`<li><a href="${escape(s)}" target="_blank" rel="noopener noreferrer">${escape(new URL(s).hostname)} ↗</a></li>`).join('')}</ul></article>`;
  }
  fetch(new URL('articles.json',base),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('feed');return r.json();}).then(data=>{
    if(!Array.isArray(data.articles))throw Error('format');
    articles=data.articles.filter(a=>a&&typeof a.id==='string'&&typeof a.title==='string'&&typeof a.body==='string'&&labels[a.category]&&Array.isArray(a.sources)&&Number.isFinite(Date.parse(a.updatedAt)));
    loaded=true;cards();renderArticle();
  }).catch(()=>{if(document.body.dataset.page==='feed-article')document.querySelector('main').innerHTML='<h1>ยังโหลดบทความไม่ได้</h1><p>กรุณาลองใหม่ภายหลัง</p><a href="index.html">กลับหน้าแรก</a>';});
  const main=document.querySelector('main');
  if(main)new MutationObserver(cards).observe(main,{childList:true});
  credit();
})();

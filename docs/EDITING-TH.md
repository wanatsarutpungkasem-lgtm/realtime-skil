# แก้เว็บไซต์ตรงไหน

CSS ใช้แก้รูปแบบ ไม่ใช้แก้ข้อความบทความ

| สิ่งที่แก้ | ไฟล์/ตำแหน่ง |
|---|---|
| สีพื้นหลังเริ่มต้น สีข้อความ สีตกแต่ง | `dist/style.css` ส่วน `:root`: `--paper`, `--ink`, `--accent`, `--lime` |
| ฟอนต์ ขนาดและระยะตัวอักษร | `dist/typography.css` |
| ขนาด/ตำแหน่งปุ่มปรับสีและลิงก์ติดต่อ | `dist/site-settings.css` |
| ชื่อ TikTok/Facebook และ URL | `dist/site-settings.js` ส่วน `CONTACTS` |
| คำบนเมนู โลโก้ และ footer หน้าแรก | `dist/index.html` |
| หัวข้อหน้าแรก คำอธิบายหมวด และบทความตัวอย่าง | `dist/app.js` |
| บทความจริงที่ซิงก์จาก Drive | แก้ Google Docs ต้นฉบับใน 4 โฟลเดอร์ ระบบจะส่งรอบถัดไป อย่าแก้ `articles.json` หรือ `article-data/*.json` ด้วยมือเพราะซิงก์จะเขียนทับ |
| ข้อความระบบการ์ด/หน้าอ่าน และคำอธิบายสถานะ | `dist/feed.js` |
| shell หน้าอ่านบทความ | `dist/article.html` |

## ทำให้การแก้ไขขึ้นออนไลน์

- แก้ผ่านเว็บไซต์ GitHub: เปิดไฟล์ > รูปดินสอ > แก้ > Commit changes ลง main แล้วรอ Actions ผ่าน ไม่ต้องอัปโหลดไฟล์ซ้ำ
- แก้ไฟล์ในคอม: Save อย่างเดียวเปลี่ยนเฉพาะเครื่อง ต้องอัปโหลดเฉพาะไฟล์ที่แก้ไปยังตำแหน่งเดิมใน GitHub หรือ commit + push แล้วรอ Actions
- Apps Script sync ส่งเนื้อหาและ renderer ตามเวอร์ชัน การแก้ renderer (`feed.js`, `article.html`, `feed.css`) อาจถูก installer รุ่นใหม่เขียนทับในอนาคต จึงควรปรับสำเนา template ในชุด Apps Script ด้วยเมื่ออัปเกรด
- สีที่ผู้ชมเลือกจำใน localStorage เฉพาะเบราว์เซอร์ ไม่ได้แก้ GitHub หรือเปลี่ยนสีให้ทุกคน หากแก้สีเริ่มต้นใน CSS แล้วไม่เห็นผล ให้กดคืนค่าสีเริ่มต้น

## ติดตั้งผ่าน Apps Script ที่เชื่อมไว้แล้ว

1. สร้างไฟล์ `Customize.gs` ใน Apps Script โปรเจ็กต์เดิม
2. วางโค้ดจาก Customize.gs ในชุดนี้ ไม่ต้องวางทับ sync.gs
3. Save > เลือก installContactAndTheme > Run ครั้งเดียว
4. การรันจะเพิ่ม site-settings.css/site-settings.js และแก้ HTML ให้เรียกใช้ โดยอ่าน source GitHub ล่าสุดก่อน commit ร่วมกันหนึ่งครั้ง ไม่แตะ GITHUB_TOKEN หรือข้อมูลบทความ
5. รอ Actions สำเร็จและ refresh หน้าเว็บ

## ตรวจแล้ว

Syntax ผ่าน; browser QA ในเครื่องพบปุ่มมุมขวาบน เปิดแผง เลือกธีมเข้มได้ และลิงก์ TikTok/Facebook ถูกต้อง
ยังไม่ได้เผยแพร่จากฝั่ง assistant เพราะตัวเชื่อมต่อ GitHub ปฏิเสธสิทธิ์เขียน ต้องรัน installer ผ่าน Apps Script ของเจ้าของ

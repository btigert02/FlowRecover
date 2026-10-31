# 📣 แผนโปรโมท FlowRecover x Life Planner — Threads + Facebook (3 โพสต์)

> เป้าหมาย: ให้ลูกค้าเห็นแอด → กดเข้าเว็บ → ล็อกอิน Google → **ทดลองใช้ฟรี 7 วัน** → จ่าย 99฿ ผ่าน **บัตร หรือ QR PromptPay** → ได้สิทธิ์ PRO ทันที
> ทุกขั้นตอนหลังคลิกแอดเป็น **อัตโนมัติ 100%** ไม่ต้องมีแอดมินตอบแชท

---

## 0. ระบบ Funnel อัตโนมัติ (ทำครั้งเดียว ใช้ได้ตลอด)

```
แอด Threads / Facebook  ──►  เว็บแอป (?lang=th&utm_...)
        │                         │  Pixel: PageView
        ▼                         ▼
  Retarget คนที่ดูแต่ไม่สมัคร   ล็อกอิน Google → เริ่มทดลอง 7 วัน
                                  │  Pixel: CompleteRegistration + StartTrial
                                  ▼
                       แจ้งเตือนในแอป วันที่ 6–7 "ใกล้หมดทดลองแล้ว"
                                  │
                                  ▼
                   Paywall → 💳 บัตร (ต่ออายุทุกเดือน) / 📱 QR PromptPay (30 วัน)
                                  │  Pixel: InitiateCheckout
                                  ▼
                   Stripe Checkout → Webhook → Firestore = PRO
                                  │  Pixel: Purchase (99 THB)
                                  ▼
                          ใช้งานต่อได้ทันที ✅
```

**สิ่งที่ต้องตั้งก่อนยิงแอด**
1. ใส่ `META_PIXEL_ID` ใน `index.html` (สร้าง Pixel ที่ Meta Events Manager)
2. ใน Stripe ตั้ง redirect ของลิงก์บัตรเป็น `https://<โดเมน>/?stripe_status=success` และสร้างลิงก์ QR (ดู `SETUP.md`)
3. ตั้ง `SHOW_OWNER_SIMULATOR = false`
4. ยืนยันโดเมนใน Meta Business และตั้ง Aggregated Event Measurement: `Purchase` > `StartTrial` > `CompleteRegistration`

---

## 🔥 โพสต์ที่ 1 — "Pain Point" (ดึงคนที่โดนงานแทรกทุกวัน)

**ภาพ:** [marketing/post1_before_after.jpg](marketing/post1_before_after.jpg) (1:1)
**เป้าหมายแอด:** Traffic → ปรับเป็น Leads/Sales เมื่อ Pixel มีข้อมูล

### Facebook (TH)
> **วางแผนไว้สวย… แต่ 10 โมงก็พังแล้ว? 😩**
>
> หัวหน้าเรียกด่วน ลูกค้าโทรมา งานแทรกเข้ามาไม่หยุด
> แล้วตารางทั้งวันก็พังทั้งแผง ต้องมานั่งจัดใหม่เอง…
>
> **FlowRecover** แก้ตรงนี้ให้ 👇
> ⚡ กด "งานแทรก" ปุ่มเดียว → ระบบหยุดเวลาให้
> 🔄 กลับมาทำต่อ → ตารางที่เหลือ **เลื่อนตัวเองอัตโนมัติ**
> 📒 มี Life Planner ครบ ทั้งเป้าหมาย สุขภาพ การเงิน งาน
>
> 🎁 **ใช้ฟรี 7 วัน** แค่ล็อกอิน Google ไม่ต้องใส่บัตร
> 👉 เริ่มเลย: [ลิงก์]
>
> #วางแผนชีวิต #TimeBlocking #จัดการเวลา #ฟรีแลนซ์ #มนุษย์เงินเดือน

### Threads (TH) — สั้น เล่าเหมือนเพื่อนบ่น
> ใครเป็นบ้าง วางแผนทั้งคืน พอ 10 โมงโดนงานแทรก ตารางพังหมด 🫠
>
> เลยทำแอปที่กด "งานแทรก" แล้วมันจัดตารางที่เหลือใหม่ให้เอง
> ลองฟรี 7 วัน ไม่ต้องใส่บัตร 👇
> [ลิงก์]

### EN (สำหรับกลุ่มต่างชาติ/expat)
> **Planned the perfect day… ruined by 10 AM?** 😩
> FlowRecover pauses your time when interruptions hit and **auto-reflows** the rest of your schedule.
> 🎁 Free for 7 days — just sign in with Google. 👉 [link]

---

## 🚀 โพสต์ที่ 2 — "Feature Showcase" (โชว์ว่าแอปทำอะไรได้)

**ภาพ:** [marketing/post2_app_showcase.jpg](marketing/post2_app_showcase.jpg) (4:5 / 3:4 — เหมาะ Feed มือถือ)
**แนะนำ:** ทำเป็นวิดีโอ Reels 15 วิ อัดหน้าจอจริง: เพิ่มงาน → กดงานแทรก → ตารางเลื่อนเอง

### Facebook (TH)
> **1 แอป แทน 5 แอป** 📱✨
>
> ✅ Focus Cockpit — จับเวลาโฟกัส + ปุ่มงานแทรก
> ✅ ตารางยืดหยุ่น — เลื่อนเองเมื่อแผนเปลี่ยน
> ✅ กิจวัตร — นับ Streak สร้างนิสัยดี
> ✅ โปรเจค — แชร์ลิงก์ให้ทีม + ผังเชื่อมโยง
> ✅ Life Planner — เป้าหมาย สุขภาพ การเงิน งาน ครบ
> ✅ แจ้งเตือนถึงมือถือ/สมาร์ทวอทช์
>
> ใช้ได้ทั้งมือถือและคอม ภาษาไทย/อังกฤษ
> 💸 หลังทดลองฟรี 7 วัน **แค่ 99฿/เดือน** (ถูกกว่ากาแฟ 2 แก้ว)
> 👉 [ลิงก์]
>
> #ProductivityApp #LifePlanner #แอปจัดตาราง #พัฒนาตัวเอง

### Threads (TH)
> แอปจดงาน + จับเวลาโฟกัส + Life Planner + เตือนถึงนาฬิกา รวมไว้ที่เดียว
> 99฿/เดือน แต่ลองฟรีได้ก่อน 7 วัน 🙌
> [ลิงก์]

### EN
> **One app instead of five.** Focus timer, flexible queue, habits, projects & a full Life Planner.
> 7 days free, then just 99฿/month. 👉 [link]

---

## 💳 โพสต์ที่ 3 — "Offer + ปิดการขาย" (Retarget คนที่เคยเข้าเว็บ/เริ่มทดลอง)

**ภาพ:** [marketing/post3_offer.jpg](marketing/post3_offer.jpg) (1:1)
**กลุ่มเป้าหมาย:** Custom Audience = เข้าเว็บ 30 วัน + StartTrial แต่ **ยังไม่ Purchase**

### Facebook (TH)
> **ช่วงทดลองใช้ใกล้หมดแล้วหรือยัง?** ⏳
>
> ข้อมูลทั้งหมดของคุณ ตาราง โปรเจค และ Life Planner **ยังอยู่ครบ**
> ต่ออายุ PRO แค่ **99฿** จ่ายได้ 2 แบบ:
> 📱 **สแกน QR PromptPay** ผ่านแอปธนาคาร ใช้ได้ 30 วัน
> 💳 **บัตรเครดิต/เดบิต** ต่ออายุอัตโนมัติ ยกเลิกได้ทุกเมื่อ
>
> จ่ายเสร็จ ปลดล็อกทันที ไม่ต้องรอแอดมิน ⚡
> 👉 [ลิงก์]
>
> #FlowRecover #จ่ายผ่านQR #PromptPay

### Threads (TH)
> ใครลองครบ 7 วันแล้วติดใจ ต่อแค่ 99฿
> สแกน QR พร้อมเพย์ได้เลย ไม่ต้องมีบัตร ✌️
> [ลิงก์]

### EN
> Your data is safe and waiting. Unlock PRO for 99฿: **PromptPay QR** or **card**. Instant access. 👉 [link]

---

## 🎯 การตั้งค่าแอด (Meta Ads Manager — ยิงทั้ง Facebook + Threads ในแคมเปญเดียว)

> Threads Ads ตั้งจาก Ads Manager โดยเลือก Placement **Threads** (ต้องเปิด Instagram/Threads placement ด้วย)

| | แคมเปญ A — หาคนใหม่ | แคมเปญ B — ปิดการขาย |
|---|---|---|
| โพสต์ | #1 + #2 (A/B test) | #3 |
| Objective | **Sales** → Conversion: `StartTrial` (เปลี่ยนเป็น `Purchase` เมื่อมี 50+ ครั้ง/สัปดาห์) | **Sales** → `Purchase` |
| Audience | ไทย อายุ 22–45 · สนใจ Productivity, Notion, Time management, Freelance, Startup, พัฒนาตัวเอง · หรือ **Advantage+ Audience** | Website visitors 30 วัน + StartTrial **ยกเว้น** Purchase |
| Placement | Advantage+ (FB Feed, Reels, Threads, IG) | FB Feed + Threads + IG Stories |
| งบเริ่มต้น | 200–300฿/วัน | 100฿/วัน |
| ระยะทดสอบ | 5–7 วัน แล้วปิดตัวที่ CPA แพง | ต่อเนื่อง |

**ตัวชี้วัด (KPI) เป้าหมาย**
- CTR > 1.5% · ต้นทุนต่อ StartTrial < 30฿ · Trial → Paid > 15%
- ต้นทุนต่อ Purchase < 99฿ = ได้กำไรตั้งแต่เดือนแรก (บัตรต่ออายุอัตโนมัติ = รายได้ต่อเนื่อง)

**A/B Test ที่ควรลอง:** Hook (Pain vs Feature) · ภาพนิ่ง vs วิดีโอหน้าจอ · "ฟรี 7 วัน" vs "99฿/เดือน" ใน headline

---

## 🔗 ลิงก์ UTM (แทน `<โดเมน>` ด้วยเว็บจริง)

| โพสต์ | Facebook | Threads |
|---|---|---|
| #1 | `https://<โดเมน>/?lang=th&utm_source=facebook&utm_medium=paid&utm_campaign=launch&utm_content=post1_pain` | `...utm_source=threads...&utm_content=post1_pain` |
| #2 | `...utm_source=facebook&utm_medium=paid&utm_campaign=launch&utm_content=post2_feature` | `...utm_source=threads...&utm_content=post2_feature` |
| #3 | `...utm_source=facebook&utm_medium=paid&utm_campaign=retarget&utm_content=post3_offer` | `...utm_source=threads...&utm_content=post3_offer` |

กลุ่ม EN ใช้ `?lang=en` แทน → แอปเปิดเป็นภาษาอังกฤษอัตโนมัติ

---

## 📅 ตารางโพสต์ 7 วันแรก

| วัน | สิ่งที่ทำ |
|---|---|
| 1 | โพสต์ #1 แบบออร์แกนิก (Page + Threads) → เริ่มแคมเปญ A |
| 3 | โพสต์ #2 ออร์แกนิก + เพิ่มเข้าแคมเปญ A |
| 5 | ดูผล: ปิดโฆษณาที่ CTR < 0.8% · เพิ่มงบตัวที่ดีที่สุด 20% |
| 7 | เริ่มแคมเปญ B (โพสต์ #3) ยิงหาคนที่เริ่มทดลองรุ่นแรกที่ใกล้หมดเวลา |
| 8+ | เปลี่ยน Conversion เป็น `Purchase` · สร้าง Lookalike 1% จากผู้ซื้อ |

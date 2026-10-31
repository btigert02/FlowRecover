# FlowRecover x Life Planner — คู่มือตั้งค่าขึ้นระบบจริง

ตอนนี้แอปทำงานได้ทันทีใน **โหมดสาธิต** (เก็บข้อมูลในเบราว์เซอร์ + จำลองล็อกอิน Google)
ทำตามขั้นตอนด้านล่างเพื่อเปิด Google Sign-In, ซิงค์คลาวด์ และ Stripe Webhook จริง

## 1. สร้าง Firebase Project
1. ไปที่ https://console.firebase.google.com → **Add project**
2. **Build → Authentication → Sign-in method** → เปิด **Google**
3. **Authentication → Settings → Authorized domains** → เพิ่มโดเมนเว็บของคุณ
4. **Build → Firestore Database** → Create database (แนะนำ region `asia-southeast1`)
5. **Project settings → General → Your apps → Web (</>)** → คัดลอก `firebaseConfig`

## 2. ใส่ค่า Config ใน `index.html`
แก้ object `FIREBASE_CONFIG` ด้านบนสุดของ `<script>` ให้เป็นค่าจริง
เมื่อ `apiKey` ไม่ขึ้นต้นด้วย `YOUR_` แอปจะสลับไปใช้ Firebase อัตโนมัติ

ก่อนเปิดให้ลูกค้าใช้จริง ให้ตั้ง `SHOW_OWNER_SIMULATOR = false`

## 3. Deploy (Hosting + Rules + Functions)
```bash
npm i -g firebase-tools
firebase login
firebase use --add            # เลือกโปรเจคของคุณ
cd functions && npm install && cd ..
firebase functions:secrets:set STRIPE_SECRET_KEY        # sk_live_... (หรือ sk_test_...)
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET    # whsec_... (ได้จากขั้นตอนที่ 4)
firebase deploy
```
> Cloud Functions ต้องใช้ Firebase แพ็กเกจ **Blaze** (จ่ายตามการใช้งาน — ปริมาณน้อยแทบไม่มีค่าใช้จ่าย)

## 4. ตั้งค่า Stripe (บัตรเครดิต + QR PromptPay)

> [!IMPORTANT]
> Stripe **PromptPay รองรับเฉพาะการจ่ายครั้งเดียว** (ไม่รองรับ Subscription ตัดเงินอัตโนมัติ)
> จึงต้องมี **2 ลิงก์**: บัตร = รายเดือนต่ออายุอัตโนมัติ, QR = จ่ายครั้งละ 99฿ ได้ 30 วัน

**4.1 เปิดใช้ PromptPay** — Stripe Dashboard → **Settings → Payment methods** → เปิด **PromptPay** และ **Cards**
(บัญชี Stripe ต้องเป็นบัญชีประเทศไทย และสกุลเงินราคาเป็น THB)

**4.2 ลิงก์บัตรเครดิต (มีอยู่แล้ว)** `https://buy.stripe.com/8x2dR9fVC8CCb1d3PS00001`
- เป็น Subscription 99 THB / month
- Edit → **After payment** → Redirect ไปที่ `https://YOUR_DOMAIN/?stripe_status=success`

**4.3 สร้างลิงก์ QR PromptPay (ใหม่)**
- Product catalog → สร้างราคา **99 THB แบบ One-time** → Create payment link
- Payment methods: เลือก **PromptPay** (และ Card ก็ได้)
- After payment → Redirect ไปที่ `https://YOUR_DOMAIN/?stripe_status=success&plan=qr`
- นำลิงก์ไปใส่ `STRIPE_QR_LINK` ใน `index.html`

**4.4 Webhook** — Developers → Webhooks → Add endpoint
- URL: `https://YOUR_DOMAIN/api/stripe-webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.deleted`
- คัดลอก **Signing secret** (`whsec_...`) ไปตั้งเป็น `STRIPE_WEBHOOK_SECRET` แล้ว `firebase deploy --only functions`

ผลลัพธ์ใน Firestore:
| วิธีจ่าย | `plan` | `pro_until` |
|---|---|---|
| 💳 บัตร (subscription) | `card_subscription` | ไม่มี (PRO จนกว่าจะยกเลิก) |
| 📱 PromptPay (one-time) | `promptpay_30d` | วันนี้ (หรือวันหมดอายุเดิม) + 30 วัน |

## 5. Meta Pixel (สำหรับยิงแอด Facebook / Threads)
1. Meta Events Manager → Connect data source → Web → สร้าง Pixel → คัดลอก Pixel ID
2. ใส่ใน `META_PIXEL_ID` ใน `index.html`
3. Event ที่ส่งอัตโนมัติ: `PageView` → `CompleteRegistration` + `StartTrial` (ล็อกอินครั้งแรก) → `InitiateCheckout` (กดจ่าย) → `Purchase` (กลับจาก Stripe สำเร็จ, value 99 THB)
4. ตั้งแคมเปญ Sales ให้ Optimize ที่ `Purchase` (หรือ `StartTrial` ช่วงแรกที่ยังมี Purchase น้อย)

## เปลี่ยนภาษา
- ผู้ใช้กดปุ่ม **EN / TH** ด้านบน (หรือในหน้า Login / Paywall / บัญชี)
- ภาษาเริ่มต้นตามภาษาเบราว์เซอร์ หรือบังคับด้วย URL `?lang=th` / `?lang=en` (ใช้กับลิงก์แอดแต่ละภาษา)
- หน้า Stripe จะแสดงภาษาเดียวกันอัตโนมัติ (`locale`)

## วิธีจับคู่ผู้ใช้กับการชำระเงิน
- แอปจะแนบ `?prefilled_email={email}` และ `client_reference_id={uid}` ไปกับลิงก์ Stripe
- Webhook หา user จาก `client_reference_id` → `stripe_customer_id` → `email` ตามลำดับ
- ถ้าชำระก่อนล็อกอินครั้งแรก ระบบจะเก็บไว้ใน `pending_subscriptions` แล้วนำไปใช้ตอนสร้างบัญชี

## ความปลอดภัย
- `firestore.rules` **ไม่ให้** ฝั่งเว็บแก้ `subscription_status` / `trial_start_at` เอง — มีแต่ Webhook (Admin SDK) ที่แก้ได้
- เมื่อกลับมาจาก Stripe ด้วย `?stripe_status=success` หรือ `?payment=success` แอปจะปลดล็อก PRO ไปก่อนชั่วคราว (สูงสุด 30 นาที) ระหว่างรอ Webhook ยืนยัน
- `trial_start_at` ใช้เวลาจากเซิร์ฟเวอร์ (`request.time`) ป้องกันการแก้เวลาเครื่องเพื่อยืดช่วงทดลองใช้

## โครงสร้างข้อมูล Firestore
```
users/{uid}
  email, name, photo, trial_start_at, subscription_status ('trial'|'pro'|'canceled'),
  stripe_customer_id, stripe_subscription_id, pro_since, created_at
users/{uid}/data/main
  payload (JSON: tasks, routines, projects, ideas, focus, alerts, planner), updated_at
```

## ทดสอบในเครื่อง
```bash
npx -y serve .        # แล้วเปิด http://localhost:3000
```

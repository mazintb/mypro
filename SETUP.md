# 🚀 دليل إعداد المنصة — خطوة بخطوة

## الخطوة 1 — إنشاء مشروع Firebase

1. اذهب إلى: https://console.firebase.google.com
2. اضغط **"Add project"** أو **"إضافة مشروع"**
3. اكتب اسم المشروع (مثال: `my-asset-platform`)
4. اضغط **Continue** وأكمل حتى **"Create project"**

---

## الخطوة 2 — تفعيل Authentication

1. من القائمة الجانبية اختر **Build → Authentication**
2. اضغط **"Get started"**
3. اختر **Email/Password**
4. فعّل الخيار الأول (**Enable**)
5. اضغط **Save**

---

## الخطوة 3 — إنشاء حساب المالك

1. في صفحة Authentication اضغط **Users** ثم **Add user**
2. أدخل:
   - Email: بريدك الإلكتروني
   - Password: كلمة مرور قوية
3. اضغط **Add user**
4. **احتفظ بهذا البريد وكلمة المرور** — هذا حساب المالك

---

## الخطوة 4 — إنشاء Firestore Database

1. من القائمة اختر **Build → Firestore Database**
2. اضغط **"Create database"**
3. اختر **"Start in production mode"**
4. اختر أقرب منطقة (مثال: `europe-west1` أو `us-central1`)
5. اضغط **Enable**

---

## الخطوة 5 — إضافة قواعد الأمان

1. في Firestore اضغط على تبويب **Rules**
2. احذف كل النص الموجود
3. الصق محتوى ملف `firestore.rules` من المشروع
4. اضغط **Publish**

---

## الخطوة 6 — الحصول على مفاتيح الاتصال

1. من إعدادات Firebase (⚙️ Project Settings)
2. في قسم **"Your apps"** اضغط **"</>  Web"**
3. اكتب اسم التطبيق واضغط **Register app**
4. **انسخ** كامل الـ `firebaseConfig` object
5. افتح ملف `src/firebase.js` في مشروعك
6. استبدل القيم الوهمية بقيمك الحقيقية

مثال:
```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXX",        // ← الصق قيمتك هنا
  authDomain: "my-app.firebaseapp.com",
  projectId: "my-app-12345",
  storageBucket: "my-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## الخطوة 7 — رفع المشروع على GitHub

```bash
cd finance-app
npm install
git init
git add .
git commit -m "initial commit with Firebase"
git branch -M main
git remote add origin https://github.com/USERNAME/finance-app.git
git push -u origin main
```

---

## الخطوة 8 — إعدادات Vercel

في لوحة Vercel:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- اضغط **Deploy** ✅

---

## الخطوة 9 — أول تسجيل دخول

1. افتح رابط المنصة من Vercel
2. أدخل البريد وكلمة المرور (المنشأين في الخطوة 3)
3. **أول دخول سيُنشئ ملفك كمالك تلقائياً**
4. من قسم **"إدارة المستخدمين"** تستطيع إضافة المساعد

---

## ⚠️ ملاحظات مهمة

- **لا تشارك** ملف `firebase.js` مع أي شخص
- Firebase مجاني بالكامل لعدد مستخدمين صغير
- البيانات تُحفظ تلقائياً كل 2 ثانية في السحابة
- يمكن الوصول من أي جهاز أو متصفح

---

## 🆘 مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| خطأ `Firebase: Error (auth/invalid-credential)` | تأكد من البريد وكلمة المرور |
| البيانات لا تُحفظ | تأكد من قواعد Firestore (الخطوة 5) |
| صفحة بيضاء | تأكد من `firebase.js` يحتوي على القيم الحقيقية |
| `permission-denied` | راجع قواعد firestore.rules |

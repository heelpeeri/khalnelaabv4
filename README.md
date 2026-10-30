# خل نلعب 🎮

منصة ألعاب جماعية للجلسات: فريقين على جهاز واحد، ثمان ألعاب، وبطل واحد.
اللعب يكون في نفس المكان، وصاحب الجلسة هو اللي يدير الجولات ويحكم.

## الألعاب

| اللعبة                     | المعرّف في الكود | الملف                                     |
| -------------------------- | ---------------- | ----------------------------------------- |
| خمن الكلمة                 | `word`           | `src/components/match/WordGame.tsx`       |
| أسئلة وأجوبة               | `quiz`           | `src/components/match/QuizGame.tsx`       |
| منهو ذا؟                   | `scramble`       | `src/components/match/ScrambleGame.tsx`   |
| لف وخمن                    | `wheel`          | `src/components/match/WheelGame.tsx`      |
| إنسان حيوان نبات جماد بلاد | `categories`     | `src/components/match/CategoriesGame.tsx` |
| خمن المثل                  | `draw`           | `src/components/match/ProverbGame.tsx`    |
| خمن الشعار                 | `logo`           | `src/components/match/LogoGame.tsx`       |
| خمن العلم                  | `country`        | `src/components/match/CountryGame.tsx`    |

## التشغيل

```bash
npm install
npm run dev
```

بعدها افتح `http://localhost:3000`.

| الأمر            | وش يسوي              |
| ---------------- | -------------------- |
| `npm run dev`    | تشغيل نسخة التطوير   |
| `npm run build`  | بناء نسخة الإنتاج    |
| `npm test`       | تشغيل الاختبارات     |
| `npm run lint`   | فحص الكود            |
| `npm run format` | تنسيق الكود تلقائيًا |

## بنية المشروع

```
src/
  app/
    page.tsx              الصفحة الرئيسية
    guide/                طريقة اللعب
    match/page.tsx        إدارة الجلسة: الإعداد، الجولات، النتيجة
    country/[id]/         صفحة العلم اللي تفتح من كود QR
    person/[id]/          صفحة الشخصية اللي تفتح من كود QR
  components/
    SetupGame.tsx         صفحة اختيار الألعاب والفرق
    match/                الألعاب الثمان وواجهات الجلسة المشتركة
  data/                   محتوى الألعاب (أسئلة، كلمات، أمثال، شعارات...)
  lib/                    القواعد المشتركة
    deck.ts               عدم تكرار المحتوى خلال الجلسة
    matchQueue.ts         بناء جولات الجلسة
    wordRules.ts          قواعد خمن الكلمة
    scoring.ts            تحديد الفائز بالنقاط
    qr.ts                 توليد أكواد QR داخل الموقع
    savedMatch.ts         حفظ الجلسة عند تحديث الصفحة
    roundState.ts         حفظ الجولة الحالية عند تحديث الصفحة
    shareImage.ts         صورة مشاركة النتيجة
tests/                    الاختبارات
public/images/            صور الألعاب
plans/                    خطط تحسين الحركة ومتابعتها
.claude/skills/           سكلز التصميم والحركة لـClaude Code
```

## إضافة محتوى

| اللعبة      | الملف                    | الصور                      | انتبه                                                  |
| ----------- | ------------------------ | -------------------------- | ------------------------------------------------------ |
| الأسئلة     | `src/data/quiz/*.ts`     | `public/images/` (اختياري) | الجواب لازم يكون مكتوب بنفس الشكل داخل الخيارات        |
| خمن الكلمة  | `src/data/words.ts`      |                            | 5 حروف، بدون همزة ولا ألف مقصورة، والتاء المربوطة عادي |
| لف وخمن     | `src/data/wheel.ts`      |                            | الحروف لازم تكون موجودة في كيبورد العجلة               |
| خمن المثل   | `src/data/proverbs.ts`   | `public/images/proverbs/`  |                                                        |
| خمن الشعار  | `src/data/logos.ts`      | `public/images/logo/`      | صورة مربعة بخلفية بيضاء والشعار في النص                |
| منهو ذا؟    | `src/data/scramble.ts`   | `public/images/people/`    | `id` جديد ما يتكرر                                     |
| خمن العلم   | `src/data/countries.ts`  | `public/images/flags/`     |                                                        |
| إنسان حيوان | `src/data/categories.ts` |                            | حرف واحد                                               |

فئة أسئلة جديدة: أضف ملفها في `src/data/quiz/`، وسجّلها في `meta.ts` و`index.ts`.

بعد أي إضافة شغّل `npm test`. الاختبارات تتأكد إن:

- جواب كل سؤال موجود في خياراته
- كل صورة لها ملف موجود
- كل كلمة تنكتب من الكيبورد
- ما فيه تكرار في المحتوى أو المعرّفات

## الدفع والتفعيل

اللعبة تنباع بدفعة وحدة عن طريق ميسّر. بعد الدفع يطلع للعميل كود تفعيل
(`KN-...`) ينحفظ في جهازه، ويقدر يفعّل فيه أي جهاز ثاني من صفحة `/unlock`.
ما فيه قاعدة بيانات ولا حسابات: الكود موقّع، والموقع يتحقق منه بدون ما يحفظ شي.

القفل مطفي افتراضيًا، يعني الموقع مجاني لين تضبط المتغيرات وتشغّله.

| المتغير                   | وش هو                                                    |
| ------------------------- | -------------------------------------------------------- |
| `PAYWALL_ENABLED`         | `true` يشغّل القفل على صفحة اللعب                        |
| `LICENSE_SECRET`          | سر توقيع أكواد الشراء، نص عشوائي طويل وما يتغير أبدًا    |
| `GIFT_SECRET`             | سر أكواد الإهداء، تغييره يلغي كل أكواد الإهداء القديمة   |
| `ADMIN_PASSWORD`          | كلمة مرور صفحة `/admin/gifts`                            |
| `MOYASAR_PUBLISHABLE_KEY` | المفتاح العام من لوحة ميسّر (`pk_...`)                   |
| `MOYASAR_SECRET_KEY`      | المفتاح السري من لوحة ميسّر (`sk_...`)، ما ينشارك مع أحد |
| `RESEND_API_KEY`          | اختياري: لإرسال الكود بالإيميل                           |
| `EMAIL_FROM`              | اختياري: الإيميل اللي ينرسل منه الكود                    |
| `NEXT_PUBLIC_SITE_URL`    | اختياري: رابط الموقع الأساسي                             |

توليد سر عشوائي:

```bash
openssl rand -base64 32
```

السعر في `src/lib/pricing.ts`، ورابط الموقع وبيانات التواصل في `src/data/site.ts`.

أكواد الإهداء: افتح `/admin/gifts`، اكتب كلمة المرور، واختر المدة.

## الفحص التلقائي

مع كل Pull Request وكل دمج في `main`، يشغّل GitHub بالترتيب:
فحص التنسيق، ثم الـlint، ثم الاختبارات، ثم البناء
(`.github/workflows/ci.yml`). لو فشل أي واحد منها يطلع ❌ قبل الدمج.

## النشر

الموقع يشتغل على Vercel أو Cloudflare.

**Vercel:** أي دمج في `main` ينشر النسخة الجديدة تلقائيًا.

**Cloudflare Workers:** الإعدادات في `wrangler.jsonc` و`open-next.config.ts`.

| الإعداد في Cloudflare | القيمة                             |
| --------------------- | ---------------------------------- |
| Build command         | `npx opennextjs-cloudflare build`  |
| Deploy command        | `npx opennextjs-cloudflare deploy` |
| Variables and Secrets | نفس متغيرات قسم الدفع والتفعيل     |

تجربة نسخة Cloudflare محليًا: حط المتغيرات في `.dev.vars` وشغّل `npm run cf:preview`.

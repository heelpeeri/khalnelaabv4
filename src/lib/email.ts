export function isEmailEnabled() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function isValidEmail(email: string) {
  return email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sendLicenseEmail({
  to,
  code,
  origin,
}: {
  to: string;
  code: string;
  origin: string;
}) {
  if (!isEmailEnabled() || !isValidEmail(to)) {
    return false;
  }

  const unlockUrl = `${origin}/unlock?code=${encodeURIComponent(code)}`;

  const html = `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;font-size:16px;line-height:1.8;color:#111">
<p>هلا! شكرًا لشرائك <b>خل نلعب</b> 🎮</p>
<p>هذا كود التفعيل حقك، احفظه عشان تفعّل اللعبة على أي جهاز:</p>
<p style="font-size:20px;font-weight:bold;letter-spacing:1px;direction:ltr;text-align:right">${code}</p>
<p><a href="${unlockUrl}">فعّل اللعبة على جهاز ثاني</a></p>
<p style="color:#666;font-size:13px">ما نحتفظ بإيميلك، استخدمناه بس لإرسال هذي الرسالة.</p>
</div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject: "كود تفعيل خل نلعب 🎮",
        html,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

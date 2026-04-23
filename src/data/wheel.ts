export type WheelValue = number | "bankrupt" | "lose";
export const WHEEL_SEGMENTS = [
  { label: "100", value: 100, color: "#22c55e" },
  { label: "200", value: 200, color: "#3b82f6" },
  { label: "300", value: 300, color: "#a855f7" },
  { label: "500", value: 500, color: "#f59e0b" },
  { label: "إفلاس", value: "bankrupt", color: "#ef4444" },
  { label: "خسارة الدور", value: "lose", color: "#6b7280" },
];

export const WHEEL_PUZZLES = [
  { answer: "معصوب", category: "أكل" },
  { answer: "مقشوش", category: "أكل" },
  { answer: "قرصان", category: "أكل" },
  { answer: "مثلوثة", category: "أكل" },

  { answer: "أسعد الزهراني", category: "ممثل سعودي" },
  { answer: "عبدالمحسن النمر", category: "ممثل سعودي" },
  { answer: "خالد سامي", category: "ممثل سعودي" },
  { answer: "خالد صقر", category: "ممثل سعودي" },

  { answer: "سويسرا", category: "دولة" },
  { answer: "كولومبيا", category: "دولة" },
  { answer: "المكسيك", category: "دولة" },
  { answer: "جمهورية نيكاراغوا", category: "دولة" },

  { answer: "قوتشي", category: "براند عالمي" },
  { answer: "كارتير", category: "براند عالمي" },
  { answer: "لويس فيتون", category: "براند عالمي" },

  { answer: "تاهو", category: "سيارة" },
  { answer: "كورولا", category: "سيارة" },
  { answer: "ازيرا", category: "سيارة" },
  { answer: "اكسنت", category: "سيارة" },

  { answer: "ريد بول", category: "مشروب" },
  { answer: "كينزا", category: "مشروب" },
  { answer: "دكتور بيبر", category: "مشروب" },

  { answer: "روبرتو كارلوس", category: "لاعب" },
  { answer: "بنزيما", category: "لاعب" },
  { answer: "رونالدينيو", category: "لاعب" },

  { answer: "هنقرستيشن", category: "تطبيق" },
  { answer: "اوتلوك", category: "تطبيق" },
  { answer: "المسافر", category: "تطبيق" },

  { answer: "وينديز", category: "مطعم" },
  { answer: "بوبايز", category: "مطعم" },
  { answer: "بيت الشواية", category: "مطعم" },
  { answer: "بيت الشاورما", category: "مطعم" },
  { answer: "دجاج تكساس", category: "مطعم" },

  { answer: "مكتبة جرير", category: "شركة سعودية" },
  { answer: "أرامكو السعودية", category: "شركة سعودية" },
  { answer: "طيران ناس", category: "شركة سعودية" },
  { answer: "العبيكان للنشر", category: "شركة سعودية" },

  { answer: "الأحوال المدنية", category: "جهة حكومية" },
  { answer: "أمانة الرياض", category: "جهة حكومية" },
  { answer: "وزارة السياحة", category: "جهة حكومية" },
  { answer: "وزارة الرياضة", category: "جهة حكومية" },

  { answer: "الأمن السيبراني", category: "تخصص" },
  { answer: "تكنولوجيا المعلومات", category: "تخصص" },
  { answer: "هندسة الطيران", category: "تخصص" },

  { answer: "أبو العصافير", category: "مسلسل سعودي" },
  { answer: "كلنا عيال قرية", category: "مسلسل سعودي" },
  { answer: "حارة الشيخ", category: "مسلسل سعودي" },

  { answer: "دار الحكمة", category: "جامعة سعودية" },
  { answer: "دار العلوم", category: "جامعة سعودية" },
  { answer: "الأمير سلطان", category: "جامعة سعودية" },
];

export const WHEEL_LETTER_ROWS = [
  "دجحخهعغفقثصض",
  "طكمنتالبيسش",
  "ذظزوئر",
];


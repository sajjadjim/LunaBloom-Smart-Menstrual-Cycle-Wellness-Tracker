import React from "react";
import { BookOpen, ShieldAlert, Heart, Droplet, Sparkles, CheckCircle2 } from "lucide-react";

export default function WellnessGuidePage() {
  const topics = [
    {
      title: "Understanding Your Menstrual Cycle 🌸",
      content:
        "Menstruation is a healthy biological rhythm during which the uterus sheds its inner lining (endometrium). Typical cycle lengths range between 21 and 35 days, counted from the first day of flow until the day before the next period starts.",
    },
    {
      title: "Menstrual Product Hygiene & Safety 🧼",
      content:
        "Whether you prefer disposable pads, reusable cloth pads, tampons, or menstrual cups, consistent hygiene preserves your natural vaginal microbiome.",
      tips: [
        "Change sanitary pads every 4 to 6 hours, regardless of how light the flow is.",
        "Change tampons every 4 to 8 hours to prevent Toxic Shock Syndrome (TSS). Never leave a tampon in longer than 8 hours.",
        "Sterilize menstrual cups in boiling water for 5–10 minutes between cycles, and wash hands thoroughly before insertion or removal.",
        "Wash the external vulva with plain warm water. Avoid douches, scented washes, or harsh antibacterial soaps.",
      ],
    },
    {
      title: "Managing Common Discomforts Naturally 🍵",
      content:
        "Prostaglandin hormones trigger uterine contractions, which can cause cramping, backaches, or loose stools.",
      tips: [
        "Warmth: Apply a heating pad or hot water bottle to your lower abdomen or lower back.",
        "Hydration: Drinking 8+ glasses of water helps diminish hormonal bloating.",
        "Gentle Movement: Walking, cat-cow yoga, or pelvic rocking releases natural endorphin painkillers.",
        "Restful Sleep: Sleep on your side in a fetal position with a pillow between knees to relieve pelvic pressure.",
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
          <span>Menstrual Wellness & Hygiene Guide</span>
          <span className="text-2xl">📚</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Evidence-backed self-care guidance, hygiene best practices, and clinical awareness notes.
        </p>
      </div>

      {/* Warning signs banner */}
      <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm text-rose-950 dark:text-rose-100 space-y-3">
        <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>When to Seek Immediate Medical Guidance:</span>
        </div>
        <p className="text-xs leading-relaxed text-rose-900/90 dark:text-rose-200">
          While mild to moderate cramps are normal, severe distress requires a doctor&apos;s evaluation. Please consult a qualified gynecologist or healthcare clinic if you experience:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900 dark:text-rose-200 font-medium pt-1">
          <li>• Bleeding through one or more pads/tampons every hour for 2+ consecutive hours</li>
          <li>• Severe pelvic pain that does not respond to standard over-the-counter pain relievers</li>
          <li>• Passing blood clots larger than a quarter (2.5 cm)</li>
          <li>• Periods lasting longer than 7 consecutive days</li>
          <li>• Bleeding or spotting between periods or after intercourse</li>
          <li>• Sudden high fever, vomiting, or fainting while using tampons</li>
        </ul>
      </div>

      {/* Educational Cards */}
      <div className="space-y-6">
        {topics.map((t) => (
          <div
            key={t.title}
            className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-4"
          >
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6]">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3A55] dark:text-[#E2C7DC] leading-relaxed">
              {t.content}
            </p>

            {t.tips && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 text-xs text-[#5C3A55] dark:text-[#E2C7DC] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#BE185D] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Salad, Heart, Droplets, Sparkles, AlertCircle, Apple, Coffee } from "lucide-react";

export default function NutritionGuidePage() {
  const sections = [
    {
      title: "1. Foods Rich in Iron 🩸",
      desc: "During menstruation, your body naturally loses iron through menstrual blood. Replenishing iron supports energy and helps prevent fatigue.",
      items: [
        { name: "Lentils & Pulses (Daal)", note: "Rich in plant iron and protein. Gentle on digestion when cooked with turmeric and ginger." },
        { name: "Spinach & Leafy Greens (Shak)", note: "Excellent dietary iron source. Pair with a squeeze of lemon (vitamin C) to boost absorption." },
        { name: "Eggs", note: "Contains bioavailable iron, B-vitamins, and choline for sustained morning energy." },
        { name: "Fresh Fish & Lean Poultry", note: "High quality heme iron and healthy protein to nourish your tissues." },
        { name: "Beans & Chickpeas", note: "Packed with fiber and iron; great in stews, salads, or curries." },
      ],
    },
    {
      title: "2. Hydration & Calming Fluids 💧",
      desc: "Adequate hydration helps flush sodium to ease water retention and reduce hormonal headaches.",
      items: [
        { name: "Warm Lemon Water", note: "Sip in the morning to encourage smooth digestion and gentle liver support." },
        { name: "Lentil Soup / Broth", note: "Hydrating, electrolyte-rich, and comforting for your lower abdomen." },
        { name: "Ginger & Peppermint Infusions", note: "Naturally soothing for nausea, mild cramps, and digestive bloating." },
        { name: "Coconut Water", note: "Naturally rich in potassium to support fluid balance and reduce muscle tightness." },
      ],
    },
    {
      title: "3. Foods Rich in Magnesium 🌰",
      desc: "Magnesium acts as a natural muscle relaxant and supports nervous system balance to ease uterine contractions and mood irritability.",
      items: [
        { name: "Pumpkin Seeds & Sunflower Seeds", note: "One small handful delivers high magnesium and zinc." },
        { name: "Almonds & Walnuts", note: "Healthy omega fats that support hormone synthesis and reduce oxidative stress." },
        { name: "Dark Chocolate (70%+)", note: "Rich in antioxidants and magnesium. A delicious, comforting treat." },
        { name: "Whole Grains (Brown Rice, Oats)", note: "Complex carbohydrates that stabilize serotonin and blood sugar." },
      ],
    },
    {
      title: "4. Balanced Comfort Meals 🍲",
      desc: "Nourishing, culturally comforting meals that are easy on your stomach and provide sustained vitality.",
      items: [
        { name: "Khichuri (Rice & Lentils) with Vegetables", note: "A complete comforting protein that is gentle and grounding." },
        { name: "Steamed Rice with Fish & Greens (Machher Jhol)", note: "Traditional, light, and packed with anti-inflammatory omega-3 fatty acids." },
        { name: "Warm Oatmeal with Seeds & Berries", note: "High in beta-glucans to support blood sugar stability." },
        { name: "Yogurt (Dahi) with Sliced Fruit", note: "Probiotics to support the gut microbiome and ease cyclic bloating." },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950 text-[#BE185D] dark:text-[#F472B6] text-xs font-semibold">
          <Salad className="w-4 h-4" />
          <span>Hormonal & Cycle Nutrition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3]">
          Nourish Your Body 🌷
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Gentle, wholesome food ideas to nourish your energy, replenish iron, and bring comfort through every phase of your cycle.
        </p>
      </div>

      {/* Responsible Nutrition Note */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Gentle Health Notice:</p>
          <p className="leading-relaxed">
            Food is a source of nourishment and comfort, not a medical cure. Nutrition ideas should never replace professional medical care. We encourage diverse, regular meals without restrictive dieting. Please consider your own food allergies and consult a doctor or registered dietitian if you experience severe symptoms or suspect nutritional deficiencies.
          </p>
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((sec) => (
          <div
            key={sec.title}
            className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6] mb-1">
                {sec.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {sec.desc}
              </p>

              <div className="space-y-3">
                {sec.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/30 text-xs"
                  >
                    <span className="font-bold text-[#3F243A] dark:text-[#FCE7F3] block">
                      {item.name}
                    </span>
                    <span className="text-muted-foreground text-[11px] mt-0.5 block leading-relaxed">
                      {item.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

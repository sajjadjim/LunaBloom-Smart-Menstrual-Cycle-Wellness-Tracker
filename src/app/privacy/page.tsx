import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, Download, Trash2, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] transition-colors">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950 text-[#BE185D] dark:text-[#F472B6] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Health Data Security Policy</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">LunaBloom Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 2026 • Effective Worldwide
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-8 text-sm leading-relaxed text-[#5C3A55] dark:text-[#E2C7DC]">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
              <Lock className="w-5 h-5" /> 1. Our Privacy Pledge
            </h2>
            <p>
              Menstrual cycle information is sensitive personal health data. LunaBloom was purposefully engineered from day one to safeguard your intimate wellbeing. We maintain a strict zero-tolerance policy against selling, renting, or disclosing your health records to data brokers, ad networks, or employers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
              <EyeOff className="w-5 h-5" /> 2. Data We Collect and Why
            </h2>
            <p>
              We adhere strictly to the principle of <em>data minimization</em>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Account Credentials:</strong> Handled securely through Firebase Authentication (Email/Password or Google). Passwords are never stored on our database.</li>
              <li><strong>Menstrual Cycle Information:</strong> Period start and end dates, flow intensities, and symptoms to power your calendar and calculate cycle predictions.</li>
              <li><strong>Wellness Logs:</strong> Daily moods and optional notes to help you identify hormonal and emotional patterns.</li>
              <li><strong>Notification Preferences:</strong> Opt-in preferences for scheduled email reminders.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
              <Download className="w-5 h-5" /> 3. Your Rights: Export & Deletion
            </h2>
            <p>
              You maintain total ownership of your data at all times:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Export Your Data:</strong> You may instantly download your complete health record, cycle history, and moods in JSON format via the Settings menu.</li>
              <li><strong>Delete Your Account:</strong> You can permanently wipe your account at any time. When triggered, all period records, moods, symptoms, and settings are irreversibly erased from our database.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> 4. Non-Disclosure & Medical Disclaimers
            </h2>
            <p>
              LunaBloom provides non-diagnostic lifestyle wellness insights. Your health logs are never used to train public language models or shared with outside pharmaceutical or advertising partners.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

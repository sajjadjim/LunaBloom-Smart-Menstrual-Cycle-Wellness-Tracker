import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] transition-colors">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950 text-[#BE185D] dark:text-[#F472B6] text-xs font-semibold">
            <FileText className="w-4 h-4" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Terms and Conditions</h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 2026
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-8 text-sm leading-relaxed text-[#5C3A55] dark:text-[#E2C7DC]">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> 1. Explicit Medical Disclaimer
            </h2>
            <p>
              LunaBloom is an informational and lifestyle tool intended solely to support personal menstrual cycle awareness and wellness habits.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <p><strong>Crucial Notice:</strong></p>
              <ul className="list-disc pl-4 space-y-1">
                <li>LunaBloom predictions are statistical approximations, NOT guarantees.</li>
                <li>LunaBloom is NOT a method of contraception (birth control). Never use estimated safe or fertile days to prevent pregnancy.</li>
                <li>LunaBloom does not diagnose pregnancy, PCOS, endometriosis, or any clinical condition.</li>
                <li>Always seek the advice of a qualified physician with any questions you may have regarding a medical condition.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6]">
              2. Acceptable Use
            </h2>
            <p>
              By accessing LunaBloom, you agree to provide truthful information for your own personal use and not attempt to bypass access controls, reverse-engineer proprietary algorithms, or compromise the privacy of any user.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#BE185D] dark:text-[#F472B6]">
              3. Service Availability
            </h2>
            <p>
              While we strive for continuous availability, services are provided &ldquo;as is&rdquo;. We may perform routine maintenance or enhance features without prior notice.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

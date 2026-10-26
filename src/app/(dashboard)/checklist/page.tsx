"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { IChecklistItem } from "@/types";
import { CheckSquare, Plus, Trash2, RotateCcw, Sparkles } from "lucide-react";

export default function ChecklistPage() {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [items, setItems] = useState<IChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [loading, setLoading] = useState(true);

  const loadChecklist = async () => {
    try {
      const res = await fetch("/api/checklists", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, [token]);

  const saveItems = async (updated: IChecklistItem[]) => {
    setItems(updated);
    try {
      await fetch("/api/checklists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ items: updated }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: IChecklistItem = {
      id: `custom_${Date.now()}`,
      text: newItemText.trim(),
      checked: false,
    };

    const updated = [...items, newItem];
    saveItems(updated);
    setNewItemText("");
    success("Item Added 🌸", `Added "${newItem.text}" to your kit.`);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
  };

  const handleReset = () => {
    const updated = items.map((item) => ({ ...item, checked: false }));
    saveItems(updated);
    success("Checklist Reset", "All items refreshed for your next cycle.");
  };

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
          <span>Your Period Preparation Kit</span>
          <span className="text-2xl">🎀</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Stay prepared and relaxed. Keep your preferred products and personal comforts close at hand.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Preparedness: {completedCount} of {items.length} items ready</span>
            <span className="text-[#BE185D] dark:text-[#F472B6]">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-pink-100 dark:bg-pink-950/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-[#BE185D] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a personal comfort item (e.g. Lavender oil, ginger tea)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-xs sm:text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Items List */}
        <div className="space-y-2.5 pt-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                item.checked
                  ? "bg-pink-50/70 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/40 opacity-75"
                  : "bg-white dark:bg-[#241122] border-pink-100 dark:border-pink-950/60"
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggle(item.id)}
                  className="w-5 h-5 accent-[#BE185D] rounded cursor-pointer shrink-0"
                />
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    item.checked
                      ? "line-through text-muted-foreground"
                      : "text-[#3F243A] dark:text-[#FCE7F3]"
                  }`}
                >
                  {item.text}
                </span>
              </label>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-gray-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Reset Action */}
        <div className="pt-4 border-t border-pink-100 dark:border-pink-900/40 flex justify-end">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-muted-foreground hover:text-[#BE185D] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset checklist for upcoming cycle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

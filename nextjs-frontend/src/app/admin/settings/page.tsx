"use client";

import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6">
        <Settings size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-text-main mb-4">Platform Settings</h1>
      <p className="text-text-muted max-w-md mx-auto">
        Configure your platform preferences, update your instructor profile, 
        and manage global site settings here.
      </p>
    </div>
  );
}

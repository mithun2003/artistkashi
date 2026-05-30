"use client";

import { Construction } from "lucide-react";

export default function AdminCoursesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6">
        <Construction size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-text-main mb-4">
        Course Management
      </h1>
      <p className="text-text-muted max-w-md mx-auto">
        This section is currently under construction. Soon you'll be able to
        create, edit, and manage your masterclass curriculum here.
      </p>
    </div>
  );
}

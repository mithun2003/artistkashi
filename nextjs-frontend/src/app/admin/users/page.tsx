"use client";

import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6">
        <Users size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-text-main mb-4">
        Student Management
      </h1>
      <p className="text-text-muted max-w-md mx-auto">
        Manage your students, track their progress, and handle community
        interactions from this central hub.
      </p>
    </div>
  );
}

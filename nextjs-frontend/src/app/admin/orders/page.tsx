"use client";

import { ShoppingBag } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6">
        <ShoppingBag size={40} />
      </div>
      <h1 className="text-3xl font-extrabold text-text-main mb-4">
        Orders & Sales
      </h1>
      <p className="text-text-muted max-w-md mx-auto">
        Your sales records and transaction history will appear here. Track
        original works and course enrollments in real-time.
      </p>
    </div>
  );
}

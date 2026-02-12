"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function WhatsAppCTAButton() {
  return (
    <Button
      onClick={() => window.dispatchEvent(new CustomEvent("open-booking"))}
      className="w-full mt-10 bg-[#22c55e] hover:bg-[#1db954] text-[#0a4d2c] font-bold py-8 rounded-2xl text-lg"
    >
      Agende pelo WhatsApp
      <MessageCircle className="ml-2 h-6 w-6" />
    </Button>
  );
}

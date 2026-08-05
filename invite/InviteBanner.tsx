"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Gift, ChevronRight } from "lucide-react";
import { InviteModal } from "./InviteModal";

export function InviteBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-incogni-surface-1 to-incogni-surface-2 p-3 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 focus:outline-none"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400">
          <Gift className="h-5 w-5" />
        </div>
        
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-incogni-text">
            Invite to Earn
          </span>
          <span className="truncate text-[11px] text-incogni-text-muted">
            Up to 1-year Ultra Credits
          </span>
        </div>
        
        <ChevronRight className="h-4 w-4 shrink-0 text-incogni-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-incogni-text" />
      </button>

      {isOpen && mounted && createPortal(
        <InviteModal onClose={() => setIsOpen(false)} />,
        document.body
      )}
    </>
  );
}

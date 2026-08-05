"use client";

import { useEffect, useState, useRef } from "react";
import { X, Download, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import type { User } from "@/types";

export function ShareCardModal({ onClose, user }: { onClose: () => void; user: User | null }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const inviteUrl = user ? `${window.location.origin}/invite/${user.id}` : window.location.origin;

  useEffect(() => {
    QRCode.toDataURL(inviteUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff"
      }
    }).then(setQrDataUrl).catch(console.error);
  }, [inviteUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // In a real app, you might use html2canvas here.
    // For now, we'll just download the QR code itself as a fallback if full card capture isn't set up.
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `IncogniAI_Invite_${user?.id || "card"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4">
      <div className="relative flex flex-col items-center">
        
        {/* The Share Card (What they see and ideally download) */}
        <div 
          ref={cardRef}
          className="relative w-[320px] h-[480px] bg-gradient-to-b from-[#e5f0f3] to-[#cfd7dc] rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between"
        >
          {/* Top aesthetic area with blurred elements imitating cards */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-48 h-32 bg-black/40 rounded-xl blur-md rotate-12" />
            <div className="absolute top-20 -left-16 w-48 h-32 bg-black/60 rounded-xl blur-lg -rotate-12" />
            <div className="absolute top-40 right-10 w-48 h-32 bg-black/30 rounded-xl blur-sm rotate-6" />
          </div>

          <div className="relative z-10 p-6 flex flex-col h-full">
            <h3 className="text-[#3a586a] font-bold tracking-widest text-sm mb-auto">INCOGNIAI</h3>
            
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-gray-700 text-xs font-medium">
                  {user?.name?.substring(0, 10)}... Invites You To
                </span>
              </div>
              
              <h1 className="text-3xl font-serif text-black font-semibold mb-6">Earn Credits</h1>
              
              <div className="flex items-end justify-between">
                <p className="text-gray-600 text-[10px] max-w-[120px] leading-tight">
                  Go to IncogniAI. Complete tasks. 100% benefits guaranteed.
                </p>
                {qrDataUrl && (
                  <div className="bg-white p-1 rounded-md shadow-sm">
                    <img src={qrDataUrl} alt="QR Code" className="w-14 h-14" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Below Card */}
        <div className="mt-6 flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm font-medium"
          >
            <Download className="h-4 w-4" /> Download & Share
          </button>
          
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
          
          <button 
            onClick={onClose}
            className="flex items-center justify-center h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

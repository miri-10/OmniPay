'use client';

import { Sparkles } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="relative z-10 bg-gradient-to-r from-purple-900/20 via-fuchsia-900/20 to-purple-900/20 backdrop-blur-md border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-white/80 font-medium">
            Manage your decentralized payroll with natural language.
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;

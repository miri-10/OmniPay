"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { Zap, Sparkles, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * IMPORTANT:
 * WalletMultiButton must NOT be server rendered.
 * So we load it dynamically with SSR disabled.
 */
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Header = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDisconnect = async () => {
    if (disconnect) await disconnect();
  };

  const address = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey
        .toBase58()
        .slice(-4)}`
    : "";

  const navLinks = [
    { label: "Documentation", href: "/documentation" },
    { label: "Playground", href: "/playground" },
    { label: "Features", href: "/features" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-[#DC1FFF]/30 shadow-lg shadow-[#DC1FFF]/10"
          : "bg-black/60 backdrop-blur-lg border-b border-[#DC1FFF]/10"
      }`}
    >
      <div className="max-w-[90vw] lg:max-w-[75vw] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#DC1FFF] to-[#00FFA3] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#DC1FFF] via-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent">
              OmniPay
            </span>
          </Link>

          {connected && (
            <Sparkles className="w-4 h-4 text-[#00FFA3] animate-pulse" />
          )}
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-400 hover:text-[#00FFA3]">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {connected ? (
            <button onClick={handleDisconnect}>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <X className="w-4 h-4 text-[#00FFA3]" />
                <span className="text-white font-mono text-sm">{address}</span>
              </div>
            </button>
          ) : (
            <WalletMultiButton />
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-slate-800">
          <div className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
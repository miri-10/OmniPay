"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { Zap, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  const navLinks = [
    { label: "Documentation", href: "/documentation" },
    { label: "Playground", href: "/playground" },
    { label: "Features", href: "/features" },
  ];

  return (
    <>
      <div className="grain-overlay" />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#0a0512]/95 backdrop-blur-xl border-b border-purple-500/10" : "bg-[#0a0512]/80 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold text-white">OmniPay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-white/70 hover:text-purple-400 transition-colors duration-300">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {connected ? (
              <button onClick={handleDisconnect}>
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-all">
                  <X className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white font-mono text-xs">{address}</span>
                </div>
              </button>
            ) : (
              <WalletMultiButton />
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0512]/95 border-t border-purple-500/10">
            <div className="p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white/70 hover:text-purple-400 py-2">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

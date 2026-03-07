"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();
  const pathname = usePathname();
  
  const isDashboard = pathname === '/dashboard';

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
    { label: "AboutUs", href: "/about" },
  ];

  return (
    <>
      <div className="grain-overlay" />
      <header className="relative z-50">
        <div className="w-full px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/omnipay.png" 
              alt="OmniPay Logo" 
              width={48} 
              height={48}
              className="object-contain"
            />
            <span className="text-xl font-semibold text-white">OmniPay</span>
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-white/70 hover:text-purple-400 transition-colors duration-300">
                  {link.label}
                </Link>
              ))}
            </nav>

            {isDashboard && (
              <div className="hidden md:flex items-center gap-4">
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
              </div>
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
          <div className="md:hidden">
            <div className="p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white/70 hover:text-purple-400 py-2">
                  {link.label}
                </Link>
              ))}
              {isDashboard && (
                <div className="pt-2 border-t border-white/10">
                  {connected ? (
                    <button onClick={handleDisconnect} className="w-full">
                      <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-all">
                        <X className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-white font-mono text-xs">{address}</span>
                      </div>
                    </button>
                  ) : (
                    <WalletMultiButton />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

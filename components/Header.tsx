"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

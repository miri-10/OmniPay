import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="relative z-10 py-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-white/60 text-sm">© {new Date().getFullYear()} OmniPay</span>
                    </div>
                    
                    <nav className="flex items-center gap-8">
                        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
                            Home
                        </Link>
                        <Link href="/documentation" className="text-white/40 hover:text-white text-sm transition-colors">
                            Docs
                        </Link>
                        <Link href="/features" className="text-white/40 hover:text-white text-sm transition-colors">
                            Features
                        </Link>
                        <Link href="/privacy" className="text-white/40 hover:text-white text-sm transition-colors">
                            Privacy
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

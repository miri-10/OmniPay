import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ChevronRight, Sparkles, Shield, Zap, Cpu } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const HomePage = () => {
    const { setVisible } = useWalletModal();
    const { connected, publicKey } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (connected && publicKey) {
            router.push('/dashboard');
        }
    }, [connected, publicKey, router]);

    const handleLaunchDashboard = useCallback(async () => {
        if (connected) {
            router.push('/dashboard');
            return;
        }
        setVisible(true);
    }, [connected, setVisible, router]);

    return (
        <div className="min-h-screen bg-[#0a0512] relative overflow-hidden">
            <Header />

            <main className="relative z-10 pb-20 px-6 pt-32">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8 backdrop-blur-sm">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-xs text-purple-300 tracking-wide uppercase">
                                AI-Powered Payroll
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                            <span className="text-gradient-purple">
                                Payroll made
                            </span>
                            <br />
                            <span className="text-white">
                                simple & powerful
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/40 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Manage your decentralized payroll with natural language. 
                            <span className="text-fuchsia-400 glow-fuchsia"> Just chat</span> with your AI assistant and watch magic happen on-chain.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleLaunchDashboard}
                                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-black rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Launch Dashboard
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <a href="/features">
                                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium text-base transition-all duration-300 border border-white/10 hover:border-purple-500/30">
                                    <span className="flex items-center justify-center gap-2">
                                        Learn More
                                        <Cpu className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                    </span>
                                </button>
                            </a>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-24">
                        <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm hover:border-purple-500/20 hover:bg-purple-500/[0.02] transition-all duration-500">
                            <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center mb-5">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">
                                AI-Powered
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Control your payroll with natural language. No complex interfaces, just chat.
                            </p>
                        </div>

                        <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm hover:border-fuchsia-500/20 hover:bg-fuchsia-500/[0.02] transition-all duration-500">
                            <div className="w-10 h-10 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg flex items-center justify-center mb-5">
                                <Shield className="w-5 h-5 text-fuchsia-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Secure & Decentralized
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Built on Solana blockchain. Your funds, your control, always transparent.
                            </p>
                        </div>

                        <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm hover:border-violet-500/20 hover:bg-violet-500/[0.02] transition-all duration-500">
                            <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center mb-5">
                                <Zap className="w-5 h-5 text-violet-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Lightning Fast
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Process payments in seconds with Solana&apos;s high-performance network.
                            </p>
                        </div>
                    </div>

                    <div className="mt-24 text-center">
                        <p className="text-white/30 text-sm uppercase tracking-widest mb-6">Trusted by teams worldwide</p>
                        <div className="flex justify-center items-center gap-8 opacity-50">
                            <div className="text-white/50 text-sm font-medium">99.9% Uptime</div>
                            <div className="w-1 h-1 bg-purple-500/50 rounded-full" />
                            <div className="text-white/50 text-sm font-medium">&lt;1s Transactions</div>
                            <div className="w-1 h-1 bg-fuchsia-500/50 rounded-full" />
                            <div className="text-white/50 text-sm font-medium">100% Secure</div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;

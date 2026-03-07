import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ChevronRight, Cpu } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import Image from 'next/image';
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
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            <Header />

            <main className="relative z-10 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto min-h-screen flex flex-col justify-center -mt-16">
                        <div className="flex justify-center mb-8">
                            <Image 
                                src="/omnipay.png" 
                                alt="OmniPay Logo" 
                                width={80} 
                                height={80}
                                className="object-contain"
                            />
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
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;

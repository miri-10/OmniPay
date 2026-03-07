"use client";

import { Sparkles, Shield, Zap, Users, Award, Target, Heart, BookOpen, Code2, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
    const colors = {
        purple: "#a855f7",
        fuchsia: "#d946ef",
        violet: "#8b5cf6",
    };

    return (
        <div className="min-h-screen bg-[#0a0512] text-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                        <Sparkles className="w-4 h-4" style={{ color: colors.purple }} />
                        <span className="text-sm font-medium">About OmniPay</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span style={{ background: `linear-gradient(to right, ${colors.purple}, ${colors.violet}, ${colors.fuchsia})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Revolutionizing Payroll
                        </span>
                        <br />
                        <span className="text-white">with AI & Blockchain</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        A student-led project at the intersection of AI and Blockchain. OmniPay combines the speed of Solana with AI-powered natural language processing to revolutionize how organizations manage payroll on-chain.
                    </p>
                </div>
            </section>

            {/* Who I Am */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Who We Are</h2>
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                We are a team of student innovators building at the frontier of AI and Blockchain technology.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                As students passionate about decentralized systems and artificial intelligence, we saw an opportunity to combine Solana's lightning-fast blockchain with cutting-edge AI to create something truly revolutionary in the Web3 space.
                            </p>
                            <ul className="space-y-4 pt-6">
                                {["AI-Powered Natural Language Interface", "Secure Blockchain Transactions", "Next-Gen Web3 Solutions", "Innovation Through Education"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i % 2 === 0 ? colors.fuchsia : colors.violet }} />
                                        <span className="text-gray-300">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { value: "AI + Blockchain", label: "Core Focus", color: colors.purple },
                                { value: "Student", label: "Led Project", color: colors.fuchsia },
                                { value: "Natural", label: "Language First", color: colors.violet },
                                { value: "On-Chain", label: "Security", color: colors.purple },
                            ].map((stat) => (
                                <div key={stat.label} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:border-white/20 transition-all">
                                    <div className="text-5xl font-bold mb-2" style={{ color: stat.color }}>{stat.value}</div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* OmniPay Mission */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.fuchsia})` }}>
                                <Target className="w-7 h-7 text-black" />
                            </div>
                            <h2 className="text-4xl font-bold">OmniPay Mission</h2>
                        </div>

                        <p className="text-lg text-gray-400 leading-relaxed">
                            OmniPay transforms payroll management by combining Solana&apos;s speed with AI-powered natural language processing. Chat with your AI assistant to manage payroll — no complex dashboards required.
                        </p>

                        <div className="space-y-5">
                            {[
                                { icon: Zap, text: "Instant payouts in seconds", color: colors.fuchsia },
                                { icon: Sparkles, text: "AI-driven natural language automation", color: colors.purple },
                                { icon: Shield, text: "Blockchain-secured transparency", color: colors.violet },
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + "20" }}>
                                        <item.icon className="w-6 h-6" style={{ color: item.color }} />
                                    </div>
                                    <span className="text-gray-300">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-1 md:order-2 flex justify-center">
                        <div className="p-10 rounded-3xl text-center text-black font-bold text-2xl" style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.violet}, ${colors.fuchsia})` }}>
                            🚀 OmniPay<br />Revolutionizing Payroll<br />on Solana
                        </div>
                    </div>
                </div>
            </section>

            {/* Offerings */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">What We Offer</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: BookOpen, title: "Education", color: colors.purple },
                            { icon: Users, title: "Mentorship", color: colors.fuchsia },
                            { icon: Code2, title: "Development", color: colors.violet },
                            { icon: TrendingUp, title: "Innovation", color: colors.purple },
                        ].map((item) => (
                            <div key={item.title} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all group">
                                <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${item.color}, ${colors.fuchsia})` }}>
                                    <item.icon className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-400">
                                    {item.title === "Education" && "Premium courses & resources on Web3 & AI"}
                                    {item.title === "Mentorship" && "One-on-one guidance from experts"}
                                    {item.title === "Development" && "Smart contracts & full-stack dApps"}
                                    {item.title === "Innovation" && "Cutting-edge Web3 & AI solutions"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Heart, title: "User-First", color: colors.purple },
                            { icon: Shield, title: "Security & Transparency", color: colors.fuchsia },
                            { icon: Award, title: "Continuous Innovation", color: colors.violet },
                        ].map((value) => (
                            <div key={value.title} className="p-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all group text-center">
                                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${value.color}, ${colors.fuchsia})` }}>
                                    <value.icon className="w-10 h-10 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4" style={{ color: value.color }}>{value.title}</h3>
                                <p className="text-gray-400">
                                    {value.title === "User-First" && "Every feature designed with simplicity and accessibility in mind."}
                                    {value.title === "Security & Transparency" && "Built on blockchain with cryptographic security and full transparency."}
                                    {value.title === "Continuous Innovation" && "Pushing boundaries to advance Web3 and AI adoption."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join the AI & Blockchain Revolution?</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Experience the future of payroll management with OmniPay — where AI meets blockchain.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="px-10 py-4 rounded-xl font-bold text-black transition-all hover:scale-105" style={{ background: `linear-gradient(to right, ${colors.purple}, ${colors.fuchsia}, ${colors.violet})` }}>
                            Get Started
                        </button>
                        <button className="px-10 py-4 rounded-xl font-bold border-2 transition-all hover:scale-105" style={{ borderColor: colors.fuchsia, color: colors.fuchsia }}>
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

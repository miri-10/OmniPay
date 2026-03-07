import { useRef, useEffect, useState } from 'react';
import { Send, Bot, Copy, Check } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

type Message = {
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
};

type ChatMessage = Message & {
    id: string;
};

interface ChatPanelProps {
    messages: ChatMessage[];
    input: string;
    isLoading: boolean;
    isPayrollOpen: boolean;
    publicKey?: PublicKey | null;
    onInputChange: (value: string) => void;
    onSubmit: (e?: React.FormEvent) => void;
    apiKeySet: boolean;
    userApiKey: string;
    onApiKeyChange: (value: string) => void;
    onApiKeySubmit: (e: React.FormEvent) => void;
}

const TypingIndicator = () => (
    <div className="flex items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
        <Bot className="w-5 h-5 text-red-400" />
        <div className="flex gap-1">
            <div className="w-2 h-2 bg-red-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-orange-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
    </div>
);

const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    input,
    isLoading,
    isPayrollOpen,
    publicKey,
    onInputChange,
    onSubmit,
    apiKeySet,
    userApiKey,
    onApiKeyChange,
    onApiKeySubmit,
}) => {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isLoading]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    const handleApiKeyKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onApiKeySubmit(e as unknown as React.FormEvent);
        }
    };

    const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

    const handleCopy = (text: string, index: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const markdownComponents: Components = {
        p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
        h1: ({ children }) => <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0 text-white border-b border-red-500/20 pb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mb-3 mt-4 first:mt-0 text-white border-b border-red-500/20 pb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0 text-red-300">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-2 ml-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-2 ml-2">{children}</ol>,
        li: ({ children }) => <li className="ml-1">{children}</li>,
        table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-red-500/10">
                <table className="w-full text-xs sm:text-sm border-collapse">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => <thead className="bg-red-500/5">{children}</thead>,
        th: ({ children }) => <th className="px-3 py-2 text-left font-bold text-white border-b border-red-500/10">{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 border-b border-red-500/5 text-white/80">{children}</td>,
        tr: ({ children }) => <tr className="hover:bg-red-500/[0.02] transition-colors duration-200">{children}</tr>,
        code: ({ inline, children, className }: { inline?: boolean; children?: React.ReactNode; className?: string }) => {
            const codeText = String(children).replace(/\n$/, '');
            const codeIndex = `code-${codeText.slice(0, 20)}`;
            
            if (inline) {
                return (
                    <code className="bg-red-500/10 px-1.5 py-0.5 rounded text-red-300 font-mono text-xs break-all border border-red-500/20">
                        {children}
                    </code>
                );
            }
            
            return (
                <div className="relative group my-4">
                    <button
                        onClick={() => handleCopy(codeText, codeIndex)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        title="Copy code"
                    >
                        {copiedIndex === codeIndex ? <Check className="w-3.5 h-3.5 text-red-400" /> : <Copy className="w-3.5 h-3.5 text-red-400" />}
                    </button>
                    <code className={`block bg-black/50 p-4 rounded-lg my-3 font-mono text-xs overflow-x-auto whitespace-pre break-all border border-red-500/10 text-white/80 ${className ?? ''}`}>
                        {children}
                    </code>
                </div>
            );
        },
        a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline break-all transition-colors duration-300">
                {children}
            </a>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-red-500/30 pl-3 italic my-2 text-white/60 bg-red-500/[0.02] py-2 rounded-r">
                {children}
            </blockquote>
        ),
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="border-red-500/10 my-4" />,
    };

    return (
        <div className={`${isPayrollOpen ? 'hidden lg:flex lg:w-2/3' : 'w-full'} min-h-[50vh] max-h-[80vh] transition-all duration-300 flex flex-col bg-black/40 border border-red-500/10 rounded-2xl backdrop-blur-md overflow-hidden`}>
            <div className="p-4 sm:p-5 border-b border-red-500/10 shrink-0 bg-black/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-white">AI Assistant</h2>
                            <p className="text-xs text-white/40">Payroll management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${publicKey ? 'bg-red-400/60' : 'bg-yellow-500/60'}`} />
                        <span className="text-xs text-white/40">
                            {publicKey ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 custom-scrollbar">
                {messages.map((msg, index) => (
                    <div
                        key={msg.id || index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] sm:max-w-[70%] ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-black'
                            : 'bg-white/[0.02] border border-red-500/10'
                            } rounded-2xl p-3 sm:p-4 transition-all duration-300 relative`}>
                            <div className="text-xs sm:text-sm leading-relaxed break-all">
                                {msg.role === 'user' ? (
                                    <p className="whitespace-pre-wrap break-all font-medium">{msg.content}</p>
                                ) : (
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                )}
                            </div>
                            <p className={`text-[10px] sm:text-xs mt-2 opacity-60 ${msg.role === 'user' ? 'text-black/60' : 'text-white/40'}`}>
                                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <TypingIndicator />
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-4 border-t border-red-500/10 shrink-0 bg-black/20">
                {!apiKeySet ? (
                    <form onSubmit={onApiKeySubmit} className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={userApiKey}
                                onChange={(e) => onApiKeyChange(e.target.value)}
                                onKeyPress={handleApiKeyKeyPress}
                                placeholder="Enter Groq API key"
                                className="flex-1 px-3 py-2.5 bg-white/5 border border-red-500/20 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/40 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!userApiKey.trim()}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-black rounded-xl font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                Set
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => onInputChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your payroll command..."
                            className="flex-1 px-3 py-2.5 bg-white/5 border border-red-500/20 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/40 transition-all"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => onSubmit()}
                            disabled={isLoading || !input.trim()}
                            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-black rounded-xl font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.2); border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.4); }
            `}</style>
        </div>
    );
};

export default ChatPanel;

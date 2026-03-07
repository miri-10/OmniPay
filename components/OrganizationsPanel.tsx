import { X, DollarSign, Users, Building2 } from 'lucide-react';
import { PayrollSummary } from '@/utils/interface';

interface OrganizationsPanelProps {
    organizations: PayrollSummary[];
    selectedOrg: string | null;
    isOpen: boolean;
    onToggle: () => void;
    onSelectOrg: (id: string) => void;
    onViewDetails: (orgName: string) => void;
    formatLamports: (lamports: number) => string;
}

const OrganizationsPanel: React.FC<OrganizationsPanelProps> = ({
    organizations,
    selectedOrg,
    isOpen,
    onToggle,
    onSelectOrg,
    onViewDetails,
    formatLamports,
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onToggle}
            />

            <div className="lg:relative lg:w-1/3 min-h-[70vh] max-h-[85vh] z-40 flex flex-col bg-black/40 border-t lg:border border-red-500/10 rounded-t-2xl lg:rounded-2xl backdrop-blur-md">
                <div className="p-4 sm:p-5 border-b border-red-500/10 flex items-center justify-between shrink-0 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-white">Organizations</h3>
                            <p className="text-xs text-white/40">{organizations.length} active</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {organizations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-16 h-16 bg-red-500/5 border border-red-500/10 rounded-full flex items-center justify-center mb-4">
                                <Building2 className="w-8 h-8 text-red-400/30" />
                            </div>
                            <h4 className="text-white font-medium mb-2">No Organizations</h4>
                            <p className="text-white/40 text-sm">Create your first organization</p>
                        </div>
                    ) : (
                        organizations.map((org) => (
                            <div
                                key={org.id}
                                onClick={() => onSelectOrg(org.id)}
                                className={`p-4 bg-white/[0.02] border ${selectedOrg === org.id ? 'border-red-500/40 bg-red-500/[0.03]' : 'border-white/5'} rounded-xl cursor-pointer hover:border-red-500/20 hover:bg-red-500/[0.02] transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-white text-sm truncate">
                                        {org.orgName}
                                    </h4>
                                    <div className={`w-2 h-2 rounded-full ${selectedOrg === org.id ? 'bg-red-400' : 'bg-white/30'}`} />
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/40 flex items-center gap-2">
                                            <DollarSign className="w-3 h-3 text-red-400/60" />
                                            Treasury
                                        </span>
                                        <span className="text-white/80">{formatLamports(org.treasury)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/40 flex items-center gap-2">
                                            <Users className="w-3 h-3 text-orange-400/60" />
                                            Workers
                                        </span>
                                        <span className="text-white/80">{org.workers.length}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewDetails(org.orgName);
                                    }}
                                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-xs font-medium transition-all border border-red-500/20 hover:border-red-500/40"
                                >
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-red-500/10 bg-black/20">
                    <div className="flex items-center justify-between text-xs text-white/30">
                        <span>Live on Solana</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-red-500/50 rounded-full" />
                            <div className="w-1 h-1 bg-orange-500/40 rounded-full" />
                            <div className="w-1 h-1 bg-amber-500/30 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.2); border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.4); }
            `}</style>
        </>
    );
};

export default OrganizationsPanel;

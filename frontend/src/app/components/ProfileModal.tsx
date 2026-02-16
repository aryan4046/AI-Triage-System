import { User, LogOut, Mail, Phone } from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, logout } = useAuth();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
            <div className="space-y-6">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6464ff] to-[#00ffc8] p-1">
                        <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{user?.name?.charAt(0)}</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#6464ff]/10 text-[#6464ff] text-xs font-medium mt-1">
                            Senior Triage Nurse
                        </span>
                    </div>
                </div>

                <div className="space-y-3 bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3 text-white/80">
                        <Mail className="w-5 h-5 text-white/40" />
                        <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                        <Phone className="w-5 h-5 text-white/40" />
                        <span>{user?.contact || 'No contact info'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10 mt-2">
                        <div className="bg-white/5 p-2 rounded-lg text-center">
                            <span className="block text-xs text-white/40 uppercase">Age</span>
                            <span className="text-white font-medium">--</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg text-center">
                            <span className="block text-xs text-white/40 uppercase">Gender</span>
                            <span className="text-white font-medium">--</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl transition-colors font-medium border border-red-500/20"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </Modal>
    );
}

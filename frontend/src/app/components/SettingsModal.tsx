import { Bell, Volume2, Moon, Shield, Info } from 'lucide-react';
import { Modal } from './Modal';
import { useState } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="System Settings">
            <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setNotifications(!notifications)}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6464ff]/10 text-[#6464ff]">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-white">Notifications</h4>
                            <p className="text-xs text-white/60">Real-time alerts for critical cases</p>
                        </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-[#00ffc8]' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifications ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setSound(!sound)}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6464ff]/10 text-[#6464ff]">
                            <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-white">System Sounds</h4>
                            <p className="text-xs text-white/60">Effects and alert sounds</p>
                        </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${sound ? 'bg-[#00ffc8]' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${sound ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6464ff]/10 text-[#6464ff]">
                            <Moon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-white">Dark Mode</h4>
                            <p className="text-xs text-white/60">Enhanced contrast interface</p>
                        </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-[#00ffc8]' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div className="pt-4 mt-2 border-t border-white/10">
                    <div className="flex items-center gap-3 text-white/60 p-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Security Level: High (End-to-End Encrypted)</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/60 p-2">
                        <Info className="w-4 h-4" />
                        <span className="text-sm">Version 2.4.0 (Build 892)</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

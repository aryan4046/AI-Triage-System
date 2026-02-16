import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, Phone, User as UserIcon, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageTransition } from '../components/PageTransition';

interface SignupProps {
    onNavigate: (page: 'login') => void;
}

export function Signup({ onNavigate }: SignupProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.signup(formData);
            // Auto login after signup
            const loginRes = await api.login({ email: formData.email, password: formData.password });
            login({
                id: loginRes.user_id,
                name: loginRes.name,
                email: loginRes.email,
                contact: loginRes.contact,
            });
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#6464ff]/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00ffc8]/20 rounded-full blur-[100px]"
                />
            </div>

            <PageTransition className="w-full max-w-md relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffc8] to-[#6464ff] bg-clip-text text-transparent mb-2">
                            Create Account
                        </h1>
                        <p className="text-white/60">Join the AI Health Triage System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:border-[#6464ff] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:border-[#6464ff] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="tel"
                                    placeholder="Contact Number"
                                    required
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:border-[#6464ff] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:border-[#6464ff] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#6464ff] to-[#00ffc8] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    Sign Up <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/60">
                        Already have an account?{' '}
                        <button
                            onClick={() => onNavigate('login')}
                            className="text-[#00ffc8] hover:underline"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
}

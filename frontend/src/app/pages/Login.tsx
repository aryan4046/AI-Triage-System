import { useState } from 'react';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageTransition } from '../components/PageTransition';
import { AuthBackground } from '../components/AuthBackground';

interface LoginProps {
    onNavigate: (page: 'signup') => void;
}

export function Login({ onNavigate }: LoginProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.login(formData);
            login({
                id: res.user_id,
                name: res.name,
                email: res.email,
                contact: res.contact,
                age: res.age,
                gender: res.gender,
            });
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white p-4 relative overflow-hidden">
            <AuthBackground />

            <PageTransition className="w-full max-w-md relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6464ff] to-[#00ffc8] mb-4 shadow-lg shadow-[#6464ff]/20">
                            <LogIn className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/40">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#6464ff] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-[#6464ff] focus:bg-black/60 focus:outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#6464ff] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#6464ff] focus:bg-black/60 focus:outline-none transition-all placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#6464ff] to-[#4848cc] text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#6464ff]/25 transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
                        >
                            {loading ? 'Signing In...' : (
                                <>
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#0a0a0f] text-white/40">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-colors">
                                <span className="text-white font-medium">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-colors">
                                <span className="text-white font-medium">GitHub</span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/60">
                        Don't have an account?{' '}
                        <button
                            onClick={() => onNavigate('signup')}
                            className="text-[#00ffc8] hover:underline"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
}

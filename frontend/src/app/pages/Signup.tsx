import { useState } from 'react';
import { Mail, Lock, Phone, User as UserIcon, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { PageTransition } from '../components/PageTransition';
import { AuthBackground } from '../components/AuthBackground';

interface SignupProps {
    onNavigate: (page: 'login') => void;
}

export function Signup({ onNavigate }: SignupProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
        age: '',
        gender: '',
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
                age: loginRes.age,
                gender: loginRes.gender,
            });
        } catch (err: any) {
            setError(err.message || 'Signup failed');
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
                            <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                            Create Account
                        </h1>
                        <p className="text-white/40">Join the AI Health Triage System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#6464ff] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-[#6464ff] focus:bg-black/60 focus:outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#6464ff] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#6464ff] focus:bg-black/60 focus:outline-none transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-[#6464ff] transition-colors" />
                                <input
                                    type="tel"
                                    placeholder="Contact Number"
                                    required
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#6464ff] focus:bg-black/60 focus:outline-none transition-all placeholder:text-white/20"
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-white/40 uppercase tracking-wider ml-1">Age</label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            placeholder="25"
                                            required
                                            min="0"
                                            max="120"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-[#00ffc8] focus:bg-black/60 focus:outline-none transition-colors text-center font-mono text-lg text-white placeholder:text-white/20"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">YRS</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-white/40 uppercase tracking-wider ml-1">Gender</label>
                                    <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 h-[46px]">
                                        {['Male', 'Female'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gender: g })}
                                                className={`flex-1 rounded-lg text-sm font-medium transition-all ${formData.gender === g
                                                    ? 'bg-[#6464ff] text-white shadow-lg'
                                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {g === 'Male' ? 'M' : 'F'}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: 'Other' })}
                                            className={`flex-1 rounded-lg text-sm font-medium transition-all ${formData.gender === 'Other'
                                                ? 'bg-[#00ffc8] text-black shadow-lg'
                                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            O
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#6464ff] to-[#00ffc8] text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#6464ff]/25 transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
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

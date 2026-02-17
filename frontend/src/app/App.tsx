import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Users, Brain, Settings, UserCircle } from 'lucide-react';
import { ECGVisualization } from './components/ECGVisualization';
import { PatientCard } from './components/PatientCard';
import { DoctorRecommendations } from './components/DoctorRecommendations';
import { AIChat } from './components/AIChat';
import { VitalStats } from './components/VitalStats';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PageTransition } from './components/PageTransition';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';

const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    matchScore: 98,
    availability: 'Available Now',
    rating: 4.9,
    experience: 15,
  },
  {
    id: '2',
    name: 'Dr. Robert Martinez',
    specialty: 'Emergency Medicine',
    matchScore: 95,
    availability: 'Available in 15m',
    rating: 4.8,
    experience: 12,
  },
  {
    id: '3',
    name: 'Dr. Emily Thompson',
    specialty: 'Pulmonology',
    matchScore: 92,
    availability: 'Available Now',
    rating: 4.9,
    experience: 18,
  },
];

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState<any[]>(mockDoctors);

  // Real-time stats simulation
  const [avgWaitTime, setAvgWaitTime] = useState(14);
  const [aiAccuracy, setAiAccuracy] = useState(97.3);

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log("Selected Patient Changed:", selectedPatient);
      if (selectedPatient?.symptoms) {
        const symptoms = Array.isArray(selectedPatient.symptoms)
          ? selectedPatient.symptoms.join(' ')
          : selectedPatient.symptoms;

        console.log("Fetching recommendations for symptoms:", symptoms);
        try {
          const docs = await api.getRecommendations(symptoms);
          console.log("API Response Preview:", docs ? docs.slice(0, 2) : "No docs");

          if (docs && docs.length > 0) {
            setRecommendedDoctors(docs);
          } else {
            console.warn("API returned empty, using fallback");
            setRecommendedDoctors(mockDoctors); // Fallback
          }
        } catch (err) {
          console.error("Failed to load recommendations", err);
          setRecommendedDoctors(mockDoctors);
        }
      } else {
        setRecommendedDoctors(mockDoctors);
      }
    };

    fetchRecommendations();
  }, [selectedPatient]);

  useEffect(() => {
    if (isAuthenticated) {
      loadQueue();
      // Poll queue every 10 seconds to update with new chats
      const interval = setInterval(loadQueue, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate wait time: Base 12-16 mins, trend up if critical cases exist
      const criticalCount = patients.filter((p: any) => ['high', 'critical'].includes(p.severity?.toLowerCase())).length;
      const baseWait = 14 + (criticalCount * 2);
      const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      setAvgWaitTime(Math.max(5, baseWait + fluctuation));

      // Fluctuate accuracy: 96.5% - 99.5%
      const newAccuracy = 96.5 + Math.random() * 3;
      setAiAccuracy(parseFloat(newAccuracy.toFixed(1)));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [patients]);

  const loadQueue = async () => {
    try {
      setLoadingQueue(true);
      const data = await api.getQueue();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load queue', error);
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleAnalysisUpdate = (data: { symptoms: string[]; risk: string }) => {
    setIsAIActive(true);
    setSelectedPatient({
      id: 'ai-analysis',
      name: user?.name || 'Current Patient',
      age: '--',
      gender: '--',
      symptoms: data.symptoms,
      severity: data.risk.toLowerCase(),
      heartRate: data.risk.toLowerCase() === 'critical' || data.risk.toLowerCase() === 'high' ? '110-140' : '70-90',
      bloodPressure: '--',
      temperature: '--',
      oxygenLevel: '--',
      status: 'AI Triage',
      waitTime: '0 min'
    });
  };

  if (!isAuthenticated) {
    if (authPage === 'signup') {
      return <Signup onNavigate={(page) => setAuthPage(page)} />;
    }
    return <Login onNavigate={(page) => setAuthPage(page)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 font-sans">
      {/* Background Gradients with Intensified Blinking Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-[#6464ff]/20 rounded-full blur-[80px]"
          style={{ willChange: 'opacity' }}
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#00ffc8]/15 rounded-full blur-[80px]"
          style={{ willChange: 'opacity' }}
        />
      </div>

      {/* Overlay when AI is inactive - Glassmorphism Design */}
      <AnimatePresence>
        {!isAIActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-[#0a0a0f]/95 backdrop-blur-md" />
            <div className="bg-[#0a0a0f] border border-white/5 p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden group z-10">
              {/* Glowing background effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#6464ff]/10 blur-[60px] rounded-full group-hover:bg-[#00ffc8]/10 transition-colors duration-700" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-lg relative">
                  <div className="absolute inset-0 bg-[#6464ff]/20 blur-xl rounded-2xl" />
                  <Brain className="w-10 h-10 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />

                  {/* Offline Indicator Dot */}
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#0a0a0f] rounded-full flex items-center justify-center border border-white/10">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </span>
                </div>

                <h2 className="text-xs font-bold tracking-[0.3em] text-red-500 mb-4 uppercase">System Offline</h2>
                <h3 className="text-3xl font-light text-white mb-4 tracking-tight">Neural Link Disconnected</h3>

                <p className="text-white/40 leading-relaxed mb-10 text-sm">
                  The AI diagnostic core is currently in standby mode to conserve processing power.
                  Initialize the neural link to access real-time patient triage and specialist recommendations.
                </p>

                <button
                  onClick={() => setIsAIActive(true)}
                  className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 w-full max-w-xs"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6464ff]/10 to-[#00ffc8]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-3 text-sm font-bold tracking-widest text-white uppercase">
                    <Activity className="w-4 h-4 text-[#00ffc8]" />
                    Initialize System
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6464ff] to-[#00ffc8] flex items-center justify-center shadow-lg shadow-[#6464ff]/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                AI HealthCare Console
              </h1>
              <p className="text-xs text-white/40 uppercase tracking-widest">Intelligent Medical Triage System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Section */}
            <div
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
            >
              <UserCircle className="w-5 h-5 text-[#00ffc8]" />
              <span className="text-sm font-medium pr-1">{user?.name}</span>
            </div>

            <div
              onClick={() => setIsAIActive(!isAIActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${isAIActive ? 'bg-[#00ffc8]/10 border-[#00ffc8]/20' : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isAIActive ? 'bg-[#00ffc8] animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-xs font-bold ${isAIActive ? 'text-[#00ffc8]' : 'text-red-500'}`}>
                {isAIActive ? 'AI ACTIVE' : 'AI OFFLINE'}
              </span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>



        <PageTransition className={`space-y-6 relative min-h-[calc(100vh-100px)] ${!isAIActive ? 'overflow-hidden h-[80vh]' : ''}`}>
          {/* Main Dashboard Content - Blurred when inactive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              filter: isAIActive ? 'blur(0px) grayscale(0%)' : 'blur(8px) grayscale(100%)',
              scale: isAIActive ? 1 : 0.98
            }}
            transition={{ duration: 0.5 }}
            className={`space-y-6 transition-all duration-500 ${!isAIActive ? 'pointer-events-none select-none opacity-40' : ''}`}
          >
            {/* Top Stats Row */}
            <VitalStats
              totalPatients={patients.length}
              criticalCases={patients.filter((p: any) => ['high', 'critical'].includes(p.severity?.toLowerCase())).length}
              avgWaitTime={avgWaitTime.toString()}
              accuracy={aiAccuracy.toString()}
            />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Patient Queue */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00ffc8]" />
                    Patient Queue
                  </h2>
                  <span className="text-white/60 text-sm">{patients.length} active</span>
                </div>
                <div className="space-y-3 h-[800px] overflow-y-auto p-2">
                  {patients.length === 0 ? (
                    <div className="text-center py-10 text-white/40">No patients in queue</div>
                  ) : (
                    patients.map((patient) => (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        onClick={() => setSelectedPatient(patient)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Middle Column - ECG & Doctor Recommendations */}
              <div className="space-y-6">
                {/* ECG Visualization */}
                <div>
                  <h2 className="text-white flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-[#00ffc8]" />
                    Live ECG Monitor
                  </h2>
                  <div className="h-64">
                    <ECGVisualization
                      isActive={!!selectedPatient &&
                        (Array.isArray(selectedPatient.symptoms)
                          ? selectedPatient.symptoms.length > 0
                          : !!selectedPatient.symptoms)
                      }
                      severity={selectedPatient?.severity}
                    />
                  </div>
                </div>

                {/* Doctor Recommendations */}
                <div>
                  <h2 className="text-white flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-[#6464ff]" />
                    AI Recommended Specialists
                  </h2>
                  <div className="h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                    <DoctorRecommendations doctors={recommendedDoctors} />
                  </div>
                </div>
              </div>

              {/* Right Column - AI Chat */}
              <div>
                <h2 className="text-white flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-[#6464ff]" />
                  AI Medical Assistant
                </h2>
                <div className="h-[800px]">
                  {/* Pass userId to AI Chat so it can be sent to backend */}
                  <AIChat onAnalysisUpdate={handleAnalysisUpdate} />
                </div>
              </div>
            </div>
          </motion.div>

          <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
          <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </PageTransition>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
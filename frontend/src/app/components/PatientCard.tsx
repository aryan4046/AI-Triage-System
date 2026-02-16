import { motion } from 'motion/react';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    symptoms: string[];
    vitals: {
      heartRate: number;
      temperature: number;
      bloodPressure: string;
      oxygenLevel: number;
    };
  };
  onClick?: () => void;
}

const severityColors = {
  critical: { bg: 'rgba(255, 0, 100, 0.2)', border: '#ff0064', text: '#ff0064' },
  high: { bg: 'rgba(255, 100, 0, 0.2)', border: '#ff6400', text: '#ff6400' },
  medium: { bg: 'rgba(255, 200, 0, 0.2)', border: '#ffc800', text: '#ffc800' },
  low: { bg: 'rgba(0, 255, 200, 0.2)', border: '#00ffc8', text: '#00ffc8' },
};

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const colors = severityColors[patient.severity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer rounded-xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Severity indicator */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-20"
        style={{
          background: `radial-gradient(circle at top right, ${colors.text}, transparent)`,
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white text-lg">{patient.name}</h3>
          <p className="text-white/60 text-sm">
            {patient.age}y • {patient.gender}
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-mono uppercase"
          style={{ background: colors.bg, color: colors.text }}
        >
          {patient.severity}
        </div>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4" style={{ color: colors.text }} />
          <span className="text-white/80">{patient.vitals.heartRate} BPM</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Thermometer className="w-4 h-4" style={{ color: colors.text }} />
          <span className="text-white/80">{patient.vitals.temperature}°F</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4" style={{ color: colors.text }} />
          <span className="text-white/80">{patient.vitals.bloodPressure}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wind className="w-4 h-4" style={{ color: colors.text }} />
          <span className="text-white/80">{patient.vitals.oxygenLevel}%</span>
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <p className="text-white/40 text-xs mb-1">Symptoms:</p>
        <div className="flex flex-wrap gap-1">
          {patient.symptoms.map((symptom, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'motion/react';
import { Brain, AlertTriangle, TrendingUp, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Patient {
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
}

interface PatientAnalysisProps {
  patient: Patient;
}

const heartRateData = [
  { time: '10m', value: 75 },
  { time: '8m', value: 78 },
  { time: '6m', value: 85 },
  { time: '4m', value: 92 },
  { time: '2m', value: 98 },
  { time: 'now', value: 112 },
];

const severityConfig = {
  critical: { color: '#ff0064', label: 'Critical', priority: 'Immediate Attention Required' },
  high: { color: '#ff6400', label: 'High Priority', priority: 'Urgent Care Needed' },
  medium: { color: '#ffc800', label: 'Moderate', priority: 'Standard Care' },
  low: { color: '#00ffc8', label: 'Low Priority', priority: 'Routine Check' },
};

export function PatientAnalysis({ patient }: PatientAnalysisProps) {
  const config = severityConfig[patient.severity];

  const aiInsights = [
    {
      type: 'diagnosis',
      title: 'Preliminary Diagnosis',
      content: 'Acute coronary syndrome suspected based on symptom pattern and vital trends',
      confidence: 94,
    },
    {
      type: 'risk',
      title: 'Risk Assessment',
      content: 'Elevated cardiac risk - Recommend immediate ECG and troponin levels',
      confidence: 89,
    },
    {
      type: 'action',
      title: 'Recommended Actions',
      content: 'Cardiology consult, IV access, continuous monitoring, aspirin 325mg stat',
      confidence: 96,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Patient Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4 relative overflow-hidden"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${config.color}40`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 opacity-20"
          style={{
            background: `radial-gradient(circle at top right, ${config.color}, transparent)`,
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-white text-xl mb-1">{patient.name}</h3>
              <p className="text-white/60">{patient.age} years • {patient.gender}</p>
            </div>
            <div
              className="px-4 py-2 rounded-full text-sm font-mono uppercase"
              style={{ background: `${config.color}30`, color: config.color, border: `1px solid ${config.color}` }}
            >
              {config.label}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm" style={{ color: config.color }}>
            <AlertTriangle className="w-4 h-4" />
            <span>{config.priority}</span>
          </div>
        </div>
      </motion.div>

      {/* Heart Rate Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 0, 100, 0.2)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#ff0064]" />
            <h4 className="text-white">Heart Rate Trend</h4>
          </div>
          <span className="text-[#ff0064] text-sm font-mono">{patient.vitals.heartRate} BPM</span>
        </div>
        
        <div style={{ width: '100%', height: '96px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={heartRateData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff0064"
                strokeWidth={2}
                dot={{ fill: '#ff0064', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
          <Clock className="w-3 h-3" />
          <span>Last 10 minutes</span>
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 100, 255, 0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-[#6464ff]" />
          <h4 className="text-white">AI Medical Insights</h4>
        </div>

        <div className="space-y-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#00ffc8] text-sm">{insight.title}</span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#6464ff] to-[#00ffc8]"
                      initial={{ width: 0 }}
                      animate={{ width: `${insight.confidence}%` }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs text-white/60 w-8">{insight.confidence}%</span>
                </div>
              </div>
              <p className="text-white/70 text-sm">{insight.content}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Vital Signs Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 200, 0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#00ffc8]" />
          <h4 className="text-white">Current Vital Signs</h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/60 text-xs mb-1">Heart Rate</p>
            <p className="text-white text-lg">{patient.vitals.heartRate} <span className="text-sm text-white/60">BPM</span></p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/60 text-xs mb-1">Temperature</p>
            <p className="text-white text-lg">{patient.vitals.temperature} <span className="text-sm text-white/60">°F</span></p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/60 text-xs mb-1">Blood Pressure</p>
            <p className="text-white text-lg">{patient.vitals.bloodPressure} <span className="text-sm text-white/60">mmHg</span></p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-white/60 text-xs mb-1">O2 Saturation</p>
            <p className="text-white text-lg">{patient.vitals.oxygenLevel} <span className="text-sm text-white/60">%</span></p>
          </div>
        </div>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 200, 0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-[#00ffc8]" />
          <h4 className="text-white">Next Steps</h4>
        </div>

        <div className="space-y-2">
          {['ECG ordered - In progress', 'Blood work sent to lab', 'Cardiology notified', 'IV access established'].map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-[#00ffc8] animate-pulse" />
              <span className="text-white/70">{step}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
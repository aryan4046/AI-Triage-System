import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface VitalMetrics {
  totalPatients: number;
  criticalCases: number;
  avgWaitTime: string;
  accuracy: string;
}

interface VitalStat {
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  status: 'normal' | 'warning' | 'critical' | 'active';
}

const statusColors = {
  normal: { bg: 'rgba(0, 255, 200, 0.1)', border: '#00ffc8', text: '#00ffc8' },
  warning: { bg: 'rgba(255, 200, 0, 0.1)', border: '#ffc800', text: '#ffc800' },
  critical: { bg: 'rgba(255, 0, 100, 0.1)', border: '#ff0064', text: '#ff0064' },
  active: { bg: 'rgba(100, 100, 255, 0.1)', border: '#6464ff', text: '#6464ff' },
};

export function VitalStats({ totalPatients, criticalCases, avgWaitTime, accuracy }: VitalMetrics) {
  const stats: VitalStat[] = [
    {
      label: 'Active Patients',
      value: totalPatients.toString(),
      unit: 'patients',
      trend: 'up',
      change: '+12', // Mock trend for now
      status: 'active',
    },
    {
      label: 'Critical Cases',
      value: criticalCases.toString(),
      unit: 'urgent',
      trend: 'down', // Mock trend
      change: '-3',
      status: criticalCases > 5 ? 'critical' : 'warning',
    },
    {
      label: 'Avg Wait Time',
      value: avgWaitTime,
      unit: 'minutes',
      trend: 'stable',
      change: '±0',
      status: 'normal',
    },
    {
      label: 'AI Accuracy',
      value: accuracy,
      unit: '%',
      trend: 'up',
      change: '+2.1',
      status: 'normal',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const colors = statusColors[stat.status] || statusColors.normal;
        const TrendIcon =
          stat.trend === 'up'
            ? TrendingUp
            : stat.trend === 'down'
              ? TrendingDown
              : Minus;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}40`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{
                background: `radial-gradient(circle at top right, ${colors.text}, transparent)`,
              }}
            />

            <div className="relative z-10">
              <p className="text-white/60 text-sm mb-2">{stat.label}</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-white text-3xl">{stat.value}</span>
                <span className="text-white/40 text-sm mb-1">{stat.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  <TrendIcon className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
                <span className="text-white/40 text-xs">vs last hour</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

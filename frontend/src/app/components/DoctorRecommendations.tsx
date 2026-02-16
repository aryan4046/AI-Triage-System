import { motion } from 'motion/react';
import { Star, Clock, Award, MapPin, Phone } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  specialization?: string; // Backend uses this
  rating: number;
  availability: string;
  experience: number;
  matchScore: number;
  hospital?: string;
  area?: string;
  contact?: string;
}

interface DoctorRecommendationsProps {
  doctors: Doctor[];
}

export function DoctorRecommendations({ doctors }: DoctorRecommendationsProps) {
  return (
    <div className="space-y-3 pb-2">
      {doctors.map((doctor, idx) => (
        <motion.div
          key={doctor.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="rounded-xl p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(100, 100, 255, 0.3)',
          }}
        >
          {/* Match score indicator */}
          <div
            className="absolute top-0 right-0 px-3 py-1 text-xs font-mono"
            style={{
              background: `linear-gradient(135deg, rgba(100, 100, 255, ${doctor.matchScore / 100}), rgba(0, 255, 200, ${doctor.matchScore / 100}))`,
              borderBottomLeftRadius: '0.5rem',
            }}
          >
            {doctor.matchScore}% Match
          </div>

          <div className="flex items-start gap-3">
            {/* Avatar placeholder */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6464ff, #00ffc8)',
              }}
            >
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-white mb-1 font-semibold">{doctor.name}</h4>
              <p className="text-[#00ffc8] text-sm mb-1">{doctor.specialization || doctor.specialty}</p>

              {/* Hospital & Area */}
              {(doctor.hospital || doctor.area) && (
                <div className="flex items-center gap-1 text-xs text-white/70 mb-2">
                  <MapPin className="w-3 h-3 text-[#6464ff]" />
                  <span>
                    {doctor.hospital}
                    {doctor.hospital && doctor.area && ', '}
                    {doctor.area}
                  </span>
                </div>
              )}

              {/* Contact */}
              {doctor.contact && (
                <div className="flex items-center gap-1 text-xs text-white/70 mb-2">
                  <Phone className="w-3 h-3 text-[#6464ff]" />
                  <span>{doctor.contact}</span>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-white/60 border-t border-white/5 pt-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{doctor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{doctor.experience}y exp</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-[#00ffc8]">{doctor.availability}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
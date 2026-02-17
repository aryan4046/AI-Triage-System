import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface ECGProps {
  isActive?: boolean;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

export function ECGVisualization({ isActive = true, severity = 'low' }: ECGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getWaveParams = (severity: string) => {
    switch (severity) {
      case 'critical': return { freq: 0.08, amp: 1.5, bpm: '110-140', speed: 12 };
      case 'high': return { freq: 0.06, amp: 1.2, bpm: '90-110', speed: 8 };
      case 'medium': return { freq: 0.04, amp: 1.0, bpm: '70-90', speed: 6 };
      case 'low': default: return { freq: 0.03, amp: 0.8, bpm: '60-80', speed: 4 };
    }
  };

  const params = getWaveParams(severity);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    let lastDrawTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const drawECG = (timestamp: number) => {
      // Throttle FPS
      if (timestamp - lastDrawTime < frameInterval) {
        animationFrameId = requestAnimationFrame(drawECG);
        return;
      }
      lastDrawTime = timestamp;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Clear canvas completely - No trailing effect
      // This ensures only a single line is visible at all times
      ctx.clearRect(0, 0, width, height);

      // Optional: Add a subtle static background flash or scanline if desired later
      // but for now, keep it clean black/transparent as the parent div has the bg

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 200, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < width; i += 40) {
        ctx.moveTo(i, 0); ctx.lineTo(i, height);
      }
      for (let i = 0; i < height; i += 40) {
        ctx.moveTo(0, i); ctx.lineTo(width, i);
      }
      ctx.stroke();

      // Waveform


      // Reverted to original Teal (#00ffc8) and Red (#ff0064)
      const neonColor = severity === 'critical' ? '#ff0064' : '#00ffc8';

      ctx.strokeStyle = isActive ? neonColor : 'rgba(0, 255, 200, 0.2)';
      ctx.lineWidth = 2.5; // Slightly thinner for cleaner zig-zag
      ctx.shadowBlur = 0; // Removed shadow as requested
      ctx.shadowColor = 'transparent';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();

      const step = 2;

      for (let x = 0; x < width; x += step) {
        if (!isActive) {
          // Flatline with noise
          const y = centerY + (Math.random() - 0.5) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          continue;
        }

        const frequency = params.freq;
        const normalizedX = (x + offset) * frequency;

        let y = centerY;

        // Baseline "Zig-Zag" Noise Effect
        // Adds roughness to the line for realism
        y += (Math.random() - 0.5) * 4;

        // P wave
        if (normalizedX % (Math.PI * 4) > 0.5 && normalizedX % (Math.PI * 4) < 1.5) {
          y += Math.sin(normalizedX * 3) * 8 * params.amp;
        }

        // QRS complex - High/Sharp Spikes
        const qrsPosition = normalizedX % (Math.PI * 4);
        if (qrsPosition > 2.8 && qrsPosition < 3.2) {
          const qrsX = (qrsPosition - 3) * 10;
          // Sharper and much taller spike
          y += Math.sin(qrsX * Math.PI) * (80 * params.amp) * Math.exp(-Math.abs(qrsX) * 2);
          if (Math.abs(qrsX) > 0.5) y += 15 * Math.sin(qrsX * 5); // Undershoot
        }

        // T wave
        if (qrsPosition > 3.5 && qrsPosition < 4.5) {
          y += Math.sin(normalizedX * 2.5 + 1.5) * 12 * params.amp;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Leading Dot Effect
      if (isActive) {
        const endX = width;
        const endNormX = (endX + offset) * params.freq;
        let endY = centerY;

        // Calculate theoretical Y without noise for the dot position
        if (endNormX % (Math.PI * 4) > 0.5 && endNormX % (Math.PI * 4) < 1.5) {
          endY += Math.sin(endNormX * 3) * 8 * params.amp;
        }
        const qrsPos = endNormX % (Math.PI * 4);
        if (qrsPos > 2.8 && qrsPos < 3.2) {
          const qrsX = (qrsPos - 3) * 10;
          endY += Math.sin(qrsX * Math.PI) * (80 * params.amp) * Math.exp(-Math.abs(qrsX) * 2);
          if (Math.abs(qrsX) > 0.5) endY += 15 * Math.sin(qrsX * 5);
        }
        if (qrsPos > 3.5 && qrsPos < 4.5) {
          endY += Math.sin(endNormX * 2.5 + 1.5) * 12 * params.amp;
        }

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(width - 4, endY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 20;
        ctx.shadowColor = neonColor;
        ctx.fillStyle = neonColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      offset += isActive ? params.speed : 1;
      animationFrameId = requestAnimationFrame(drawECG);
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };
    window.addEventListener('resize', handleResize);

    drawECG(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isActive, severity, params.amp, params.freq, params.speed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-full w-full rounded-xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${severity === 'critical' ? 'rgba(255, 0, 100, 0.3)' : 'rgba(0, 255, 200, 0.2)'}`,
      }}
    >
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''} ${severity === 'critical' ? 'bg-[#ff0064]' : 'bg-[#00ffc8]'}`} />
          <span className={`font-mono text-sm ${severity === 'critical' ? 'text-[#ff0064]' : 'text-[#00ffc8]'}`}>
            {isActive ? 'LIVE ECG' : 'NO SIGNAL'}
          </span>
        </div>
        <div className="text-white/60 text-xs mt-1 font-mono">
          {isActive ? `${params.bpm} BPM` : '-- BPM'}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
}

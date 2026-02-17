import { motion } from 'motion/react';
import { memo } from 'react';

export const AuthBackground = memo(function AuthBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Darker overlay for better text contrast */}
            <div className="absolute inset-0 bg-[#0a0a0f] z-0" />

            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-[#6464ff]/10 rounded-full blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.3, 1],
                    x: [0, -30, 0],
                    y: [0, -50, 0]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-[#00ffc8]/10 rounded-full blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
            />
        </div>
    );
});

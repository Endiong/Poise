import React, { useState, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

type SpineProps = {
    className?: string;
    interactive?: boolean;
};

const Spine: React.FC<SpineProps> = ({ className = '', interactive = true }) => {
    // We'll create a stack of "vertebrae" (stones) that react to mouse movement
    // The concept is a vertical stack that "scatters" or wiggles when hovered/dragged

    const containerRef = useRef<HTMLDivElement>(null);

    // Vertebrae count
    const vertebraeCount = 5;
    const vertebrae = Array.from({ length: vertebraeCount });

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col items-center justify-center gap-1 ${className}`}
            style={{ height: '300px', width: '100px' }}
        >
            {vertebrae.map((_, index) => (
                <Vertebra
                    key={index}
                    index={index}
                    total={vertebraeCount}
                    containerRef={containerRef}
                    interactive={interactive}
                />
            ))}
        </div>
    );
};

interface VertebraProps {
    index: number;
    total: number;
    containerRef: React.RefObject<HTMLDivElement>;
    interactive: boolean;
}

const Vertebra: React.FC<VertebraProps> = ({ index, total, containerRef, interactive }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring config for organic movement
    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // Random rotation for natural organic look (stones aren't perfect)
    // We use a stable random seed based on index
    const baseRotation = (index * 67 % 20) - 10;

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!interactive || !containerRef.current) return;

        // Calculate distance from cursor to this vertebra
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Scatter effect: move away from cursor, but stronger for middle elements maybe?
        // Or just move towards cursor like a magnet but with delay? 
        // Let's do a "shy" effect: they move slightly away when you get too close

        // Simple magnetic effect for now to feel "alive"
        const strength = 0.3;
        x.set(distanceX * strength);
        y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Size calculation: middle stones are slightly larger
    const middle = (total - 1) / 2;
    const distFromMiddle = Math.abs(index - middle);
    const size = 50 - (distFromMiddle * 5); // 50px middle, smaller outer

    return (
        <motion.div
            style={{
                x: springX,
                y: springY,
                width: size,
                height: size * 0.8,
                rotate: baseRotation,
            }}
            className="bg-gray-900 dark:bg-white rounded-[40%_60%_70%_30%/40%_50%_60%_50%] cursor-pointer hover:bg-[#9C9BFF] transition-colors duration-300"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.1, rotate: baseRotation + 10 }}
            whileTap={{ scale: 0.9 }}
        />
    );
};

export default Spine;

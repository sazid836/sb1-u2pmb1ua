import React from 'react';
import { motion } from 'framer-motion';

interface FloatingIconProps {
  emoji: string;
  delay: number;
  duration: number;
  x: string;
  y: string;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({ 
  emoji, 
  delay, 
  duration, 
  x, 
  y 
}) => {
  return (
    <motion.div
      className="absolute text-2xl opacity-20 pointer-events-none select-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 10, -10, 0],
        y: [-20, 20, -20]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {emoji}
    </motion.div>
  );
};
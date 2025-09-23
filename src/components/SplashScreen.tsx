import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingIcon } from './FloatingIcon';
import { Heart, Activity, Stethoscope } from 'lucide-react';

interface SplashScreenProps {
  onEnterApp: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnterApp }) => {
  const [isHovered, setIsHovered] = useState(false);

  const floatingIcons = [
    { emoji: '🩺', delay: 0, duration: 4, x: '10%', y: '20%' },
    { emoji: '💊', delay: 1, duration: 3.5, x: '85%', y: '15%' },
    { emoji: '💉', delay: 2, duration: 4.5, x: '15%', y: '80%' },
    { emoji: '❤️', delay: 0.5, duration: 3, x: '80%', y: '75%' },
    { emoji: '🏥', delay: 1.5, duration: 4, x: '5%', y: '50%' },
    { emoji: '📋', delay: 2.5, duration: 3.5, x: '90%', y: '45%' },
    { emoji: '🔬', delay: 1, duration: 4.5, x: '20%', y: '30%' },
    { emoji: '🩹', delay: 3, duration: 3, x: '75%', y: '25%' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  const confettiVariants = {
    hidden: { scale: 0, rotate: 0 },
    visible: {
      scale: [0, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Floating Medical Icons */}
      {floatingIcons.map((icon, index) => (
        <FloatingIcon
          key={index}
          emoji={icon.emoji}
          delay={icon.delay}
          duration={icon.duration}
          x={icon.x}
          y={icon.y}
        />
      ))}

      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-200/30 to-transparent rounded-full"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-300/20 to-transparent rounded-full"
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Confetti Animation */}
        <motion.div
          className="flex justify-center mb-6"
          variants={confettiVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-6xl">🎉</div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight"
          variants={itemVariants}
        >
          <span className="text-5xl md:text-7xl lg:text-8xl">🎉</span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Congratulations
          </span>
          <br />
          <span className="text-blue-700">Dr. MAHJABIN PRAPTY</span>
          <br />
          <span className="text-5xl md:text-7xl lg:text-8xl">🎉</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-12 font-medium leading-relaxed"
          variants={itemVariants}
        >
          Welcome to your{' '}
          <span className="text-blue-600 font-semibold">Smart Clinic Assistant</span>
          <br />
          – Designed Just for You{' '}
          <span className="inline-block text-blue-500">💙</span>
        </motion.p>

        {/* Animated Medical Graphics */}
        <motion.div
          className="flex justify-center space-x-8 mb-12"
          variants={itemVariants}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-blue-500"
          >
            <Stethoscope size={48} />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-red-500"
          >
            <Heart size={48} fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{
              scaleY: [1, 0.8, 1.2, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-green-500"
          >
            <Activity size={48} />
          </motion.div>
        </motion.div>

        {/* Enter App Button */}
        <motion.div
          variants={itemVariants}
          className="mb-16"
        >
          <motion.button
            onClick={onEnterApp}
            className="relative px-12 py-6 text-xl md:text-2xl font-bold text-white rounded-full shadow-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 transform transition-all duration-300 overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Animated background shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={isHovered ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center space-x-3">
              <span>Enter App</span>
              <motion.span
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-lg md:text-xl text-gray-600 font-medium"
          variants={itemVariants}
        >
          Gifted with care{' '}
          <motion.span
            className="inline-block text-red-500"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          >
            ❤️
          </motion.span>
        </motion.p>
      </motion.div>

      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none" />
    </div>
  );
};
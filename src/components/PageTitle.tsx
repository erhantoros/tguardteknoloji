import React from 'react';
import { motion } from 'framer-motion';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

function PageTitle({ title, subtitle, className = '', light = false }: PageTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`text-center mb-16 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative inline-block"
      >
        <motion.h1
          className={`text-4xl md:text-5xl font-bold mb-4 relative z-10 ${
            light ? 'text-white' : 'text-gray-900'
          }`}
          style={{
            textShadow: light ? '0 0 40px rgba(59, 130, 246, 0.5)' : 'none',
            WebkitTextStroke: light ? '1px rgba(255, 255, 255, 0.1)' : 'none'
          }}
        >
          <span className={light ? 'bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 text-transparent bg-clip-text' : ''}>
            {title}
          </span>
          <motion.span
            className={`absolute -inset-x-2 inset-y-3 ${
              light ? 'bg-blue-500/20' : 'bg-blue-500/5'
            } blur-xl -z-10`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </motion.h1>
      </motion.div>
      
      {subtitle && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`text-xl relative ${light ? 'text-blue-100' : 'text-gray-600'}`}
        >
          <span className="relative">
            {subtitle}
            <motion.span
              className={`absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent ${
                light ? 'via-blue-300' : 'via-blue-500'
              } to-transparent`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </span>
        </motion.p>
      )}
    </motion.div>
  );
}

export default PageTitle;
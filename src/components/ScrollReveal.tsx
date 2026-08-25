import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-in' | 'fade-left' | 'fade-right' | 'zoom-in';
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  viewportAmount?: number | 'some' | 'all';
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  duration = 0.55,
  delay = 0,
  distance = 28,
  className = '',
  viewportAmount = 0.12,
  once = true,
  ...props
}) => {
  const getInitial = () => {
    switch (animation) {
      case 'fade-up':
        return { opacity: 0, y: distance };
      case 'fade-down':
        return { opacity: 0, y: -distance };
      case 'fade-left':
        return { opacity: 0, x: distance };
      case 'fade-right':
        return { opacity: 0, x: -distance };
      case 'zoom-in':
        return { opacity: 0, scale: 0.95 };
      case 'fade-in':
      default:
        return { opacity: 0 };
    }
  };

  const getTarget = () => {
    switch (animation) {
      case 'zoom-in':
        return { opacity: 1, scale: 1 };
      case 'fade-in':
        return { opacity: 1 };
      default:
        return { opacity: 1, x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getTarget()}
      viewport={{ once, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth cubic ease-out
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;

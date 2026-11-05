import React, { useState, useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in ms
  threshold?: number;
}

/**
 * ScrollReveal Component
 * Smoothly animates children with fade-in and upward slide when scrolled into viewport.
 * Uses Intersection Observer with 1-time trigger to prevent unnecessary re-animations.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timer = setTimeout(() => {
              setIsRevealed(true);
            }, delay);
          } else {
            setIsRevealed(true);
          }
          obs.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (timer) clearTimeout(timer);
      if (element) observer.unobserve(element);
    };
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`reveal-on-scroll ${isRevealed ? 'is-revealed' : ''} ${className}`}>
      {children}
    </div>
  );
};

import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationIconProps {
  gender?: 'female' | 'male' | 'unisex' | 'prefer_not_to_say' | string | null;
  className?: string;
}

/**
 * Bow Icon for Female users
 * Stylish pink/burgundy bow ribbon matching RENTORA's luxury aesthetic
 */
export const BowIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    {/* Left knot loop */}
    <path d="M12 11.5c-2.8-4-8.2-4.5-9.8-.2 1.6 4.2 7 3.8 9.8.2z" fill="currentColor" fillOpacity="0.2" />
    {/* Right knot loop */}
    <path d="M12 11.5c2.8-4 8.2-4.5 9.8-.2-1.6 4.2-7 3.8-9.8.2z" fill="currentColor" fillOpacity="0.2" />
    {/* Center knot */}
    <circle cx="12" cy="11.5" r="2.2" fill="currentColor" />
    {/* Ribbon tails */}
    <path d="M10.2 13.2L6.8 21.2l3.4-2.2 3.8 2.2-3.4-8" />
  </svg>
);

/**
 * Stylish Goggles Icon for Male users
 * Elegant luxury goggles/aviators matching RENTORA's branding
 */
export const GogglesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    {/* Left Lens */}
    <path d="M3.5 10c0-1.8 1.6-3.2 3.5-3.2s3.5 1.4 3.5 3.2v1.8c0 2.2-1.6 4.2-3.5 4.2S3.5 14 3.5 11.8V10z" fill="currentColor" fillOpacity="0.2" />
    {/* Right Lens */}
    <path d="M13.5 10c0-1.8 1.6-3.2 3.5-3.2s3.5 1.4 3.5 3.2v1.8c0 2.2-1.6 4.2-3.5 4.2s-3.5-2-3.5-4.2V10z" fill="currentColor" fillOpacity="0.2" />
    {/* Double Bridge Bar */}
    <path d="M10.5 9h3" strokeWidth="2" />
    <path d="M10.5 11.5c.8-.8 2.2-.8 3 0" strokeWidth="1.8" />
    {/* Left Frame Arm */}
    <path d="M3.5 9L1.5 8" />
    {/* Right Frame Arm */}
    <path d="M20.5 9l2-1" />
  </svg>
);

/**
 * Dynamic Notification Icon Component based on logged-in user's gender preference:
 * - Female: Pink/Burgundy Bow Icon
 * - Male: Stylish Goggles Icon
 * - Unisex / Unselected: Neutral Bell Icon
 */
export const NotificationIcon: React.FC<NotificationIconProps> = ({ gender, className = "w-5 h-5" }) => {
  const normalizedGender = (gender || '').toLowerCase().trim();

  if (normalizedGender === 'female' || normalizedGender === 'her') {
    return <BowIcon className={className} />;
  }
  
  if (normalizedGender === 'male' || normalizedGender === 'him') {
    return <GogglesIcon className={className} />;
  }

  // Neutral bell for unisex or unselected/prefer_not_to_say/logged-out
  return <Bell className={className} />;
};

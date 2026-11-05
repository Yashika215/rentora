import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

interface AuthPageProps {
  isOpen?: boolean;
  isModal?: boolean;
  onClose?: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
  signOutNotice?: string | null;
  onClearSignOutNotice?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  isOpen = true,
  isModal = false,
  onClose,
  onSuccess,
  initialMode = 'signin',
  signOutNotice = null,
  onClearSignOutNotice,
}) => {
  const { signIn, signUp, forgotPassword, resetPassword } = useAuth();
  const { location } = useLocation();

  // Mode: 'signin' (Log In) or 'signup' (Sign Up)
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Returning session check
  const [isReturning] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('rentora_auth_token');
    } catch {
      return false;
    }
  });

  // Login form fields (empty & unselected by default)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRememberMe, setLoginRememberMe] = useState(false);

  // Sign up form fields (empty & unselected by default)
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpGender, setSignUpGender] = useState<'female' | 'male' | 'unisex' | 'prefer_not_to_say'>('female');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [signUpRememberMe, setSignUpRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password flow
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Terms dialog modal
  const [showTermsModal, setShowTermsModal] = useState(false);

  if (isModal && !isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsForgotOpen(false);
    if (onClearSignOutNotice) onClearSignOutNotice();
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (onClearSignOutNotice) onClearSignOutNotice();

    const cleanEmail = loginEmail.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await signIn(cleanEmail, loginPassword);
    setIsLoading(false);

    if (result.success && result.user) {
      onSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Sign in failed. Please check your credentials.');
    }
  };

  // Handle Sign Up submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (onClearSignOutNotice) onClearSignOutNotice();

    const cleanName = signUpName.trim();
    const cleanEmail = signUpEmail.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type your password.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    const result = await signUp({ 
      fullName: cleanName, 
      email: cleanEmail, 
      password: signUpPassword,
      gender: signUpGender,
    });
    setIsLoading(false);

    if (result.success && result.user) {
      onSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
    }
  };

  // Handle Social Auth Buttons
  const handleSocialAuth = async (providerName: string) => {
    setErrorMessage(null);
    setIsLoading(true);
    const demoEmail = `${providerName.toLowerCase()}.renter@rentora.in`;
    const result = await signIn(demoEmail, 'SocialLoginPass123!');
    setIsLoading(false);

    if (result.success && result.user) {
      onSuccess(result.user);
    } else {
      setErrorMessage(`Failed to authenticate with ${providerName}. Please try email sign in.`);
    }
  };

  // Forgot Password step 1: send reset
  const handleSendResetEmail = async () => {
    if (!forgotEmail.trim() || !validateEmail(forgotEmail)) {
      setErrorMessage('Please enter a valid email address to send reset instructions.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    const result = await forgotPassword(forgotEmail.trim());
    setIsLoading(false);

    if (result.success) {
      setForgotSuccess(result.message || 'Verification code sent to your email!');
    } else {
      setErrorMessage(result.error || 'Failed to send reset email.');
    }
  };

  // Forgot Password step 2: complete reset
  const handleCompleteReset = async () => {
    if (!resetCodeInput.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(forgotEmail.trim(), newPasswordInput, resetCodeInput);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
      setLoginEmail(forgotEmail);
      setLoginPassword(newPasswordInput);
      setIsForgotOpen(false);
      setForgotSuccess(null);
    } else {
      setErrorMessage(result.error || 'Password reset failed.');
    }
  };

  // Core Authentication Container
  const containerContent = (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center p-1 sm:p-2">
      
      {/* Outer Card Container featuring Sheer Flowing Burgundy Silk Fabric */}
      <div 
        className="w-full bg-[#F5EFE7] rounded-[32px] sm:rounded-[44px] overflow-hidden shadow-[0_25px_65px_-10px_rgba(74,13,25,0.22)] border border-[#F2DCD5] grid grid-cols-1 lg:grid-cols-12 relative min-h-[580px] lg:min-h-[640px] bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url('/assets/aistudio/rentora_auth_fabric.jpg')` }}
      >
        {/* Subtle warm gradient scrim for flawless contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F5EFE7]/25 to-[#F5EFE7]/90 pointer-events-none" />

        {/* Close Button if opened inside Modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#4A0D19] border border-[#C6A77D]/40 shadow-sm cursor-pointer transition-all hover:scale-105"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ================= LEFT SECTION: RENTORA BRANDING & FLOWING SILK ================= */}
        <div className="lg:col-span-6 relative flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 text-center z-10">
          
          {/* Mobile / Tablet Branding Header */}
          <div className="lg:hidden relative w-full flex flex-col items-center pt-2 pb-2">
            <div className="relative z-10 w-full max-w-[180px] sm:max-w-[220px] mb-2">
              <img
                src="/assets/aistudio/rentora-logo_359e5dd0.png"
                alt="RENTORA"
                className="w-full h-auto object-contain max-h-16 sm:max-h-20 mx-auto drop-shadow-sm"
              />
            </div>
            <div className="relative z-10 w-12 sm:w-16 h-[1px] bg-[#4A0D19]/35 my-2" />
            <p className="relative z-10 font-serif italic text-xs sm:text-sm text-[#4A0D19] font-medium leading-snug">
              Wear the Moment.<br />Return the Outfit.
            </p>
          </div>

          {/* Desktop Left Branding Section */}
          <div className="hidden lg:flex flex-col items-center justify-center relative z-10 my-auto">
            {/* Official RENTORA Emblem Logo */}
            <div className="w-full max-w-[240px] xl:max-w-[290px] mb-1">
              <img
                src="/assets/aistudio/rentora-logo_359e5dd0.png"
                alt="RENTORA — Rent Wear Repeat"
                className="w-full h-auto object-contain drop-shadow-md mx-auto"
              />
            </div>

            <div className="w-16 h-[1px] bg-[#4A0D19]/40 my-3" />

            <p className="font-serif italic text-base sm:text-xl text-[#4A0D19] font-medium max-w-xs leading-snug">
              Wear the Moment.<br />Return the Outfit.
            </p>
          </div>

        </div>

        {/* ================= RIGHT SECTION: GLASSMORPHISM AUTH CARD ================= */}
        <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center lg:items-end z-20">
          
          {/* Floating Glass-Style Card */}
          <div className="w-full max-w-[440px] sm:max-w-[460px] bg-[#FDFBF9]/90 backdrop-blur-xl rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 lg:p-9 border border-white/80 shadow-[0_15px_45px_rgba(74,13,25,0.08)] relative box-border">
            
            {/* Heading & Subtitle */}
            <div className="text-center mb-5 sm:mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A0D19] tracking-tight">
                {mode === 'signin' 
                  ? (isReturning ? 'Welcome Back to RENTORA' : 'Welcome to RENTORA')
                  : 'Welcome to RENTORA'}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#4A0D19]/80 mt-1.5 leading-relaxed font-sans max-w-xs mx-auto">
                Create your account or log in to continue your rental fashion journey.
              </p>
            </div>

            {/* Flash Sign-Out Notice */}
            {signOutNotice && (
              <div className="mb-4 bg-[#F2DCD5]/80 border border-[#6D3546]/30 text-[#4A0D19] text-xs px-3.5 py-2 rounded-full flex items-center justify-between gap-2 animate-fadeIn">
                <span className="font-medium truncate">{signOutNotice}</span>
                {onClearSignOutNotice && (
                  <button
                    onClick={onClearSignOutNotice}
                    className="text-[#4A0D19]/60 hover:text-[#4A0D19] p-0.5 cursor-pointer shrink-0"
                    aria-label="Dismiss notice"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3.5 py-2 rounded-2xl flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2 rounded-2xl flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="leading-tight">{successMessage}</span>
              </div>
            )}

            {/* ================= LOG IN FORM ================= */}
            {mode === 'signin' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3 sm:space-y-3.5">
                
                {/* Email Address */}
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-[#7A5B63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-full border border-[#EBDCD0] bg-white text-xs sm:text-sm text-[#4A0D19] placeholder:text-[#8F757D] focus:outline-none focus:border-[#4A0D19] focus:ring-1 focus:ring-[#4A0D19]/30 transition-all font-sans shadow-2xs box-border"
                  />
                </div>

                {/* Password with Visibility Toggle */}
                <div className="relative w-full">
                  <Lock className="w-4 h-4 text-[#7A5B63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-full border border-[#EBDCD0] bg-white text-xs sm:text-sm text-[#4A0D19] placeholder:text-[#8F757D] focus:outline-none focus:border-[#4A0D19] focus:ring-1 focus:ring-[#4A0D19]/30 transition-all font-sans shadow-2xs box-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A5B63] hover:text-[#4A0D19] cursor-pointer p-1 shrink-0 z-10"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <Eye className="w-4 h-4 stroke-[1.75]" /> : <EyeOff className="w-4 h-4 stroke-[1.75]" />}
                  </button>
                </div>

                {/* Row: Remember me & Forgot Password */}
                <div className="flex items-center justify-between pt-1 px-1 text-[11px] sm:text-xs text-[#4A0D19]">
                  <label className="flex items-center gap-1.5 cursor-pointer font-sans select-none">
                    <input
                      type="checkbox"
                      checked={loginRememberMe}
                      onChange={(e) => setLoginRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#C6A77D] text-[#4A0D19] focus:ring-[#4A0D19] accent-[#4A0D19] cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(!isForgotOpen)}
                    className="text-[#4A0D19] hover:underline font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Forgot Password Accordion Drawer */}
                {isForgotOpen && (
                  <div className="p-3 rounded-2xl bg-[#F5EFE7] border border-[#C6A77D]/60 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4A0D19]">Reset Your Password</span>
                      <button
                        type="button"
                        onClick={() => setIsForgotOpen(false)}
                        className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!forgotSuccess ? (
                      <div className="space-y-2">
                        <p className="text-[11px] text-[#4A0D19]/80 font-sans leading-normal">
                          Enter your account email to receive an instant verification reset code.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#C6A77D]/50 rounded-full text-[#4A0D19] focus:outline-none focus:border-[#4A0D19]"
                          />
                          <button
                            type="button"
                            onClick={handleSendResetEmail}
                            disabled={isLoading}
                            className="px-3 py-1.5 bg-[#4A0D19] text-[#F5EFE7] rounded-full text-xs font-semibold hover:bg-[#380913] cursor-pointer disabled:opacity-50 transition-colors shrink-0"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          {forgotSuccess}
                        </p>
                        <input
                          type="text"
                          value={resetCodeInput}
                          onChange={(e) => setResetCodeInput(e.target.value)}
                          placeholder="6-Digit Reset Code"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#C6A77D]/50 rounded-full text-[#4A0D19]"
                        />
                        <input
                          type="password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="New password (min 6 chars)"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#C6A77D]/50 rounded-full text-[#4A0D19]"
                        />
                        <button
                          type="button"
                          onClick={handleCompleteReset}
                          disabled={isLoading}
                          className="w-full py-2 bg-[#4A0D19] text-white rounded-full text-xs font-bold hover:bg-[#380913] cursor-pointer disabled:opacity-50 transition-colors"
                        >
                          Update Password & Log In
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Burgundy Button: Log In */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-5 rounded-full bg-[#4A0D19] hover:bg-[#380913] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_14px_rgba(74,13,25,0.30)] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F2DCD5]" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Log In</span>
                  )}
                </button>

                {/* Divider: "—— Or log in with ——" */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <div className="flex-1 h-[1px] bg-[#4A0D19]/20" />
                  <span className="text-[11px] text-[#4A0D19]/70 font-sans">Or log in with</span>
                  <div className="flex-1 h-[1px] bg-[#4A0D19]/20" />
                </div>

                {/* Social Login Buttons: Facebook, Google, LinkedIn */}
                <div className="flex items-center justify-center gap-3.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Facebook')}
                    disabled={isLoading}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] hover:opacity-90 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    aria-label="Log in with Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Google')}
                    disabled={isLoading}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    aria-label="Log in with Google"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.18 3.66-9.14z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.3 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.13z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.7 1.27 6.59l4.01 3.13c.95-2.83 3.6-4.97 6.72-4.97z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('LinkedIn')}
                    disabled={isLoading}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A66C2] hover:opacity-90 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    aria-label="Log in with LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </button>
                </div>

                {/* Bottom Text: New to RENTORA? Create an Account */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#4A0D19]/80 font-sans">
                    New to RENTORA?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="font-bold text-[#4A0D19] underline hover:text-[#6D3546] cursor-pointer"
                    >
                      Create an Account
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ================= SIGN UP FORM ================= */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3 sm:space-y-3.5">
                
                {/* Full Name */}
                <div className="relative w-full">
                  <User className="w-4 h-4 text-[#7A5B63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-full border border-[#EBDCD0] bg-white text-xs sm:text-sm text-[#4A0D19] placeholder:text-[#8F757D] focus:outline-none focus:border-[#4A0D19] focus:ring-1 focus:ring-[#4A0D19]/30 transition-all font-sans shadow-2xs box-border"
                  />
                </div>

                {/* Email Address */}
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-[#7A5B63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-full border border-[#EBDCD0] bg-white text-xs sm:text-sm text-[#4A0D19] placeholder:text-[#8F757D] focus:outline-none focus:border-[#4A0D19] focus:ring-1 focus:ring-[#4A0D19]/30 transition-all font-sans shadow-2xs box-border"
                  />
                </div>

                {/* Password with Visibility Toggle */}
                <div className="relative w-full">
                  <Lock className="w-4 h-4 text-[#7A5B63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-full border border-[#EBDCD0] bg-white text-xs sm:text-sm text-[#4A0D19] placeholder:text-[#8F757D] focus:outline-none focus:border-[#4A0D19] focus:ring-1 focus:ring-[#4A0D19]/30 transition-all font-sans shadow-2xs box-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A5B63] hover:text-[#4A0D19] cursor-pointer p-1 shrink-0 z-10"
                    aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignUpPassword ? <Eye className="w-4 h-4 stroke-[1.75]" /> : <EyeOff className="w-4 h-4 stroke-[1.75]" />}
                  </button>
                </div>

                {/* Confirm Password with Visibility Toggle */}
                <div className="relative w-full">
                  <Lock className="w-4 h-4 text-[#7A5B63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                  <input
                    type={showSignUpConfirmPassword ? 'text' : 'password'}
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-full border border-[#EBDCD0] bg-white text-xs sm:text-sm text-[#4A0D19] placeholder:text-[#8F757D] focus:outline-none focus:border-[#4A0D19] focus:ring-1 focus:ring-[#4A0D19]/30 transition-all font-sans shadow-2xs box-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A5B63] hover:text-[#4A0D19] cursor-pointer p-1 shrink-0 z-10"
                    aria-label={showSignUpConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showSignUpConfirmPassword ? <Eye className="w-4 h-4 stroke-[1.75]" /> : <EyeOff className="w-4 h-4 stroke-[1.75]" />}
                  </button>
                </div>


                {/* Checkboxes: Remember me & Terms */}
                <div className="space-y-1.5 pt-1 px-1 text-[11px] sm:text-xs text-[#4A0D19]">
                  <label className="flex items-center gap-1.5 cursor-pointer font-sans select-none">
                    <input
                      type="checkbox"
                      checked={signUpRememberMe}
                      onChange={(e) => setSignUpRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#C6A77D] text-[#4A0D19] focus:ring-[#4A0D19] accent-[#4A0D19] cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <label className="flex items-start gap-1.5 cursor-pointer font-sans">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-[#C6A77D] text-[#4A0D19] focus:ring-[#4A0D19] accent-[#4A0D19] cursor-pointer shrink-0"
                    />
                    <span className="leading-tight text-[11px] sm:text-xs">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className="underline text-[#4A0D19] font-bold hover:text-[#6D3546]"
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className="underline text-[#4A0D19] font-bold hover:text-[#6D3546]"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                </div>

                {/* Burgundy Button: Sign Up */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-5 rounded-full bg-[#4A0D19] hover:bg-[#380913] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_14px_rgba(74,13,25,0.30)] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F2DCD5]" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </button>

                {/* Divider: "—— Or sign up with ——" */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <div className="flex-1 h-[1px] bg-[#4A0D19]/20" />
                  <span className="text-[11px] text-[#4A0D19]/70 font-sans">Or sign up with</span>
                  <div className="flex-1 h-[1px] bg-[#4A0D19]/20" />
                </div>

                {/* Social Login Buttons: Facebook, Google, LinkedIn */}
                <div className="flex items-center justify-center gap-3.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Facebook')}
                    disabled={isLoading}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1877F2] hover:opacity-90 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    aria-label="Sign up with Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('Google')}
                    disabled={isLoading}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    aria-label="Sign up with Google"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.28-2.09 3.66-5.18 3.66-9.14z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.3 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.13z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.7 1.27 6.59l4.01 3.13c.95-2.83 3.6-4.97 6.72-4.97z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('LinkedIn')}
                    disabled={isLoading}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A66C2] hover:opacity-90 flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    aria-label="Sign up with LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </button>
                </div>

                {/* Bottom Text: Already have an account? Log In */}
                <div className="text-center pt-2">
                  <p className="text-xs text-[#4A0D19]/80 font-sans">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="font-bold text-[#4A0D19] underline hover:text-[#6D3546] cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* Terms of Service & Privacy Policy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFBF9] rounded-3xl p-6 shadow-2xl border border-[#F2DCD5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2DCD5] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4A0D19]" />
                <h3 className="font-serif text-lg font-bold text-[#4A0D19]">Terms of Service & Privacy Policy</h3>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)} 
                className="p-1 text-[#4A0D19]/60 hover:text-[#4A0D19] hover:bg-black/5 rounded-full cursor-pointer"
                aria-label="Close terms modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-[#4A0D19]/80 max-h-72 overflow-y-auto pr-2 font-sans">
              <p>
                <strong>1. Couture Rental Integrity:</strong> Every RENTORA designer garment is dry-cleaned, UV sanitized, and protected in certified travel bags. Minor wear and tear is 100% insured under our rental damage waiver.
              </p>
              <p>
                <strong>2. Serviceable Regions:</strong> RENTORA operates exclusive doorstep delivery and pickup across Gujarat, India (Ahmedabad, Surat, Vadodara, Rajkot, and Gandhinagar).
              </p>
              <p>
                <strong>3. Refundable Security Deposit:</strong> All security deposits are automatically credited back to your original source within 24 hours of successful doorstep return verification.
              </p>
              <p>
                <strong>4. Privacy & Wardrobe Sizing:</strong> Sizing measurements, aesthetic profiles, and reservation histories remain strictly encrypted and confidential.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                className="flex-1 py-2.5 bg-[#4A0D19] hover:bg-[#380913] text-white rounded-full text-xs font-bold cursor-pointer transition-colors"
              >
                Accept & Agree
              </button>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2.5 bg-white border border-[#C6A77D]/50 text-[#4A0D19] rounded-full text-xs font-semibold cursor-pointer hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // If used as modal
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="my-auto w-full max-w-5xl">
          {containerContent}
        </div>
      </div>
    );
  }

  // Full Page View (For signed-out visitors on homepage or direct auth navigation)
  return (
    <div className="min-h-screen bg-[#F7EFE8] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      <div className="w-full max-w-5xl z-10">
        {containerContent}
      </div>
    </div>
  );
};

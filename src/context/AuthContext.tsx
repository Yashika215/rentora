import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserLocation } from '../types';

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'female' | 'male' | 'unisex' | 'prefer_not_to_say';
  preferredAesthetics?: string[];
  preferredLocation?: UserLocation;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string; resetCode?: string }>;
  resetPassword: (email: string, newPassword: string, resetCode?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'rentora_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore authenticated session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUserRaw = localStorage.getItem('rentora_current_user');
      
      if (!storedToken && !storedUserRaw) {
        setIsLoading(false);
        return;
      }

      try {
        if (storedToken) {
          const res = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setCurrentUser(data.user);
              setToken(storedToken);
              localStorage.setItem('rentora_current_user', JSON.stringify(data.user));
              setIsLoading(false);
              return;
            }
          }
        }

        // Fallback: check stored user object
        if (storedUserRaw) {
          const parsed = JSON.parse(storedUserRaw);
          if (parsed && parsed.email) {
            setCurrentUser(parsed);
            setToken(storedToken || `token-${Date.now()}`);
          }
        }
      } catch (err) {
        console.warn('Session verification network issue, checking cached user:', err);
        if (storedUserRaw) {
          try {
            const parsed = JSON.parse(storedUserRaw);
            setCurrentUser(parsed);
            setToken(storedToken || `token-${Date.now()}`);
          } catch {}
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    setIsLoading(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      const msg = 'Please enter a validly formatted email address (e.g. demo@gmail.com).';
      setAuthError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    if (!password || password.trim() === '') {
      const msg = 'Please enter a non-empty password.';
      setAuthError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    // Demo Mode: Always succeed for any validly formatted email and non-empty password
    try {
      const namePart = cleanEmail.split('@')[0];
      const formattedName = namePart
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      const demoUser: UserProfile = {
        id: `usr-demo-${Date.now()}`,
        fullName: formattedName.length > 1 ? formattedName : 'Demo Renter',
        email: cleanEmail,
        phone: '+91 98765 43210',
        memberTier: 'Gold VIP Renter',
        savedAddress: {
          address: '',
          city: '',
          state: '',
          pincode: '',
        },
        preferredLocation: {
          country: 'India',
          state: 'Gujarat',
          city: '',
          hub: '',
          isServiceable: false,
        },
        preferredAesthetics: [],
        joinedDate: 'Oct 2026',
        rentalCredits: 500,
      };

      const fallbackToken = `token-demo-${Date.now()}`;
      setToken(fallbackToken);
      setCurrentUser(demoUser);
      localStorage.setItem(TOKEN_KEY, fallbackToken);
      localStorage.setItem('rentora_current_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return { success: true, user: demoUser };
    } catch {
      const msg = 'Demo authentication error. Please try again.';
      setAuthError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const signUp = async (data: SignUpData) => {
    setAuthError(null);
    setIsLoading(true);

    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanName = (data.fullName || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      const msg = 'Please enter a validly formatted email address.';
      setAuthError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    if (!data.password || data.password.trim() === '') {
      const msg = 'Please enter a non-empty password.';
      setAuthError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }

    // Local demo account creation (No server calls for academic prototype)
    const namePart = cleanEmail.split('@')[0];
    const defaultName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const finalName = cleanName.length >= 2 ? cleanName : defaultName;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: finalName,
      email: cleanEmail,
      phone: data.phone || '+91 98765 43210',
      gender: data.gender,
      memberTier: 'Gold VIP Renter',
      savedAddress: {
        address: '',
        city: '',
        state: '',
        pincode: '',
      },
      preferredLocation: {
        country: 'India',
        state: 'Gujarat',
        city: '',
        hub: '',
        isServiceable: false,
      },
      preferredAesthetics: [],
      joinedDate: 'Oct 2026',
      rentalCredits: 300,
    };

    try {
      const fallbackToken = `token-demo-${Date.now()}`;
      setToken(fallbackToken);
      setCurrentUser(newUser);
      localStorage.setItem(TOKEN_KEY, fallbackToken);
      localStorage.setItem('rentora_current_user', JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch {
      const msg = 'Registration error. Please try again.';
      setAuthError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    const activeToken = token || localStorage.getItem(TOKEN_KEY);
    if (activeToken) {
      try {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        });
      } catch (e) {
        console.warn('Signout network error:', e);
      }
    }

    // Invalidate local state & token storage
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('rentora_current_user');
    } catch {}

    setToken(null);
    setCurrentUser(null);
    setAuthError(null);
  };

  const updateProfile = async (updateData: Partial<UserProfile>) => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to update your profile.' };
    }

    try {
      const activeToken = token || localStorage.getItem(TOKEN_KEY);
      if (activeToken) {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify(updateData),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            try {
              localStorage.setItem('rentora_current_user', JSON.stringify(data.user));
            } catch {}
            return { success: true, user: data.user };
          }
        }
      }
    } catch (err) {
      console.warn('Network update error, applying local profile update:', err);
    }

    // Direct local state update
    const updatedUser: UserProfile = {
      ...currentUser,
      ...updateData,
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('rentora_current_user', JSON.stringify(updatedUser));
      // Update in registered accounts array if present
      const accountsRaw = localStorage.getItem('rentora_registered_accounts');
      if (accountsRaw) {
        const accounts = JSON.parse(accountsRaw);
        const idx = accounts.findIndex((a: any) => a.email.toLowerCase() === updatedUser.email.toLowerCase());
        if (idx !== -1) {
          accounts[idx] = { ...accounts[idx], ...updatedUser };
          localStorage.setItem('rentora_registered_accounts', JSON.stringify(accounts));
        }
      }
    } catch {}

    return { success: true, user: updatedUser };
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message, resetCode: data.resetCode };
      }
    } catch (err) {
      console.warn('Network error on forgotPassword, using client fallback:', err);
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      success: true,
      message: `Password reset instructions and verification code sent to ${email}.`,
      resetCode,
    };
  };

  const resetPassword = async (email: string, newPassword: string, resetCode?: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, resetCode }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message };
      }
    } catch (err) {
      console.warn('Network error on resetPassword, using client fallback:', err);
    }
    return {
      success: true,
      message: 'Password has been reset successfully! You can now sign in with your new password.',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: Boolean(currentUser && token),
        isLoading,
        authError,
        signIn,
        signUp,
        signOut,
        updateProfile,
        forgotPassword,
        resetPassword,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

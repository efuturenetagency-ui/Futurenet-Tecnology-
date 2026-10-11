import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  demoUser: { email: string; displayName: string; role: UserRole } | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  isOrderManager: boolean;
  isContentEditor: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoAdmin: (role?: UserRole) => void;
  logout: () => Promise<void>;
}

const BOOTSTRAP_ADMIN_EMAIL = 'mdshihabhossen.web@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<{ email: string; displayName: string; role: UserRole } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo user saved in session
    const savedDemo = sessionStorage.getItem('ft_demo_admin');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setDemoUser(parsed);
        setRole(parsed.role);
      } catch (e) {
        sessionStorage.removeItem('ft_demo_admin');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Clear demo if real user signed in
        setDemoUser(null);
        sessionStorage.removeItem('ft_demo_admin');

        // Check if bootstrapped super admin
        if (firebaseUser.email === BOOTSTRAP_ADMIN_EMAIL) {
          setRole('super_admin');
          try {
            await setDoc(
              doc(db, 'admins', firebaseUser.uid),
              {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Super Admin',
                role: 'super_admin',
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (e) {
            console.warn('Could not sync admin doc:', e);
          }
        } else {
          // Check Firestore admins collection
          try {
            const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
            if (adminDoc.exists()) {
              setRole(adminDoc.data()?.role || 'manager');
            } else {
              setRole(null);
            }
          } catch (e) {
            console.warn('Error reading admin role:', e);
            setRole(null);
          }
        }
      } else if (!savedDemo) {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const loginAsDemoAdmin = (assignedRole: UserRole = 'super_admin') => {
    const demo = {
      email: BOOTSTRAP_ADMIN_EMAIL,
      displayName: 'Shihab Hossen (Super Admin)',
      role: assignedRole,
    };
    setDemoUser(demo);
    setRole(assignedRole);
    sessionStorage.setItem('ft_demo_admin', JSON.stringify(demo));
  };

  const logout = async () => {
    setDemoUser(null);
    setRole(null);
    sessionStorage.removeItem('ft_demo_admin');
    await signOut(auth);
  };

  const isAuthenticated = Boolean(user || demoUser);
  const isAdmin = Boolean(role);
  const isSuperAdmin = role === 'super_admin';
  const isManager = role === 'manager' || isSuperAdmin;
  const isOrderManager = role === 'order_manager' || isSuperAdmin || role === 'manager';
  const isContentEditor = role === 'content_editor' || isSuperAdmin || role === 'manager';

  return (
    <AuthContext.Provider
      value={{
        user,
        demoUser,
        role,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isManager,
        isOrderManager,
        isContentEditor,
        loading,
        loginWithGoogle,
        loginAsDemoAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const initializeFirebase = async () => {
  if (!app) {
    const response = await fetch('/api/firebase-config');
    const firebaseConfig = await response.json();
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
};

const getFirebaseAuth = () => {
  if (!auth) {
    throw new Error("Firebase Auth hasn't been initialized. Call initializeFirebase() first.");
  }
  return auth;
};

const getFirebaseDb = () => {
  if (!db) {
    throw new Error("Firestore hasn't been initialized. Call initializeFirebase() first.");
  }
  return db;
};

export { initializeFirebase, getFirebaseAuth as auth, getFirebaseDb as db };

export const clearUserCache = () => {
  localStorage.removeItem('userCache');
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await initializeFirebase();
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
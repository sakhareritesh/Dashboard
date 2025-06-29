'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

export interface UpdatableUser {
    name?: string;
    avatar?: string | null; 
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UpdatableUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); 
  useEffect(() => {
    if (loading) return; 

    const isAuthPage = pathname === '/login' || pathname === '/signup';


    if (user && isAuthPage) {
      router.push('/');
    }
    

    if (!user && !isAuthPage) {
      router.push('/login');
    }

  }, [user, loading, pathname, router]);


  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    
  };

  const signup = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { 
        displayName: name,
        photoURL: 'https://placehold.co/80x80.png'
    });
   
  };

  const logout = () => {
    signOut(auth);
  };
  
  const updateUser = async (userData: UpdatableUser) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
  
    const previousUser = user;
    if (!previousUser) throw new Error("Cannot update a non-existent user.");
  
    
    setUser(currentUser => {
      if (!currentUser) return null;
      return {
        ...currentUser,
        name: userData.name || currentUser.name,
        avatar: userData.avatar || currentUser.avatar, 
      };
    });
   
  
    try {
      const firebaseUpdates: { displayName?: string; photoURL?: string } = {};
      const { name, avatar: avatarDataUrl } = userData;
      const currentUser = auth.currentUser;
  
      
      if (avatarDataUrl) {
        const filePath = `avatars/${currentUser.uid}/${Date.now()}`;
        const storageRef = ref(storage, filePath);
        const uploadResult = await uploadString(storageRef, avatarDataUrl, 'data_url');
        firebaseUpdates.photoURL = await getDownloadURL(uploadResult.ref);
      }
      
      
      if (name && name !== currentUser.displayName) {
          firebaseUpdates.displayName = name;
      }
  
      if (Object.keys(firebaseUpdates).length > 0) {
        await updateProfile(currentUser, firebaseUpdates);
        
        if (firebaseUpdates.photoURL) {
            setUser(prevUser => prevUser ? { ...prevUser, avatar: firebaseUpdates.photoURL! } : null);
        }
      }
    } catch (error) {
      
      setUser(previousUser);
      toast({
          variant: "destructive",
          title: "Save Failed",
          description: "There was an error updating your profile. Please try again.",
      });
     
      throw error;
    }
  };


  const value = { user, loading, login, signup, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

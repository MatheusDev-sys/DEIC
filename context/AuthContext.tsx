import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  userRole: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  userRole: null,
  isLoading: true,
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      // Timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timed out')), 2000)
      );

      // Query promise
      const queryPromise = async () => {
        // Primeiro, buscar o profile com role_id
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role_id')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        if (!profile?.role_id) return null;

        // Depois, buscar o nome do role
        const { data: role, error: roleError } = await supabase
          .from('roles')
          .select('name')
          .eq('id', profile.role_id)
          .single();

        if (roleError) throw roleError;
        return role?.name;
      };

      // Race between query and timeout
      const result = await Promise.race([queryPromise(), timeoutPromise]);
      return result;

    } catch (err) {
      // Fallback: se der erro ou timeout, retorna null (usuário comum) para não travar o app
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        try {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } catch (error) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, userRole, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
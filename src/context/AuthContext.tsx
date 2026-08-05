import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  fullName: string;
  role: string;
  roleId?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasPermission: (permissionId: string) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      // Load permissions via RPC
      const { data: permData } = await supabase
        .rpc('get_user_permissions', { user_uuid: userId });

      const permissions = permData?.map((p: any) => p.permission_id) || [];

      setProfile({
        id: data.id,
        fullName: data.full_name,
        role: data.role,
        roleId: data.role_id,
        permissions,
      });
    } else {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const meta = userData.user.user_metadata;
        const newProfile: UserProfile = {
          id: userId,
          fullName: meta?.full_name || userData.user.email || '',
          role: meta?.role || 'customer',
          permissions: [],
        };
        setProfile(newProfile);
      }
    }
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const isAdmin = profile?.role === 'admin';

  const hasPermission = (permissionId: string): boolean => {
    if (!profile) return false;
    if (profile.role === 'admin') return true;
    return profile.permissions.includes(permissionId);
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    if (!profile) return false;
    if (profile.role === 'admin') return true;
    return permissionIds.some(p => profile.permissions.includes(p));
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signOut, isAdmin, hasPermission, hasAnyPermission, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

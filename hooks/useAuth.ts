
import { useState, useEffect } from 'react';
import { User } from '../types';
import { onAuthUpdate, logoutUser as fbLogoutUser } from '../services/firebaseService';

const ADMIN_EMAIL = 'admin@t-kap.com.vn';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthUpdate(fbUser => {
      if (!fbUser) return setUser(null);
      const isAdmin = fbUser.email === ADMIN_EMAIL;
      setUser({
        id: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
        role: isAdmin ? 'admin' : 'customer'
      });
    });
    return () => unsubAuth();
  }, []);

  const logoutUser = async () => {
    await fbLogoutUser();
    setUser(null);
  };

  return { user, logoutUser };
};

"use client";

import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

export const useAuth = () => {
  return useContext(AuthContext);
};

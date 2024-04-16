import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../providers/authProvider';


export default function Root() {
  const {isAuthenticated} = useAuth();

  if (isAuthenticated) return <Redirect href="/(tabs)" />;
  return <Redirect href="/login" />;
}

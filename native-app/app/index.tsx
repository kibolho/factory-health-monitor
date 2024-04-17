import { Redirect, useRootNavigationState } from 'expo-router';
import React from 'react';
import { useAuth } from '../providers/authProvider';


export default function Root() {
  const {isAuthenticated} = useAuth();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key || isAuthenticated == undefined) return <></>;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;
  return <Redirect href="/login" />;
}

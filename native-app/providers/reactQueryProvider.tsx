import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import * as React from 'react';
import { AppStateStatus, Platform } from 'react-native';

import { useAppState } from '../hooks/useAppState';
import { useOnlineManager } from '../hooks/useOnlineManager';

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export const ReactQueryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  useOnlineManager();

  useAppState(onAppStateChange);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

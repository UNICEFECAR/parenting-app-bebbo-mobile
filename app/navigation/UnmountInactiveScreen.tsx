import { useNavigationState, useRoute } from '@react-navigation/native';
import React from 'react';

/** Unmount on a sibling-route switch, while keeping screens covered by a parent stack. */
export default function UnmountInactiveScreen({ children }: { children: React.ReactNode }) {
  const route = useRoute();
  const isActive = useNavigationState(
    state => state.routes[state.index]?.key === route.key,
  );
  return isActive ? children : null;
}

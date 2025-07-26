'use client';

import { Provider } from 'react-redux';
import { Store } from './Store/store';

export function ReduxProvider({ children }) {
  return <Provider store={Store}>{children}</Provider>;
}

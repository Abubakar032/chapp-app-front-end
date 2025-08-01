'use client';

import { Provider } from 'react-redux';
import {Store} from '@/app/Redux/Store';


export function ReduxProvider({ children }) {
  return <Provider store={Store}>{children}</Provider>;
}

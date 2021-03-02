import React from 'react';
import { store, TStore } from './config';

export const StoreContext = React.createContext<TStore>(store);

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('You have forgot to use StoreProvider.');
  }
  return store;
};

import test from './test';

function createStore() {
  return {
    test,
  };
}

export const store = createStore();

export type TStore = ReturnType<typeof createStore>;

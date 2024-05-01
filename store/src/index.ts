import { configureStore } from '@reduxjs/toolkit'
import reducers from "./lib/reducers";

const store = configureStore({
  reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export * from './lib/actions';
export default store;

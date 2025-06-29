import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './features/preferences/preferencesSlice';
import contentReducer from './features/content/contentSlice';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const makeStore = () => {
  return configureStore({
    reducer: {
      preferences: preferencesReducer,
      content: contentReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

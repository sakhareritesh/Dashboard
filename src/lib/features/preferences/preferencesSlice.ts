import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface PreferencesState {
  theme: Theme;
}

const initialState: PreferencesState = {
  theme: 'light',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = preferencesSlice.actions;
export default preferencesSlice.reducer;

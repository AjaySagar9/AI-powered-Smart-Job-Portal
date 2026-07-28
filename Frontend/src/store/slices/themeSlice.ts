import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Theme = 'dark' | 'light' | 'system'

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: 'dark', // default to dark for premium aesthetic
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer

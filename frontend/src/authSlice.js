import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const authSlice = createSlice({
  initialState,
  name: "auth",

  reducers: {
    login: (state) => {
      state.value = 1;
    },

    logout: (state) => {
      state.value = 0;
    },
  },
});

export const { login, logout, isLogged } = authSlice.actions;
export default authSlice.reducer;

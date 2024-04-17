import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../models/models/user.model';

interface UserState {
  user: User | null;
  token: string;
}

const initialState: UserState = {
  user: null,
  token: ""
}

export const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUserInfo: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = "";
    }
  }
});

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from'./counterSlice';
import userSlice from './user-slice';
//  import authSlice from './auth-slice';

export const store = configureStore({
  reducer: {
  counter:  counterReducer,
  user:   userSlice,
  // auth: authSlice,
  },
})


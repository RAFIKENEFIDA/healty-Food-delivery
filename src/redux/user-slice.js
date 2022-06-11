import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';


const initialState = {
  user: [],
  isAuth:false
}

export const userSlice = createSlice({
  name: 'user',
 initialState,
  reducers: {
    setUser: (state,action) => {
      state.user =action.payload;
      state.isAuth=true
    },
    logout:(state) => {
      state.isAuth=false;
      state.user=[];
    },
    setUserByToken:(state,action) => {  
      state.user =action.payload;
      state.isAuth=true
   
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser,logout,setUserByToken} = userSlice.actions;

export default userSlice.reducer
import  { useState, useEffect } from 'react';
import {
 
    useNavigate ,
  } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {setUser,setUserByToken} from '../redux/user-slice';
import React from 'react';
import axios from 'axios';


function Auth({children}) {
    
    const dispatch = useDispatch()
    let navigate = useNavigate();

      const getUser=async()=>{
                      console.log(1);


        try {

            if(localStorage.getItem("token")){

            const url="http://localhost:5000/api/user/data";
            const res=  await  axios.post(url,{token:localStorage.getItem("token")});

            if(res.status===200) {
                dispatch(setUserByToken(res.data.data[Object.keys(res.data.data)[0]]))
            }
            }
        
      } catch (error) {
          console.log(error)

      }
      }

      useEffect(()=>{
    
        getUser();
    
      },[])
      
   


      const isAuth = useSelector((state) => state.user.isAuth)

      
    // useEffect(()=>{
    
    //  if(isAuth==false) {
    //      navigate('/login/admin')
    //  }

    // },[])
    
       
  return <div>{children}</div>;
}

export default Auth;

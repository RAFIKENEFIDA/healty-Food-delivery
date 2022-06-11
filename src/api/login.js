import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import {setUser} from "../redux/user-slice"

import axios from 'axios';


 const LoginFetch = async (url,body) => {

     
    let res=  await  axios.post(url,  body );
    

    if(res.status==200){
        console.log(res.data);

    } else {
      console.log(res.data.message);
    }
    return(
        res
    )
    
              
}
export default LoginFetch;

   

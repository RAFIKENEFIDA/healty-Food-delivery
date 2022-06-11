import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import {setUser} from "../redux/user-slice"
import axios from 'axios';


const Logout = async () => {

     
    let res=  await  axios.get("http://localhost:3000/logout");
    

    if(res.status==200){
        console.log(res.data.message);

    } else {
      console.log(res.data.message);
    }
   
    return res.data
    
              
}
export default Logout;
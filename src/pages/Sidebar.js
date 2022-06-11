import React, { useState, useEffect } from 'react';
import {
    useNavigate ,
    Link,
  } from "react-router-dom";

  import { useSelector,useDispatch } from "react-redux";
  import {setUser,logout} from '../redux/user-slice';
  import logoutFromBackend from '../api/logout';
  import {admin,manager,responsableLivraison,livreur} from '../core/NavItems'
 
  
function Sidebar() {

      let navItemDashboard=[]
        const user = useSelector((state) => state.user.user)

        if(user.role=="admin"){
            navItemDashboard =admin;
        } 
        else if(user.role=="manager"){
            navItemDashboard =manager;

        }
        else if(user.role=="responsableLivraison"){
            navItemDashboard =responsableLivraison;
        }
        else if(user.role=="livreur"){
            navItemDashboard =livreur;
        }
        
       let navigate = useNavigate();
      const dispatch = useDispatch();
  return (

    <div className="px-4 py-2 container-sidebar lg:w-1/4">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline w-8 h-8 text-white lg:hidden" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="hidden lg:block">
                    <div className="my-2 mb-6">
                        <h1 className="text-2xl font-bold text-white">HeadltyFood </h1>
                    </div>
                    <ul>
                        <li className="mb-6">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                    <button type="submit" className="p-1 focus:outline-none">
                                        <svg fill="none" stroke="currentColor" stroke-linecap="round"
                                            stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                                            className="w-4 h-4">
                                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </button>
                                </span>
                                <input type="search" name="search"
                                    className="w-full px-4 py-2 pl-12 rounded shadow outline-none" placeholder="Search..." />
                            </div>
                        </li>

                     

                        {navItemDashboard.map((item,index)=>(
                            
                            <li className="mb-2 rounded hover:shadow">
                            <Link 
                                to={item.to} key={index}
                                 className="inline-block w-full h-full px-3 py-2 link-sidebar  text-white">
                                  {item.svg}
                                {item.display}
                            </Link>
                        </li>

                        ))}

                           <li className="mb-2 rounded hover:shadow  ">
                            <Link 
                                onClick={()=>{
                                    localStorage.setItem('token',"");
                                     dispatch(logout());
                                     logoutFromBackend();
                                     navigate('/login/admin');      
                                }}
                                to="/login/admin"
                                 className="inline-block w-full h-full px-3 py-2  link-sidebar   text-white">
                                  Desconnect
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
  )
}

export default Sidebar;

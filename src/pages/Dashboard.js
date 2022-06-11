import React from 'react';
import {
    
    Outlet
  } from "react-router-dom";

import Sidebar from './Sidebar';


function Dashboard() {
  return <div className="flex h-screen">

      <Sidebar />
       <Outlet />
  </div>;
}

export default Dashboard;

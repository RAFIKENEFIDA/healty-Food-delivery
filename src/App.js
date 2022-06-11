import {
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";
import  { useState, useEffect } from 'react';


import Sidebar from './pages/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from'./pages/auth/login';


// components for admin
import AdminAcceuil from './components/admin/Acceuil'
import Managers from './components/admin/Managers'
// components for manager

import AddRecette from './components/manager/recette/AddRecette';
import Recettes from './components/manager/recette/Recettes'

import Categories from './components/manager/categorie/Categories';

import Ingrediants from './components/manager/ingrediant/Ingrediants';

import './index.css'


import { useSelector,useDispatch } from "react-redux";
import {setUser,setUserByToken} from './redux/user-slice';
import Auth from './provider/Auth'



function App() {

 
  return (

    <div className="App">
      <BrowserRouter>
 <Routes>    
 
 {/* route for login */}
 <Route path="login/:acteur" element={<Login />} />  

{/* route for dashboard */}
 <Route  path="dashboard" element={<Auth><Dashboard /></Auth>}>

   {/* route for admin */}
   <Route path="admin">

   <Route index element={<Managers />} />
    <Route path="acceuil" element={<AdminAcceuil />} />
    <Route path="managers" element={<Managers />} />
    
   </Route>

   {/* route for manager */}

   <Route path="manager">

 <Route index element={<Categories />} />
 <Route path="acceuil" element={<Recettes />} />
 <Route path="recette" element={<AddRecette />} />
 <Route path="categories" element={<Categories />} />
 <Route path="ingrediants" element={<Ingrediants />} />
 
   </Route>
  


</Route>
 </Routes>
    
      </BrowserRouter>
    </div>
    
     
  );
}

export default App;

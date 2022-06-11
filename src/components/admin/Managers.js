import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  borderRadius:'5px',
  boxShadow: 24,
  p: 4,
};

function Managers() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [managers,setManagers]=useState([]);

  const fetchManagers=async()=>{

    const url="http://localhost:3000/admin/managers";
    const res=  await  axios.get(url);
    setManagers(res.data);

    };

  useEffect(()=>{
    
    fetchManagers();

  },[])

  const alertSuccess=(title)=>{

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 3000
    })
  }

 
  const AddNewManager=async(e)=>{
    e.preventDefault();
    let body={
      nom:e.target.name.value,
      prenom:e.target.prenom.value,
      email:e.target.email.value
    }
    const url="http://localhost:3000/manager/creatAcount";
    const res=  await  axios.post(url,body);
    alertSuccess(res.data.message);
    fetchManagers();
    handleClose();

  }

  
  const deleteManager=async(id)=>{

    Swal.fire({
      title: 'Are you sure to delete this manager?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {

        const url="http://localhost:3000/admin/managers/delete/"+id;
        const res=  await  axios.delete(url);
        fetchManagers();
        alertSuccess(res.data.message);
      }
    })
   
   
     
  }


  return (


    <div className="flex flex-col w-full ml-10 mt-10 ">

      {/* button add manager */}
       
       <div className=" flex  mb-10 	">
       <button class="btn " style={{backgroundColor:'#0F172A'}} type="button" onClick={handleOpen}>
      Add new mnagers   
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 ml-2 stroke-current">  
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>                        
      </svg>
         </button> 
       </div>
       {/* <!-- Main modal --> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
          {/* title of modal */}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Manager
          </Typography>

          {/* content of modal */}

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>

          {/* formik */}


          <Formik
             initialValues={{ email: '', name: '',prenom: ''}}
           
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         /* and other goodies */
       }) => (
         <form onSubmit={AddNewManager}>

           <div class="mb-6">
             <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Name</label>
             <input 
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.name} type="Name" id="name" name="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required />
            </div>

           {/* input prenom */}
                    <div class="mb-6">
             <label for="prenom" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Prenom</label>
         <input
             onChange={handleChange}
             onBlur={handleBlur}
             value={values.prenom}
              type="prenom" id="prenom" name="prenom" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Prenom" required />
            </div>

            {/* input email */}

          <div class="mb-6">
             <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Email</label>
         <input
         onChange={handleChange}
         onBlur={handleBlur}
         value={values.email}
         
         type="email" id="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
            </div>
            <button type="submit"class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Manager</button>

         </form>
       )}
          </Formik>
          </Typography>


        </Box>
      </Modal>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {managers.map((person) => (
                  <tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.nom} {person.prenom}</div>
                          <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Manager</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a  onClick={()=>{deleteManager(person._id)}}  href="#" className="text-indigo-600 hover:text-indigo-900">
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>)
}

export default Managers;

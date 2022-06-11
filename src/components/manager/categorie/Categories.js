import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {MdDelete,MdModeEdit} from "react-icons/md";
import { useSelector,useDispatch } from "react-redux";
import AddCategorie from "./AddCategorie";
import UpdateCategorie from "./UpdateCategorie";

const styleSelected = makeStyles((theme) => ({
  formControl: {
      margin: theme.spacing(1),
      minWidth: 120,

  },
  selectEmpty: {
      marginTop: theme.spacing(2),
  },
  buttonadd:{
    width:"200px",
    border:"none",
    height:"45px",
    backgroundColor:"#E6B31E",
    color:"white",
  },
  formInformation:{
      display:"flex",
      flexDirection:"column",
  },
  modalContainer:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    // bgcolor: 'background.paper',
    backgroundColor:'#ffffff',
    borderRadius:'5px',
    boxShadow: 24,
    p: 4,
  },
  buttonStandart:{
    height:"45px",
    backgroundColor:"#E6B31E",
    border:"none"
  },
}));


const columns = [
  { id: 'produit', label: 'Produit', minWidth: 130 },
  { id: 'nom', label: 'Nom', minWidth: 130 },
  { id: 'description', label: 'Description', minWidth: 130 }
];


function createData(produit, nom,description) {
  return { produit, nom,description};
}



function Categories() {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [openModel, setOpenModel] = React.useState(false);
  const [dataPassToModelUpdat, setDataPassToModelUpdat] = React.useState([]);
  const [statModel, setstatModel] = React.useState([]);
  const handleOpenModel = () =>
  {
    setOpenModel(true);  

  }
   
  const handleCloseModel = () => setOpenModel(false);

  const [open, setOpen] = React.useState(false);

  const handleOpenModelAddCategory = () =>{
    setOpen(true);
    setstatModel("add");
  } ; 
  const handleOpenModelUpdateCategory = (data) =>{
    setDataPassToModelUpdat(data);

    setOpen(true);
    setstatModel("update");

  } ; 
  const handleClose = () => setOpen(false);

  const classes=styleSelected();


  const [recettes,setRecettes]=useState([]);

  const getCategories=async()=>{


    const url="http://localhost:5000/api/categorie/getAll/62939b45762a0af0bce00c28";
    const res=  await  axios.get(url);
    
    setRecettes(res.data.categories);
    console.log(res.data.categories)

    };

  useEffect(()=>{
    // setTimeout(() => {


          getCategories();

    // }, 1500);
    

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
    getCategories();
    handleClose();

  }

  
  const deleteRecette=async(id)=>{

    Swal.fire({
      title: 'Are you sure to delete this recette?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {

        const url="http://localhost:5000/api/categorie/delete/"+id;
        const res=  await  axios.delete(url);
        getCategories();
        alertSuccess(res.data.message);
      }
    })
   
   
     
  }

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function alerteConfirmation(){
    Swal.fire({
      title: 'Are you sure?',
      text: "To delete this product!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your product has been deleted.',
          showConfirmButton: true,
          confirmButtonColor: "#E6B31E",   
  
        })
      }
    })
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  let button;
    button=  <button style={{ width:"120px",height:"35px",color:"white",backgroundColor:"#E6B31E",border:"none",borderRadius:"3px"}}>Active</button>;
    // button=  <button style={{ width:"120px",height:"35px",color:"white",backgroundColor:"#FA5B33",border:"none",borderRadius:"3px"}}>{props.status}</button>;

    let modelShow;
    if(statModel==="add"){
        modelShow=<AddCategorie handleCloseModel={handleCloseModel}/>
    }
    if(statModel==="update"){
        modelShow=<UpdateCategorie categorie={dataPassToModelUpdat} handleCloseModel={handleCloseModel}/>
    }

  return (

    <div className="flex flex-col w-full margin-25">

      {/* button add manager */}
       
       <div className=" flex  mb-10 ">

       <button className="button-standart" onClick={handleOpenModelAddCategory} >
           Ajouter un nouveaux categorie
          </button> 
        
  

       </div>
       {/* <!-- Main modal --> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.modalContainer}>
          
        {modelShow}

        </div>
      </Modal>

      {/* begin:table */}

      <div>
     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow  >
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth,backgroundColor:"#0B6365" ,color:"white"}}
                >
                  {column.label}
                </TableCell>
                
              ))} 
        
                <TableCell     
                  key={'action'}
                  align={'right'}
                  style={{ minWidth: 100,backgroundColor:"#0B6365",color:"white" }}
                >
                  {'Action'}
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recettes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} >

               <TableCell   
                  key={'status'}
                  align={'center'}
                  style={{ minWidth: '100' }}
                >
                   <img className="image" src={row.images[0]} alt="MDN" />

                </TableCell>
                <TableCell  align="130" >
                          { row["nom"]}
                </TableCell>
                <TableCell  align="130" >
                          { row["description"]}
                </TableCell>
         
                    
                    {/* partie status dans le tableau */}

              

                       {/* partie des actions dans le tableau */}
                    <TableCell   
                  key={'action'}
                  align={'right'}
                  style={{ minWidth: '200' }}
                >
                    <div style={{ display: 'flex',float: 'right' }}>
                      
                          
                   <MdModeEdit className="icon" style={{marginRight:"10px"}} onClick={()=>handleOpenModelUpdateCategory(row)}   /> 
   
                   <MdDelete  className="icon"  onClick={()=>deleteRecette(row._id)}/> 
                    </div>
                  
                     
                </TableCell>


                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3,5,10, 25, 100]}
        component="div"
        count={recettes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>


    {/* <UpdateProduct modal={openModel} desactiveModal={handleCloseModel} /> */}


    </div>

      {/* end:table */}
     
    </div>)
}

export default Categories;
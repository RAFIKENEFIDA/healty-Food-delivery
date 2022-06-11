import React, { useEffect, useRef, useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import { PrimaryBtn } from "../../PrimaryBtn";
import { motion } from "framer-motion";
import { storage } from "../../../firebase/index.js";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { CircularProgress, LinearProgress } from "@mui/material";
import TextField from '@mui/material/TextField';
import axios from 'axios';
// const dotenv = require('dotenv');
// dotenv.config();



// import { useCreateProductMutation } from "@/graphql/generated/graphql";
import swal from "sweetalert";
import { useSelector,useDispatch } from "react-redux";

const UpdateRecette = (props) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("0");
  const [progress, setProgress] = useState(0);
  const [imageAsFile, setImageAsFile] = useState(null);
  const [promoPrice, setPromoPrice] = useState("0");
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [ingrediantLoading, setIngrediantLoading] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const inputRef = useRef(null);
  const [primaryImage, setPrimaryImage] = useState(0);
  const [readProgress, setReadProgress] = useState(0);
  const [priceProgress, setPriceProgress] = useState(0);
  const [nameProgress, setNameProgress] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState(0);
  const [category, setCategory] = useState("");
  const [Allcategory, setAllCategory] = useState([]);
  const [descriptionProgress, setDescriptionProgress] = useState(0);
  const [imagesProgress, setImagesProgress] = useState(0);
  const [stock, setStock] = useState("0");
  const [stockProgress, setStockProgress] = useState(0);
  const [editorState, setEditorState] = useState();
  const [ingrediants,setIngrediants]= useState([]);
  const [ingrediant,setIngrediant]= useState("");
  const [ingrediantsSelected,setIngrediantsSelected]=useState([]);
  const [ingrediantAndQuantite,setIngrediantAndQuantite]=useState([]);
  const [quantiteIngrediant,setQuantiteIngrediant]=useState([]);


  useEffect(() => {
      
      const getAllCategory =async ()=>{       
        let res=await axios.get(`http://localhost:5000/api/categorie/getAll`);
       setAllCategory(res.data.categories);
      }

      const getAllIngrdiants=async ()=>{       
        let res=await axios.get(`http://localhost:5000/api/ingrediant/getAll`);
        setIngrediants(res.data.ingrediant);
      }
      getAllCategory();
      getAllIngrdiants();

      setSliderImages(props.recettes.images);
      setProductName(props.recettes.nom)    ;
      setCategory(props.recettes.categorieId.nom);
      setEditorState(props.recettes.description);
      setPrice(props.recettes.prix);
      setIngrediantsSelected(props.recettes.ingredients)
      


      },[]);
  const handleFireBaseUpload = () => {
    console.log(imageAsFile);
    setImageIsLoading(true);

    if (!imageAsFile) {
      return alert("Please select an image");
    } else {
      // @ts-ignore
      const storageRef = ref(storage, `/files/${imageAsFile?.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageAsFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            setSliderImages([...sliderImages, url]);
            setTimeout(() => {
              setImageIsLoading(false);
            }, 1200);
          });
        }
      );
    }
  };

  const handleRemoveImage = (index) => {
    setSliderImages((sliderImages) => {
      return sliderImages.filter((_, i) => i !== index);
    });
  };

  const handleChange = async (e) => {
    // @ts-ignore
    if (e?.target?.files[0]) {
      // @ts-ignore
      const image = e?.target?.files[0];
      setImageAsFile((imageFile) => image);
    }
  };

  useEffect(() => {
    if (imageAsFile) {
      handleFireBaseUpload();
      setImageAsFile(null);
    }
  }, [imageAsFile]);

  useEffect(() => {


    if (sliderImages.length !== 0 && sliderImages.length > 2) {
      setImagesProgress(20);
    } else if (sliderImages.length === 0) {
      setImagesProgress(0);
    } else if (sliderImages.length > 3) {
      setImagesProgress(60);
    }
  }, [price, productName, sliderImages, category, stock]);

  useEffect(() => {
    setReadProgress(
      priceProgress +
        nameProgress +
        stockProgress +
        imagesProgress +
        categoryProgress
    );
  }, [
    priceProgress,
    nameProgress,
    imagesProgress,
    categoryProgress,
    stockProgress,
  ]);




  const AddIngrediant= ()=>{

    setIngrediantLoading(true);
  
    // set setIngrediantsSelected
  
    const container=ingrediantsSelected;
    const addQuantite=[];
     addQuantite.ingredient=ingrediants.find(ing=>ing.nom===ingrediant);
    addQuantite.quantite=quantiteIngrediant;
    container.push(addQuantite);
    setTimeout(() => {
      setIngrediantLoading(false);
    }, 1200);
    setIngrediantsSelected((ingrediantsSelected)=>container);
    // set setIngrediantAndQuantite 
  
    const arrayOfIngredientAndQuantite=ingrediantAndQuantite;
    arrayOfIngredientAndQuantite.push({ingredient:ingrediants.find(ing=>ing.nom===ingrediant)._id,
                                         quantite:quantiteIngrediant});
             setIngrediantAndQuantite((ingrediantAndQuantite)=>arrayOfIngredientAndQuantite) ;
                                    
         setQuantiteIngrediant("");
         setIngrediant("");
                                    
    
    };
    const handleRemoveIngrediants=(index)=>{

      setIngrediantsSelected((ingrediantsSelected) => {
        return ingrediantsSelected.filter((_, i) => i !== index);
      });
    }


  const user = useSelector((state) => state.user.user._id);


  const handleCreateProduct = async () => {



    const inputs = JSON.stringify({
      nom: productName,
      prix: price,
      description: editorState,
      images: sliderImages,
      managerId:user,
      energie:200,
      categorie:category,
      ingredients:ingrediantAndQuantite,


    });

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: inputs,
    };
    const reponse = await fetch(
      "http://localhost:5000/api/recette/update/" + props.recettes._id,
      requestOptions
    );
    const data = await reponse.json();
    if (reponse.status === 200) {
      swal({
        title: "Product was updated successfully!",
        text: "",
        icon: "success",
        button: "Ok",
      });
    }
  };

  return (
    <div className="p-8 relative">
      {/* {createProductLoading && (
        <div className="fixed z-50 top-0 left-0 flex justify-center items-center w-screen bg-white bg-opacity-50 h-screen">
          <CircularProgress size={300} thickness={2} />
        </div>
      )} */}
      <h1 className="text-2xl font-black">Modifier le produit</h1>
      <div className="w-full mt-5 flex gap-6">
        <div className="w-3/4">
          <div className="w-full">
            <label
              htmlFor="nameProduct"
              className="block text-gray-700 text-2xl font-bold mb-3"
            >
              Nom du Produit
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="nameProduct"
              placeholder="Product Name "
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="nameProduct"
              className="block text-gray-700 text-2xl font-bold mb-3"

            >
              Category du produit
            </label>
            <select 
              onChange={(e) => setCategory(e.target.value)}
              style={{color:'black'}}
              value={category}
 id="car" > 
 {
  Allcategory.map((item,index)=>(
   
      <option value={item.nom}>{item.nom}</option>
    
  ))
 }

</select>
          </div>
          <label className="block text-gray-700 text-2xl font-bold my-3 mt-5">
            Detail du produits
          </label>
          <div className="bg-white mt-5 p-3 rounded-sm">
            {/* @ts-ignore */}
            <textarea placeholder="Remember, be nice!"
                value= {editorState}
                style={{color:'black'}}

                 
                          onChange={(e) => setEditorState(e.target.value)}
             cols="30" rows="5">
                 {editorState}
             </textarea>

          </div>

                    {/* begin ingrediants */}

                    <div className="w-full flex flex-col items-start justify-between ">
            <label className="block text-gray-700 text-2xl font-bold my-3 mt-5">
              Les ingrediants du recette
            </label>

           <div className="flex flex-col items-start ">
            <div >
             <label for="ingrediants_list">Choisir un ingrediant:</label>

             <input type="text" value={ingrediant}  list="ingrediants_list" name="ingrediants_list" onChange={(e) => setIngrediant(e.target.value)}          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <datalist id="ingrediants_list"  >
          {  
              ingrediants.map((item,index)=>{
                return  <option key={index} value={item.nom} >{item.nom}</option>;
              })
          }
         </datalist>
         </div>
         <div>

         <label
                htmlFor="quantite"
                className="block text-gray-700 text-xl font-bold my-2"
              >
                Qauntité en grammes
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
                type="number"
                id="quantite"
                placeholder="Qauntité de l'ingrediant"
                value={quantiteIngrediant}
                min={0}
                onChange={(e) => setQuantiteIngrediant(e.target.value)}
              />
        

         </div>

           </div>

           <button
              className="button-standart"
              onClick={() => AddIngrediant()}
            >
              Ajouter l'ingrediant
            </button>


            <div className="bg-white relative flex gap-3 mt-5 p-3 rounded-sm">
            {ingrediantLoading && (
              <div className="absolute w-full h-full flex top-0 left-0 bg-white bg-opacity-50 justify-center items-center">
                <CircularProgress />
              </div>
            )}
            {ingrediantsSelected.map((_, i) => (
              <div
                key={i}
                className="w-44 flex flex-col gap-4 justify-center items-center"
              >
                <div
                  onClick={() => setPrimaryImage(i)}
                  className={`p-16 rounded bg-slate-300 cursor-pointer border-green-600  border-solid ${
                    i === primaryImage ? "border-4" : ""
                  }`}
                  style={{
                    backgroundImage: `url(${_.ingredient.images[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div>
                  {_.ingredient.nom}
                </div>
                <div>
                  {_.quantite} Grammes
                </div>

                <div className="w-full flex justify-center items-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="button-standart"
                    onClick={() => handleRemoveIngrediants(i)}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
          </div>
          {/* end ingrediants */}





          <label
            htmlFor="nameProduct"
            className="block text-gray-700 text-2xl font-bold my-3 mt-5"
          >
            Prix du Produit
          </label>
          <div className="bg-white mt-5 p-3 flex justify-between gap-3 rounded-sm">
            <div className="w-1/2">
              <label
                htmlFor="namePrice"
                className="block text-gray-700 text-xl font-bold my-2"
              >
                Prix
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                id="namePrice"
                placeholder="Product Price"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full flex justify-between items-end">
            <label className="block text-gray-700 text-2xl font-bold my-3 mt-5">
              Les images du produit
            </label>
            <PrimaryBtn
              onClick={() => inputRef.current?.click()}
              className="px-5 bg-green-500 text-white hover:text-white hover:bg-green-900 "
            >
              Ajouter des images
            </PrimaryBtn>
            <input
              id="file-upload"
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
          <div className="bg-white relative flex gap-3 mt-5 p-3 rounded-sm">
            {imageIsLoading && (
              <div className="absolute w-full h-full flex top-0 left-0 bg-white bg-opacity-50 justify-center items-center">
                <CircularProgress />
              </div>
            )}
            {sliderImages.map((_, i) => (
              <div
                key={i}
                className="w-44 flex flex-col gap-4 justify-center items-center"
              >
                <div
                  onClick={() => setPrimaryImage(i)}
                  className={`p-16 rounded bg-slate-300 cursor-pointer border-green-600  border-solid ${
                    i === primaryImage ? "border-4" : ""
                  }`}
                  style={{
                    backgroundImage: `url(${_})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="w-full flex justify-center items-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            ))}
            {sliderImages.length === 0 && (
              <div className="text-3xl text-center w-full p-20">
                Ajouter des images
              </div>
            )}
          </div>
        </div>
        <div className="w-1/4">
          <div className="fixed top-10 right-10">
            <h3 className="text-2xl  font-bold mb-3">Product preview</h3>
            <div className="w-full p-4 bg-white rounded">
              <div className="w-full">
                <div
                  style={{
                    backgroundImage: `url(${sliderImages[primaryImage]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="w-64 h-64 rounded flex justify-center items-center bg-slate-100"
                >
                  {sliderImages.length === 0 && (
                    <InventoryIcon
                      className="text-purple-600"
                      sx={{
                        fontSize: "5rem",
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="nameProduct" className="text-xl my-2">
                    {productName}
                  </label>
                  <span>${price}</span>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end mt-5">
              <PrimaryBtn
                onClick={() => {
                  handleCreateProduct();
                }}
                className="w-24  bg-green-700 text-white hover:text-white hover:bg-green-900 "
              >
                Enregister
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRecette;

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
  const [energie, setEnergie] = useState();

  useEffect(() => {
      
      setSliderImages(props.ingrediant.images);
      setProductName(props.ingrediant.nom)    ;
      setEditorState(props.ingrediant.description);
      setEnergie(props.ingrediant.energie);
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




  const user = useSelector((state) => state.user.user._id);


  const handleCreateProduct = async () => {



    const inputs = JSON.stringify({
      nom: productName,
      description: editorState,
      images: sliderImages,
      managerId:user,
      energie:energie,
    

    });

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: inputs,
    };
    const reponse = await fetch(
      "http://localhost:5000/api/ingrediant/update/" + props.ingrediant._id,
      requestOptions
    );
    const data = await reponse.json();
    if (reponse.status === 200) {
      swal({
        title: "Ingrediant was updated successfully!",
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
      <h1 className="text-2xl font-black">Modifier l'ingrediant</h1>
      <div className="w-full mt-5 flex gap-6">
        <div className="w-3/4">
          <div className="w-full">
            <label
              htmlFor="nameProduct"
              className="block text-gray-700 text-2xl font-bold mb-3"
            >
              Nom de l'ingrediant
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="nameProduct"
              placeholder="Ingrediant Name "
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
         
          <label className="block text-gray-700 text-2xl font-bold my-3 mt-5">
            Detail de l'ingrediant'
          </label>
          <div className="bg-white mt-5 p-3 rounded-sm">
            {/* @ts-ignore */}
            <textarea placeholder="Details"
                value= {editorState}
                style={{color:'black'}}

                 
                          onChange={(e) => setEditorState(e.target.value)}
             cols="30" rows="5">
                 {editorState}
             </textarea>

          </div>

          <label
            htmlFor="nameProduct"
            className="block text-gray-700 text-2xl font-bold my-3 mt-5"
          >
             Energie de l'ingrediant pour chaque 100 gramme
          </label>
          <div className="bg-white mt-5 p-3 flex justify-between gap-3 rounded-sm">
            <div className="w-1/2">
              <label
                htmlFor="namePrice"
                className="block text-gray-700 text-xl font-bold my-2"
              >
                Energie
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                value={energie}
                id="namePrice"
                placeholder="Ingrediant Energie "
                min={0}
                onChange={(e) => setEnergie(e.target.value)}
              />
            </div>
          </div>
      
          <div className="w-full flex justify-between items-end">
            <label className="block text-gray-700 text-2xl font-bold my-3 mt-5">
              Les images du categorie
            </label>
            <button
              onClick={() => inputRef.current?.click()}
              className="button-standart"            >
              Ajouter des images
            </button>
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
    
              </div>
            </div>

            <div className="w-full flex justify-end mt-5">
              <button
                onClick={() => {
                  handleCreateProduct();
                }}
                className="button-standart"
              >
                Enregister
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateRecette;

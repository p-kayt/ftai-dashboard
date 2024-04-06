import React from "react";
import { imgDb } from "api/firebaseConfig";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Button } from "@mui/material";

const ImageUpload = ({ onUpload }) => {
  const [img, setImg] = useState();

  const handleUpload = async () => {
    if (!img) return;
    const imageName = img.name; // get the name of the image without extension
    let imgRef = ref(imgDb, "ProductImg/" + imageName); // use the image name as the file name
    // Upload the image
    uploadBytes(imgRef, img).then(() => {
      getDownloadURL(imgRef).then((downloadURL) => {
        onUpload({
          url: downloadURL,
          name: imageName
        });
        // console.log(`File available at ${downloadURL}`);
      });
    });
  };

  return (
    <div style={{ margin: "10px" }}>
      <Button
        variant="outlined"
        component="label"
        style={{
          padding: "6px 12px",
          cursor: "pointer",
          borderRadius: "4px",
          marginRight: "8px",
          backgroundColor: "#f8f8f8"
        }}
      >
        Choose File
        <input type="file" id="image" hidden onChange={(e) => setImg(e.target.files[0])} />
      </Button>
      <Button
        variant="contained"
        color="primary"
        // style={{
        //   padding: "10px 20px",
        //   fontSize: "16px",
        //   margin: "4px 2px",
        //   borderRadius: "4px"
        // }}
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;

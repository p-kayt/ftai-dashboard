// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDpAYYvlIcn5lQj5XbzwBZI1tFUn_1Ts1o",
//   authDomain: "products-image.firebaseapp.com",
//   projectId: "products-image",
//   storageBucket: "products-image.appspot.com",
//   messagingSenderId: "1057397225099",
//   appId: "1:1057397225099:web:21d336e899bae2e3e4c68e"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi0XyLbQmHzvxCVaddl1ltBIGzB5FyR9M",
  authDomain: "fsvton-18ce5.firebaseapp.com",
  databaseURL: "https://fsvton-18ce5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fsvton-18ce5",
  storageBucket: "fsvton-18ce5.appspot.com",
  messagingSenderId: "225303706605",
  appId: "1:225303706605:web:47239f1ef4436dad61c5e4",
  measurementId: "G-XET61NGKMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imgDb = getStorage(app);

export const imageWithUrl = async ({ url }) => {
  //   console.log(url);
  const storage = getStorage();
  const imageRef = ref(storage, "ProductImg/"); // reference to the root of your storage

  // List all files in the bucket
  const res = await listAll(imageRef);

  // Iterate over each item
  for (let item of res.items) {
    let downloadURL = await getDownloadURL(item);
    // console.log(downloadURL);
    // If the URL matches, return the image name and URL
    if (downloadURL === url) {
      return {
        name: item.name,
        url: downloadURL
      };
    }
  }

  // If no matching URL is found, throw an error
  throw new Error("No image found with the specified URL");
};

export const db = getFirestore(app);

export const roomRef = collection(db, "rooms");

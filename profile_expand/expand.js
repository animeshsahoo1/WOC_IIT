import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js'
import{getFirestore
  ,doc,getDoc, updateDoc, arrayUnion
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyA8a9zqqopk6mQ-ZeCaEz1In35USNDssG0",
    authDomain: "woc-iit.firebaseapp.com",
    projectId: "woc-iit",
    storageBucket: "woc-iit.firebasestorage.app",
    messagingSenderId: "786173271871",
    appId: "1:786173271871:web:e302fbdc53f6d267c8bd8a"
  };

//initialize firebase app
initializeApp(firebaseConfig);
//init services
const db= getFirestore();


const loggedUserId = localStorage.getItem('loggedUserId');
//get its profile image public id from its data
if (loggedUserId) {
    // Reference the user's document in Firestore
    const userDocRef = doc(db, "users", loggedUserId);

    // get the document
    getDoc(userDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const publicId = userData.profilePic; 
                const email=userData.email;
                const country=userData.country;
                const name=userData.name;
                console.log("Public ID:", publicId);
                const profilePic = document.querySelectorAll(".profile-img");//get that element where u r shoeing profiel
                const emailContainer=document.getElementById("email");
                const countryContainer=document.getElementById("country");
                const nameContainer=document.getElementById("name");

                // Construct the Cloudinary URL to display the image
                const cloudinaryUrl = `https://res.cloudinary.com/dpjzdmxmb/image/upload/${publicId}`;
                
                // Set the image source to the Cloudinary URL
                profilePic.forEach((item)=>{
                    item.src = cloudinaryUrl;
                })
                emailContainer.textContent=`Email: ${email}`;
                countryContainer.textContent=`Country: ${country}`;
                nameContainer.textContent=`Name: ${name.toUpperCase()}`;
                // Use the public ID as needed
            } else {
                console.error("No document found for the logged user.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
} else {
    console.error("No logged user found in localStorage.");
}
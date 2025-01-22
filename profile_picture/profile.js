import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js'
import{getFirestore
  ,setDoc,doc,updateDoc,arrayUnion
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



let profilePic = document.getElementById('profile-pic');
let inputFile = document.getElementById('input-file');
let name=document.getElementById('show-name');

inputFile.onchange= ()=>{
    profilePic.src=URL.createObjectURL(inputFile.files[0])
}

const api_key = 'dpjzdmxmb'
const cloud_name = '851773131335386'

const uploadForm = document.getElementById('uploadForm');
const CLOUDINARY_URL="https://api.cloudinary.com/v1_1/dpjzdmxmb/image/upload";
const UPLOAD_PRESET="ml_default";


function showMessage(message, divId){
    var messageDiv= document.getElementById(divId);
    console.log(messageDiv);
    messageDiv.style.display='block';//initially display is set to none in html by inline css and opacity is 0 in css
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
      messageDiv.style.opacity=0;
    },5000)
  }

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const file = inputFile.files[0]; // Get the selected file
    if (file) {
        const formData = new FormData();//create a new key and value pairs data object
        formData.append("file", file); 
        formData.append("upload_preset", UPLOAD_PRESET); 

        try {
            // Upload the file to Cloudinary
            //The Fetch API interface allows web browser to make HTTP requests to web servers(cloudinary server) and reciev http response.
            const response = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload the image.");
            }

            const data = await response.json(); // Parse the JSON response from Cloudinary
            console.log("Uploaded image details:", data);
            const publicId = data.public_id;
//---------------------------------------------------------------------------------------------
            const loggedUserId = localStorage.getItem("loggedUserId"); // Retrieve logged-in user ID
            const userDocRef=doc(db,"users",loggedUserId);
            await updateDoc(userDocRef, {
                profilePic: publicId, // Append the public_id to an array havin data of user so that we can use this later
            });


            // Store the public_id of the uploaded image in localStorage
            localStorage.setItem("uploaded_image_public_id", publicId);
            console.log("Stored public_id in localStorage:", publicId);
            showMessage('Profile picture has been set, redirecting...','profileSetMessage');
            setTimeout(()=>{
                window.location.href="../main_page/main.html";
                }, 2000);
                
       
        } catch (error) {
            console.error("Error during image upload:", error);
        }
        
     
    }
});
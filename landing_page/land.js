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

const header =document.querySelector("header");
const navbarItems =document.querySelectorAll(".navlist a");
window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", window.scrollY > 50);
    navbarItems.forEach((item)=>{
      item.classList.toggle("scroll-active", window.scrollY > 50)
    });
})

const words = document.querySelectorAll(".navlist a");



/*----------------------JS for authentication form-------------------------- */

const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');
const closeButtons = document.querySelectorAll('.close');
const authDiv = document.querySelector('.auth');
const LandingLog=document.querySelector('.nav-icons .btn');
const mainBtn=document.getElementById('big-register-btn');
const profilePic=document.querySelector(".profile");


signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})

const loggedUserId = localStorage.getItem('loggedUserId');
//get its profile image public id from its data
if (loggedUserId) {
  profilePic.style.display='flex';
  LandingLog.style.display='none';
  mainBtn.addEventListener('click', ()=>{
    window.location.href='../main_page/main.html'
  })
    // Reference the user's document in Firestore
    const userDocRef = doc(db, "users", loggedUserId);

    // get the document
    getDoc(userDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                const publicId = userData.profilePic; 
                console.log("Public ID:", publicId);
                const profilePic = document.querySelector(".profile-img");//get that element where u r shoeing profiel

                // Construct the Cloudinary URL to display the image
                const cloudinaryUrl = `https://res.cloudinary.com/dpjzdmxmb/image/upload/${publicId}`;
                
                // Set the image source to the Cloudinary URL
                profilePic.src = cloudinaryUrl;

                // Use the public ID as needed
            } else {
                console.error("No document found for the logged user.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
} else {
  profilePic.style.display='none';
    console.log("No logged user found in localStorage.");
    function showAuth() {
      authDiv.style.display = 'flex'; // Ensure it uses 'flex' to match your layout
    }
    
    
    function hideAuth() {
      authDiv.style.display = 'none';
    }
    LandingLog.addEventListener('click', ()=>{
      showAuth();
    })
    mainBtn.addEventListener('click', ()=>{
      showAuth();
    })
    closeButtons.forEach((button) => {
        button.addEventListener('click', function () {
            hideAuth();
        });
    });
}

profilePic.addEventListener('click', ()=>{
    window.location.href="../profile_expand/expand.html"
})
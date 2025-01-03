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
    //copy user id on clink
    const CopyId=document.querySelector('.user-btn');
    CopyId.innerHTML=loggedUserId;

    CopyId.addEventListener('click', ()=>{
        navigator.clipboard.writeText(loggedUserId);
        alert('Copied userid to clipboard')
    })
    let maxRating;
    let maxWPM;
    let maxAccuracy;
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
                const wpmContainer=document.getElementById("WPM");
                const accuracyContainer=document.getElementById("ACCURACY");
                const ratingContainer=document.getElementById("RATING");


                maxRating= userData.typingHistory.reduce((max, item) => {
                    var ans=item.rating > max ? item.rating : max;
                    return ans;
                }, -Infinity);
                maxWPM= userData.typingHistory.reduce((max, item) => {
                    var ans=item.wpm > max ? item.wpm : max;
                    return ans;
                }, -Infinity);
                maxAccuracy= userData.typingHistory.reduce((max, item) => {
                    var ans=item.accuracy > max ? item.accuracy : max;
                    return ans;
                }, -Infinity);

                // Construct the Cloudinary URL to display the image
                const cloudinaryUrl = `https://res.cloudinary.com/dpjzdmxmb/image/upload/${publicId}`;
                
                // Set the image source to the Cloudinary URL
                profilePic.forEach((item)=>{
                    item.src = cloudinaryUrl;
                })

                emailContainer.textContent=`Email: ${email}`;
                countryContainer.textContent=`Country: ${country}`;
                nameContainer.textContent=`Name: ${name.toUpperCase()}`;
                ratingContainer.textContent=`Max Rating: ${maxRating}`;
                accuracyContainer.textContent=`Max Accuracy: ${maxAccuracy}`;
                wpmContainer.textContent=`Max WPM: ${maxWPM}`;
                // Use the public ID as needed

                //--------------------------badges------------------------//
                if(maxWPM>=75){
                    showBadge("75wpm");
                    showBadge('50wpm');
                    showBadge('35wpm');
                }
                if(maxWPM>=50){
                    showBadge('50wpm');
                    showBadge('35wpm');
                }
                if(maxWPM>=35){
                    showBadge('35wpm');
                }
                if(maxAccuracy=100){
                    showBadge('full-accuracy')
                }
                // Retrieve the top5 array from localStorage
                const storedArray = JSON.parse(localStorage.getItem('topUserRatings'));

                if (storedArray) {
                // Use the find method
                const result = storedArray.find((ratings)=>{
                    if(ratings===maxRating){
                        return true;
                    }
                    else{
                        return false;
                    }
                });
                if(result){
                    showBadge('top3');
                }
                } else {
                console.error('Array not found in localStorage');
                }

                //-------------------------end of badges-------------------//
                
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


function showBadge(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'flex';
    } else {
        console.error(`Element with id "${elementId}" not found.`);
    }
}


// ---------------------------------------log out btn--------------------------------------------

const logOut=document.querySelector('.red-box');

logOut.addEventListener('click',()=>{
    const loggedId=localStorage.getItem('loggedUserId');
    if(loggedId){
        localStorage.removeItem('loggedUserId');
        window.location.href='../landing_page/land.html';
    }
})

const profilePic=document.querySelector('.main-profile');
profilePic.addEventListener('click',()=>{
    window.location.href='../profile_picture/profile.html';
})
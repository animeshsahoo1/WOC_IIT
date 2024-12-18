import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js'
import{getFirestore
  ,doc,getDoc, getDocs,collection
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


/*----------------------------------------set the profile picture------------------------------------------- */
//get the userid of the users
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
    console.error("No logged user found in localStorage.");
}

const colref= collection(db,'users');

async function getAllUserRatings() {
    try {
        const Snapshot = await getDocs(colref); 
        const userRatings = [];

        Snapshot.forEach((doc) => {
            const userData = doc.data();

            // Check if userRatings is already in the container cause if it is you dont want to add them again
            if (!userRatings.find((item) => item.userId === doc.id)) {
                // get maxRating for this user's typing history
                const maxRating = userData.typingHistory.reduce((max, item) => {
                    var ans=item.rating > max ? item.rating : max;
                    return ans;
                }, -Infinity);

                // Push the user data in arrau
                userRatings.push({
                    userId: doc.id,
                    name: userData.name,
                    rating: maxRating,
                });
            }
        });

        return userRatings;
    } catch (error) {
        console.error('Error fetching user ratings: ', error);
    }
}


async function displayLeaderboard() {
    const userRatings = await getAllUserRatings();

    // Sort ratings in descending order
    const sortedRatings = userRatings.sort((a, b) => b.rating - a.rating);
    
    // Display top 5 ratings 
    const leaderboardContainer = document.querySelector('.leaderboard');
    leaderboardContainer.innerHTML = ''; // Clear previous leaderboard

    sortedRatings.slice(0, 5).forEach((rating, index) => {
        const leaderboardItem = document.createElement('div');
        const text= document.createElement('div');
        leaderboardItem.classList.add('leaderboard-element');
        text.classList.add('text');
        text.innerHTML = `
        <p class="rank">${index + 1}</p>
        <p class="name"> ${rating.name}</p>
        <p class="rating"> ${rating.rating}</p>
        `;
        leaderboardItem.appendChild(text);
        leaderboardContainer.appendChild(leaderboardItem);
    });
}



async function displayHistory() {
    if (loggedUserId) {
        // Reference the user's document in Firestore
        const userDocRef = doc(db, "users", loggedUserId);
        const history = [];

        try {
            const docSnapshot = await getDoc(userDocRef);//getdoc returns a promise
            const userData = docSnapshot.data();

            userData.typingHistory.forEach((item) => {
                history.push({
                    timestamp: new Date(item.timestamp).toLocaleDateString(),
                    WPM: item.wpm,
                    accuracy: item.accuracy,
                });
            });
        } catch (err) {
            console.error("Error getting data:", err);
            return; // Exit function on error
        }

        // Sort history in descending order of timestamp
        const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Render top 5 results in the history container
        const historyContainer = document.querySelector('.history');
        historyContainer.innerHTML = ''; // Clear previous history

        sortedHistory.slice(0, 4).forEach((item) => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-element');
            historyItem.innerHTML = `
                <div class="text">
                    <p class="wpm">WPM: ${item.WPM}</p>
                    <p class="accuracy">Accuracy: ${item.accuracy}%</p>
                    <p class="date">Date: ${item.timestamp}</p>
                </div>
            `;
            historyContainer.appendChild(historyItem);
        });
    } else {
        console.error("No logged user found in localStorage.");
    }
}

window.onload = () => {
    displayLeaderboard();
    displayHistory();
};


/*---------------------------------------------------show more---------------------------------------------------- */
const closeButton=document.querySelectorAll('.close');
const expandHistory=document.querySelector('.pop-history');
const expandLeaderboard=document.querySelector('.pop-leaderboard');
const showMoreHistory=document.getElementById('show-more-history');
const showMoreBoard=document.getElementById('show-more-board');
closeButton.forEach((item)=>{
    item.addEventListener('click',()=>{
        expandHistory.classList.add('hidden');
        expandLeaderboard.classList.add('hidden');
    })
})
showMoreHistory.addEventListener('click',()=>{
    expandHistory.classList.remove('hidden');
    displayFullHistory();
})
showMoreBoard.addEventListener('click',()=>{
    expandLeaderboard.classList.remove('hidden');
    displayFullLeaderboard();
})




async function displayFullHistory() {
    if (loggedUserId) {
        // Reference the user's document in Firestore
        const userDocRef = doc(db, "users", loggedUserId);
        const history = [];

        try {
            const docSnapshot = await getDoc(userDocRef);//getdoc returns a promise
            const userData = docSnapshot.data();

            userData.typingHistory.forEach((item) => {
                history.push({
                    timestamp: new Date(item.timestamp).toLocaleDateString(),
                    WPM: item.wpm,
                    accuracy: item.accuracy,
                    rating: item.rating,
                });
            });
        } catch (err) {
            console.error("Error getting data:", err);
            return; // Exit function on error
        }

        // Sort history in descending order of timestamp
        const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Render top 5 results in the history container
        const FullhistoryContainer = document.querySelector('.full-history');
        FullhistoryContainer.innerHTML = ''; // Clear previous history

        sortedHistory.forEach((item) => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-element');
            historyItem.innerHTML = `
                <div class="text">
                    <p class="wpm">WPM: ${item.WPM}</p>
                    <p class="accuracy">Accuracy: ${item.accuracy}%</p>
                    <p class="rating">Rating: ${item.rating}</p>
                    <p class="date">Date: ${item.timestamp}</p>
                </div>
            `;
            FullhistoryContainer.appendChild(historyItem);
        });
    } else {
        console.error("No logged user found in localStorage.");
    }
}

async function displayFullLeaderboard() {
    const userRatings = await getAllUserRatings();

    // Sort ratings in descending order
    const sortedRatings = userRatings.sort((a, b) => b.rating - a.rating);
    
    // Display top 5 ratings 
    const FullLeaderboardContainer = document.querySelector('.full-leaderboard');
    FullLeaderboardContainer.innerHTML = ''; // Clear previous leaderboard

    sortedRatings.forEach((rating, index) => {
        const leaderboardItem = document.createElement('div');
       
        leaderboardItem.classList.add('leaderboard-element');
        leaderboardItem.innerHTML=`
        <div class="leaderboard-element">
                    <div class="text">
                        <p class="rank"> ${index + 1} </p>
                        <p class="name"> ${rating.name}</p>
                        <p class="rating"> ${rating.rating} </p>
                    </div>
                </div>
        `;
        FullLeaderboardContainer.appendChild(leaderboardItem);
    });
}
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



/*-----------------------------------------Timer------------------------------------------------*/
var elapsed = 0; // Declare elapsed globally

function startCircleTimer(durationInSeconds) {
    const progressCircle = document.querySelector('.timer-circle-progress');
    const timerNumber = document.getElementById('timerNumber');

    const radius = 50; // Radius of the SVG circle
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    // The gap is also set to the circumference, effectively "hiding" the second dash (because the gap is so long it doesn't repeat).
    
    progressCircle.style.strokeDashoffset = 0; // Start fully filled

    let startTime = null;

    function updateTimer(timestamp) {
        if (!startTime) startTime = timestamp;

        elapsed = (timestamp - startTime) / 1000; // Update global elapsed variable
        const remainingTime = Math.max(durationInSeconds - elapsed, 0);
        if(remainingTime<=10){
            progressCircle.style.stroke='#ff0000';
            progressCircle.classList.add('danger');
        }
        const progress = remainingTime / durationInSeconds;

        // Update the circle progress
        const offset = circumference * (1 - progress);
        progressCircle.style.strokeDashoffset = offset;

        // Update the countdown number
        timerNumber.textContent = Math.ceil(remainingTime);

        if (remainingTime > 0) {
            requestAnimationFrame(updateTimer);
        } else {
            handleEnd(); // Endtest when time runs out
        }
    }

    requestAnimationFrame(updateTimer);//requestanimationframe provide the input timestamp for updateTimer
}

/*-----------------------------------Select options------------------------------------------------- */

// Declare a variable to store the selected time globally
let selectedTime = 60; // Default time
document.getElementById('start-test').addEventListener('click', () => {
    // Get the selected values
    const difficulty = document.getElementById('difficulty').value;
    selectedTime = parseInt(document.getElementById('time').value, 10);  // Store selected time here
    const timeText = document.getElementById('timerNumber');
    
    // Do something with the selected values
    console.log(`Selected Difficulty: ${difficulty}`);
    timeText.innerHTML = `${selectedTime}`; // Display the selected time
    
    // You can now use these values as needed
    alert(`You chose ${difficulty} difficulty and ${selectedTime} seconds!`);
});

/*-----------------------------------Typing part------------------------------------------------- */

let textContainer = document.getElementById('typing-paragraph');
let resultsContainer = document.getElementById('results');
let wpmText = document.getElementById('wpm');
let cpmText = document.getElementById('cpm');
let accuracyText = document.getElementById('accuracy');
let correctChars = 0; // To track the number of correctly typed characters



const invalidKeys = 'F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 Escape Tab CapsLock Shift Control Alt Meta ArrowLeft ArrowRight ArrowDown ArrowUp Enter'.split(
    ' ',
);

const text = 'i hope your day is going well thanks for trying out my typing test did you know that this project was actually made for hackclub, hackclub is a worldwide, student led coding club for teens that strives to provide a comfortable and educational place to collaborate with others!';
const textArr = text.split('');
const htmlArr = textArr.map((item, index, array) => {
    if (item === ' ') {
        return `<span class="space" id="span${index}">${item}</span>`;
    }
    return `<span class="char" id="span${index}">${item}</span>`;
});
textContainer.innerHTML = htmlArr.join('');
let errors = [];
let firstTime = true;
let currentPos = 0;

// Create the cursor element
let cursor = document.createElement("span");
cursor.id = "cursor";
cursor.textContent = "|";

// Insert the cursor at the start of the text container
textContainer.insertBefore(cursor, textContainer.firstChild);


document.addEventListener('keydown', event => {
    if (event.key === ' ') {
        event.preventDefault();
    }
    if (firstTime && !invalidKeys.includes(event.key)) {
        if(selectedTime===60){
            startCircleTimer(60); // Start the timer when the first key is pressed
        }
        else if(selectedTime===30){
            startCircleTimer(30); 
        }
        else{
            startCircleTimer(120); 
        }
        firstTime = false;
        
    }

    if (event.location === 0 && !invalidKeys.includes(event.key)) {
        handleKey(event); // Pass the whole event object to handleKey
    }
});
let backspaceRequired=false;
function handleKey(event) {
    let span = document.getElementById(`span${currentPos}`).style;
    if(backspaceRequired===false){
        if (event.key !== 'Backspace'){
            if (event.key === textArr[currentPos]) {
                span.color = 'green'; // Correct key, turn green
                currentPos++;
                correctChars++;//increment correct char
                textContainer.style.marginLeft = `${40 - currentPos*1.2}%`;/*decrease left marging of the typing paragraph so that more part of 
                the text is being shown for every character decrease margin by 1%*/
            }
            else {
                errors.push(event.key);
                if (textArr[currentPos] === ' ') {
                    span.backgroundColor = 'red'; // Incorrect space, red background
                } 
                else {
                    span.color = 'red'; // Incorrect character, red color
                }
                currentPos++;
                errors.push(textArr[currentPos]);
                textContainer.style.marginLeft = `${40 - currentPos*1.2}%`;
                backspaceRequired=true;
            }
        }
        else{
            if (currentPos > 0) {
                currentPos--; // Move one step back
                span = document.getElementById(`span${currentPos}`).style;
                span.color = ''; // Reset the color of the previously typed character
                span.backgroundColor = '';//if it is a space change its background color to normal
                correctChars--; // Decrement correctChars as we're going back
                textContainer.style.marginLeft = `${40 - currentPos * 1.2}%`; // Adjust margin left
            }
          
        }
        
    }
    else{
        if (event.key === 'Backspace') {
            // Handle backspace logic
            if (currentPos > 0) {
                currentPos--; // Move one step back,thi automatically increase margin to the right 
                span = document.getElementById(`span${currentPos}`).style;
                span.color = ''; // Reset the color of the previously typed character
                correctChars--; 
                textContainer.style.marginLeft = `${40 - currentPos * 1.2}%`; 
                backspaceRequired=false;
            }
            
        }
        else{
            if (event.key === textArr[currentPos]) {
                span.color = 'green'; // Correct key, turn green
                currentPos++;
                correctChars++;//increment correct char
                textContainer.style.marginLeft = `${40 - currentPos*1.2}%`;/*decrease left marging of the typing paragraph so that more part of 
                the text is being shown for every character decrease margin by 1%*/
            }
            else {
                errors.push(event.key);
                if (textArr[currentPos] === ' ') {
                    span.backgroundColor = 'red'; // Incorrect space, red background
                } else {
                    span.color = 'red'; // Incorrect character, red color
                }
                currentPos++;
                errors.push(textArr[currentPos]);
                textContainer.style.marginLeft = `${40 - currentPos*1.2}%`;
                backspaceRequired=true;
            }
        }
    }
    updateCursor();
    updateResults();
}


function updateCursor() {
    // Remove the old cursor
    const oldCursor = document.getElementById('cursor');
    if (oldCursor) {
        oldCursor.remove();
    }

    // Create a new cursor element
    let newCursor = document.createElement("span");
    newCursor.id = "cursor";
    newCursor.textContent = "|";
    
    // Insert the cursor at the current position in the text container
    const currentCharSpan = document.getElementById(`span${currentPos}`);
    if (currentCharSpan) {
        textContainer.insertBefore(newCursor, currentCharSpan);
    }
}

//make global var to use later in other functins
var accuracy;
var wpm;

function updateResults() {
    // Calculate Words Per Minute (WPM)
    const elapsedTimeInMinutes = elapsed / 60; // Convert elapsed time to minutes
    const correctWords = correctChars / 6; // Average word length is 6 characters
    wpm = Math.floor(correctWords / elapsedTimeInMinutes);
    var cpm = Math.floor(correctChars / elapsedTimeInMinutes);
    cpm=cpm-20;

    // Calculate Accuracy
    accuracy = Math.floor((correctChars / currentPos) * 100);


    // Display results in the results container
    if(wpm < 0) wpm = 0;
    if(cpm < 0) cpm = 0;

    wpmText.textContent = `${wpm}`;
    cpmText.textContent = `${cpm}`;
    accuracyText.textContent = `${accuracy}`;
}


async function handleEnd(){
    const statWpm=document.getElementById('stats-wpm');
    const statAccuracy=document.getElementById('stats-accuracy');
    const statRating=document.getElementById('stats-rating');
    const statBox=document.getElementById('pop-result-box');
    const statImg=document.getElementById('result-img');
    const message=document.getElementById('message');
    const animal=document.getElementById('animal');
    const darken=document.querySelector('.darken');

    statBox.classList.add("active");
    darken.classList.add("active");
    statWpm.textContent=`WPM: ${wpm}`;
    statAccuracy.textContent=`ACCURACY:${accuracy}%`;
    var rating=accuracy*wpm;
    statRating.textContent=`RATING: ${rating}`;

    const loggedUserId = localStorage.getItem("loggedUserId");
    if (!loggedUserId) {
        console.error("User not logged in");
        return;
    }

    const userDocRef = doc(db, "users", loggedUserId);

    // Session data to store
    const sessionData = {
        wpm: wpm,
        accuracy: accuracy,
        rating: rating,
        timestamp: new Date().toISOString(), // ISO format for the timestamp
    };

    console.log("WPM:", wpm);
console.log("Accuracy:", accuracy);

    if(wpm>=60){
        statImg.src='../images/octopus.jpg';
        animal.textContent='Octopus';
        message.textContent='You are fast seems like you have a lot of hands';
        
    }
    else if(wpm>=45){
        statImg.src='../images/rabbit.png';
        animal.textContent='Rabbit';
        message.textContent='You are hopping fast, but remember rabbit doesnt always win the race';
        
    }
    else if(wpm>=35){
        statImg.src='../images/bird.jpg';
        animal.textContent='Bird';
        message.textContent='You have a decent beak, but there is room for improvement ';
        
    }
    else if(wpm<30){
        statImg.src='../images/turtle.png';
        animal.textContent='Turtle';
        message.textContent='You are kinda slow!, but not for long. Practice daily';

    }

    console.log(statImg.src);
    console.log(animal.textContent);
    

    try {
        // Append session data to the typingHistory array it wull get created if not alredy prsent
        await updateDoc(userDocRef, {
            typingHistory: arrayUnion(sessionData),
        });
        console.log("Session data saved successfully!");
    } catch (error) {
        console.error("Error saving session data:", error.message);
    }

}

const boardButton=document.getElementById('btn-to-board');
boardButton.addEventListener('click',()=>{
    window.location.href = "../stats/stats.html";
});

const tryAgainButton=document.getElementById('try-again');
tryAgainButton.addEventListener('click',()=>{
    window.location.href = "./main.html";
});


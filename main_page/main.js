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

const profilePic=document.querySelector(".profile");
profilePic.addEventListener('click', ()=>{
    window.location.href="../profile_expand/expand.html"
})



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
const easyWords = [
    "their", "while", "about", "could", "those", "would", "other", "there", 
    "after", "which", "might", "being", "these", "every", "again", "below", 
    "until", "where", "since", "among", "shall", "given", "until", "great", 
    "quite", "small", "swift", "young", "these", "tried", "shall", "seven", 
    "above", "many", "eight", "doing", "below", "found", "third", "among", 
    "often", "being", "eight", "shall", "every", "seven", "among", "first", 
    "upon", "aside", "under", "quite", "above", "their", "these", "seven", 
    "still", "swift", "tried", "doing", "which", "where", "young", "about", 
    "might", "given", "eight", "shall", "those", "could", "being", "among", 
    "below", "other", "until", "great", "small", "swift", "would", "these", 
    "again", "many", "tried", "those", "first", "found", "aside", "often", 
    "where", "since", "upon"
];

const hardWords = [
    "Quick", "zephyr", "jumps;", "swiftly,", "brown", "fox.", "Azure", "dreams,", 
    "fizzle,", "then", "pop!", "Quiet", "moments,", "yielding", "to", "noisy", "chaos.", 
    "Purple", "grapes,", "juicy", "and", "sweet.", "Crimson", "sunset,", "painted", 
    "across", "the", "sky.", "Gloomy", "weather,", "but", "hope", "remains.", 
    "Silver", "spoon,", "elegant", "and", "refined.", "Yellow", "sun,", "bright", "and", 
    "warm.", "Orange", "tiger,", "striped", "and", "fierce.", "Green", "leaves,", 
    "dancing", "in", "the", "breeze.", "Blue", "ocean,", "vast", "and", "deep.", 
    "Small", "bird,", "singing", "a", "sweet", "song.", "Giant", "tree,", "reaching", 
    "for", "the", "sky.", "Tiny", "flower,", "blooming", "brightly.", "Clever", 
    "cat,", "stealthy", "and", "agile.", "Happy", "dog,", "wagging", "its", "tail.", 
    "Funny", "joke,", "making", "everyone", "laugh.", "Sad", "clown,", "hiding", 
    "his", "grief.", "Angry", "bull,", "charging", "forward.", "Scared", "mouse,", 
    "hiding", "in", "a", "hole.", "Brave", "knight,", "fighting", "for", "justice.", 
    "Wise", "owl,", "perched", "on", "a", "branch.", "Silly", "goose,", "honking", 
    "loudly.", "Old", "castle,", "standing", "proudly.", "New", "car,", "shiny", 
    "and", "fast.", "Big", "house,", "comfortable", "and", "spacious.", "Little", 
    "bug,", "crawling", "on", "the", "wall.", "Long", "road,", "stretching", 
    "into", "the", "distance."
];

const midWords = [
    "quince", "fjord", "glyph", "jazzy", "fizzle", "spigot", "musing", "quinoa", 
    "bluffs", "zigzag", "scythe", "jargon", "sphinx", "fuchsia", "bronze", "rhythm", 
    "oxygen", "frigid", "vortex", "zircon", "plague", "swerve", "yacht", "chintz", 
    "quirk", "brim", "craze", "wryly", "slump", "thump", "gorge", "prism", "whisk", 
    "grunt", "snarl", "toxin", "shoal", "churn", "whack", "bruit", "waver", "gauze", 
    "knead", "glyphs", "bistro", "swirl", "mound", "havoc", "snipe", "scowl", "jazzy.",
    "fizzle.", "spigot.", "musing.", "quinoa!", "bluffs.", "zigzag.", "scythe.", "jargon.", 
    "sphinx.", "fuchsia.", "bronze.", "rhythm.", "oxygen.", "frigid.", "vortex.", "zircon", 
    "plague?", "swerve.", "yacht.", "chintz.", "quirk", "brim.", "craze.", "wryly.", "slump."
];


// Function to jumble words create a paragraph
function generateJumbledParagraph(wordsArray, wordCount = 170) {
const shuffled = wordsArray.slice().sort(() => Math.random() - 0.5);//randomly sort
return shuffled.slice(0, wordCount).join(' ');
}
  
  
let text = 'Please press "start test" ';
let textContainer = document.getElementById('typing-paragraph');
let textArr = text.split('');
let htmlArr = textArr.map((item, index, array) => {
    if (item === ' ') {
        return `<span class="space" id="span${index}">${item}</span>`;
    }
    return `<span class="char" id="span${index}">${item}</span>`;
});
textContainer.innerHTML = htmlArr.join('');

let selectedTime = 60; // Default time->store globally to acces in other areas

document.getElementById('start-test').addEventListener('click', () => {
    // Get the selected values
    const difficulty = document.getElementById('difficulty').value;
    selectedTime = parseInt(document.getElementById('time').value, 10);  // Store selected time here
    const timeText = document.getElementById('timerNumber');
    
    // Do something with the selected values
    console.log(`Selected Difficulty: ${difficulty}`);
    if(difficulty==='hard'){
        let HardParagraph = generateJumbledParagraph(hardWords);
        text=HardParagraph;
    }
    else if(difficulty==='easy'){
        let EasyParagraph= generateJumbledParagraph(easyWords);
        text=EasyParagraph;
    }
    else{
        let MidParagraph=generateJumbledParagraph(midWords);
        text=MidParagraph;
    }
    
    textArr = text.split('');
    htmlArr = textArr.map((item, index, array) => {
        if (item === ' ') {
            return `<span class="space" id="span${index}">${item}</span>`;
        }
        return `<span class="char" id="span${index}">${item}</span>`;
    });
    textContainer.innerHTML = htmlArr.join(''); // Update the DOM with the new paragraph

    timeText.innerHTML = `${selectedTime}`; // Display the selected time
    
    // You can now use these values as needed
    alert(`Start the typing test by Preassing on a keyboard button!`);
});

/*-----------------------------------Typing part------------------------------------------------- */

let wpmText = document.getElementById('wpm');
let cpmText = document.getElementById('cpm');
let accuracyText = document.getElementById('accuracy');
let correctChars = 0; // To track the number of correctly typed chars



const invalidKeys = 'F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 Escape Tab CapsLock Shift Control Alt Meta ArrowLeft ArrowRight ArrowDown ArrowUp Enter'.split(
    ' ',
);

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
        event.preventDefault();//prevent defaut action of scrolling when pressed on spacebar
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
                correctChars++; 
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
    if(accuracy < 0) accuracy = 0;
    if(accuracy >100) accuracy = 100;

    wpmText.textContent = `${wpm}`;
    cpmText.textContent = `${cpm}`;
    accuracyText.textContent = `${accuracy}`;
}

function showMessage(message, divId){
    var messageDiv= document.getElementById(divId);
    messageDiv.style.display='block';//initially display is set to none in html by inline css and opacity is 0 in land.css
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
      messageDiv.style.opacity=0;
    },5000)
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
    if(wpm>=50 || accuracy===100){
        showMessage('you may have recieved new badges check out your profile', 'badgeMessage')
    }

    console.log(statImg.src);
    console.log(animal.textContent);
    

    try {
        // Add session data to the typingHistory array it wull get created if not alredy prsent
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

// /----------------------------------------------------------

const typeRivals=document.querySelector('.logo');
typeRivals.addEventListener('click',()=>{
    window.location.href='../landing_page/land.html'
})
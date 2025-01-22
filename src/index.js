import { initializeApp } from 'firebase/app'
import{getFirestore
  ,setDoc,doc
} from 'firebase/firestore'
import{
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword
  } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyA8a9zqqopk6mQ-ZeCaEz1In35USNDssG0",
    authDomain: "woc-iit.firebaseapp.com",
    projectId: "woc-iit",
    storageBucket: "woc-iit.firebasestorage.app",
    messagingSenderId: "786173271871",
    appId: "1:786173271871:web:e302fbdc53f6d267c8bd8a"
  };

//initialize firebase app
initializeApp(firebaseConfig)
//init services
const auth= getAuth()
const db= getFirestore()

function showMessage(message, divId){
  var messageDiv= document.getElementById(divId);
  messageDiv.style.display='block';//initially display is set to none in html by inline css and opacity is 0 in land.css
  messageDiv.innerHTML=message;
  messageDiv.style.opacity=1;
  setTimeout(function(){
    messageDiv.style.opacity=0;
  },5000)
}

/*---------------------------------SIGNING USERS UP--------------------------------------------*/
const signUp= document.getElementById('submitSignUp')

signUp.addEventListener('click', (event)=>{
  event.preventDefault();//prevents reloading a page on submit
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const country = document.getElementById('country').value;
  const password = document.getElementById('password').value;
  

    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log('user created:', cred.user);
      const userData={
        email: email,
        name: name,
        country: country,
      }
      showMessage('Account Created, Redirecting...','signUpMessage');
      const docRef=doc(db, "users", cred.user.uid);
      localStorage.setItem('loggedUserId',cred.user.uid);
      
      setDoc(docRef,userData)//1st argument is document reference, and 2nd is data to be set
      .then(()=>{
        window.location.href='../profile_picture/profile.html';//redirect REMOVE IT LATER 
      })
      
      .catch((err)=>{
        console.log("error writing data", err.message)
      })
      
    })
    .catch((err)=>{
      console.log(err.message);
      const errorCode=err.code;
      if(errorCode==='auth/email-already-in-use'){
        showMessage('Email already exist','signUpMessage');
        
      }
      else{
        showMessage('unable to create user','signUpMessage');
      }
    })
  })
  
  /*---------------------------------SIGNING USERS IN--------------------------------------------*/
  const signIn = document.getElementById('submitSignIn');
  signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInpassword').value;
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('login is successful', 'signInMessage');
      const user = userCredential.user;//get the user as a const from the input provided by the system
        localStorage.setItem('loggedUserId', user.uid);/*create a var loggeUserId and set its value to userloginid, 
        this variable can be accesed in any js file by getItem method*/
        window.location.href='../main_page/main.html';
      })
      .catch((err)=>{
        console.log(err.message);
        const errorCode=err.code;
        if (errorCode === 'auth/wrong-password') {
          showMessage('Incorrect password', 'signInMessage');
      } else if (errorCode === 'auth/user-not-found') {
          showMessage('Account does not exist', 'signInMessage');
      } else {
          showMessage('Unable to log in', 'signInMessage');
      }
        })
});

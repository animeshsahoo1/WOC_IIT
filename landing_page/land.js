const header =document.querySelector("header");
window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", window.scrollY > 50);
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


signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})
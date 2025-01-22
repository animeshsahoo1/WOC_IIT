import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js'
import{getFirestore
  ,doc,getDoc, 
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyA8a9zqqopk6mQ-ZeCaEz1In35USNDssG0",
    authDomain: "woc-iit.firebaseapp.com",
    projectId: "woc-iit",
    storageBucket: "woc-iit.firebasestorage.app",
    messagingSenderId: "786173271871",
    appId: "1:786173271871:web:e302fbdc53f6d267c8bd8a"
  };

initializeApp(firebaseConfig);
//init services
const db= getFirestore();

//get the userid of the users
const loggedUserId = localStorage.getItem('loggedUserId');

/*-------------------------------------------graph--------------------------------------------------- */

const lineChart = document.getElementById("progress-chart");


var wpm=[];
var accuracy=[];
var date=[];

let lineGraph = new Chart(lineChart, {
  type: "line",
  data: {
    labels: date,
    datasets: [
      {
        label: 'WPM',
        data: wpm,
        borderWidth: 1,
      },
      {
        label: 'Accuracy',
        data: accuracy,
        borderWidth: 1,
      },
    ],
  },
  
  
  options: {
    plugins: {
      
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            if (tooltipItem.dataset.label === 'WPM') {
              return tooltipItem.raw + ' WPM';  // Tooltip for WPM dataset
            } else if (tooltipItem.dataset.label === 'Accuracy') {
              return tooltipItem.raw + '%';  // Tooltip for Accuracy dataset
            }
          }
        }
      },
      
      title: {
        display: true,
        font: {
          size: 50,
          weight: "bold",
        },
        padding: {
          bottom: 12,
        },
      },
      
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10//for 20 28 36 and so on
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  },
});


document.addEventListener("DOMContentLoaded", async () => {
  await getData();
  updateChart();
});




function updateChart() {
  lineGraph.data.labels = date; // Update x-axis with dates
  lineGraph.data.datasets[0].data = wpm; // Update WPM data
  lineGraph.update(); // Re-render the chart with new data
}

async function getData() {
  console.log('working')
  if (loggedUserId) {
    const userDocRef = doc(db, "users", loggedUserId);
    const history = [];
    
    try {
      const docSnapshot = await getDoc(userDocRef);//getdoc returns a promise
      const userData = docSnapshot.data();
      
      userData.typingHistory.forEach((item) => {
        history.push({
          timestamp: item.timestamp, // Keep as raw timestamp for sorting,
          WPM: item.wpm,
          accuracy: item.accuracy,
        });
      });
    } catch (err) {
      console.error("Error getting data:", err);
      return; 
    }

    // Sort history in ascending order of timestamp
        const sortedHistory = history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        sortedHistory.forEach((obj)=>{
          wpm.push(obj.WPM);
          accuracy.push(obj.accuracy);
          date.push(new Date(obj.timestamp).toLocaleDateString());//convert into only date
        })
        
        console.log("Sorted history:", sortedHistory);
        console.log("WPM Array:", wpm);
        console.log("Accuracy Array:", accuracy);
        console.log("Date Array:", date);
        
        
        
        
      } else {
        console.error("No logged user found in localStorage.");
      }
    }

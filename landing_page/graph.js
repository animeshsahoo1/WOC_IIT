const mychart = document.getElementById("myChart");

let barGraph = new Chart(mychart, {
  type: "bar",
  data: {
    labels: Array.from({ length: 71 }, (_, i) => i + 20),
    datasets: [
      {
        label: "people",
        data: [
          425337, 453690, 483028, 506734, 528799, 551654, 568372, 584524,
          596203, 606110, 609576, 607406, 598657, 591206, 574089, 561563,
          545756, 525808, 508569, 489892, 476562, 455769, 434016, 414277,
          393823, 377301, 360289, 341037, 323967, 308984, 297379, 282804,
          267229, 250702, 240689, 229164, 216472, 205235, 194901, 185095,
          174810, 167330, 159786, 146607, 139391, 129690, 121109, 114327,
          106870, 101609, 93967, 88277, 81995, 76439, 70767, 66265, 61673,
          56661, 53720, 48106, 45107, 42264, 38294, 35871, 32935, 30583, 28082,
          25123, 25374, 21815, 20381,
        ],
        borderWidth: 1,
        backgroundColor: "#A3D95D",
      },
    ],
  },
  options: {
    plugins: {
        legend: { 
            display: false 
        },
        
        tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.raw + ' people write in';  // 'raw' gives the actual value
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
        min: 20, // Start from 20
        max: 90,
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
  },
});

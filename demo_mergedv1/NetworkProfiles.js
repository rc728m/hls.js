new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
      datasets: [{ 
          data: [22152,22152,22152,22464,22464,22464,22270,22270,22270,22537],
          label: "WiFi",
          borderColor: "rgb(0,0,255)",
          fill: false
        }, { 
          data: [12000,1944,1008,1716,1524,1440,828,888,1308,1548],
          label: "Cellular",
          borderColor: "rgb(0,255,0)",
          fill: false
        }, { 
          data: [1500,1500,1500,1500,1500,1500,1500,1500,1500,1500],
          label: "Stream Saver",
          borderColor: "rgb(255,0,0)",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Network Profiles'
      },    
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time in Seconds'
          }
        }],
        yAxes: [{
           display: true,

          scaleLabel: {
            display: true,
            labelString: 'Bit/Sec'
          }
        }]
    }
}}
);
var pauseBitrateInterval = false;
var timeChart = 0 ;
var interval = 1000;
var videoElement;
var bitrateChartElement;
var bitrateInterval;
var firstChartLoad = true ;
var ctx;
var myChart;
var chartbitrateConfig = {
            type: 'line',
            data: {
                labels: [ ],
                datasets: [{
                    fill: false,
                    borderColor: 'rgb(0,0,255)',
                    label: 'Bitrate',
                    data: [],
                    steppedLine: true
                }],
              },
            options: {
              tooltips: {
              mode: 'index',
              intersect: false,
            },
              hover: {
                mode: 'nearest',
                intersect: true
              },
              scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Seconds'
                    }
                  }],
                  yAxes: [{
                     display: true,

                    scaleLabel: {
                      display: true,
                      labelString: 'Bitrate'
                    }
                  }]
                }
            }
        };

function inititializeMyBitrateChart(myChartElement , video){
  firstChartLoad = false;
    videoElement = video;
    ctx = myChartElement.getContext('2d');
    myChart = new Chart(ctx, chartbitrateConfig);
    initializeInterval();
}


function initializeInterval(){
    bitrateInterval = window.setInterval(function(){
        if(pauseBitrateInterval){
          clearInterval(bitrateInterval);
        }else{
          addDataToMyBitrateChart(myChart, timeChart, [currentBitRateLevel]);
          timeChart += interval / 1000;
        }
    }, interval);

}

function clearBitrateInterval(){
    pauseBitrateInterval = true;
}
function resumeBitrateInterval(){
  if(pauseBitrateInterval){
      pauseBitrateInterval = false;
      clearInterval(bitrateInterval);
          bitrateInterval = window.setInterval(function(){
              if(pauseBitrateInterval){
                clearInterval(bitrateInterval);
              }else{
                addDataToMyBitrateChart(myChart, timeChart, [currentBitRateLevel]);
                timeChart += interval / 1000;
              }
          }, interval);  
    }

}

function addDataToMyBitrateChart(chart, label, data) {
    chart.data.labels.push(label);
     chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data[0]);
       
    });
    chart.update();
}

function removeDataFromMyChart() {
  if(!firstChartLoad){   
  
   myChart.data.labels =  [ ]

   myChart.data.datasets[0].data = [];   

   myChart.update();

   timeChart = 0 ;

   clearBitrateInterval();        

 }

}

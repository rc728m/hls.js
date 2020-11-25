

let toggle = document.getElementById("toggleRecord")

var videoSrc;
let record = [];

turnOn = false;

function getVideoSrc(xSrc) {
  videoSrc = xSrc;
}

const checkbox = document.getElementById('recordCheckbox')

//event listener for switching toggle on or off
checkbox.addEventListener('change', (event) => {
  if (event.target.checked) {
    turnOn = true
  } else {
    clearStopMetrics()
    turnOn = false
  }
})


//toggle is on - we are recording information
function recordMetrics() {
  if(turnOn) {
    record.push({
      video: videoSrc,
      vst: document.getElementById("VSTcontinuous").innerHTML,
      playtime: document.getElementById("time3").innerHTML,
      rebuffRatio: document.getElementById("demo").innerHTML,
      estimatedBandwidth: document.getElementById("Bandwidth").innerHTML,
      bitrateMean: document.getElementById("bitrateMean").innerHTML
    })
  }
}

//toggle is off - we clear the info and stop
function clearStopMetrics() {
  record = []
}

//videoSRC: document.getElementById('video').src,

//function that downloads recorded data to xlsx sheet
function downloadXLSX() {

  if (turnOn == false) {
    alert("Recording is not turned on.")
  }
  else {
    const d = new Date();
    const n = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear();

    const excel = $JExcel.new("Arial 10 #000000");

    excel.set({sheet: 0, value: "Video 1"});

    const headers = ["Video Source", "VST", "Playtime", "Rebuffering Ratio", "Estimated Bandwidth", "Bitrate Mean"];

    //format of header cells
    const formatHeader = excel.addStyle({
      border: "thin,thin,thin,thin #000000",
      font: "Arial 10 #000000 B"
    });

    //format of data cells
    const formatData = excel.addStyle({
      border: "thin,thin,thin,thin #000000",
      font: "Arial 10 #000000"
    });

    //video source header
    excel.set(0, 0, 0, headers[0], formatHeader);
    excel.set(0, 0, undefined, "auto");

    //VST header
    excel.set(0, 0, 1, headers[1], formatHeader);
    excel.set(0, 0, undefined, "auto");

    //rest of headers
    for (let i = 2; i < headers.length; i++) {
      excel.set(0, i - 2, 4, headers[i], formatHeader);
      excel.set(0, i - 2, undefined, "auto");
    }

    //video source data
    excel.set(0, 1, 0, record[0].video, formatData);
    excel.set(0, 1, undefined, "auto");

    //VST data
    excel.set(0, 1, 1, record[0].vst, formatData);
    excel.set(0, 1, undefined, "auto");

    //rest of data
    for(let i = 0; i < record.length; i++) {
      excel.set(0, 0, i + 5, record[i].playtime, formatData);
      excel.set(0, 0, undefined, "auto");

      excel.set(0, 1, i + 5, record[i].rebuffRatio, formatData);
      excel.set(0, 1, undefined, "auto");

      excel.set(0, 2, i + 5, record[i].estimatedBandwidth, formatData);
      excel.set(0, 2, undefined, "auto");

      excel.set(0, 3, i + 5, record[i].bitrateMean, formatData);
      excel.set(0, 3, undefined, "auto");
    }

    excel.generate(`MetricData-${n}.xlsx`);
  }


}


function getRecords() {
  return record;
}

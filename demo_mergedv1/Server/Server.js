const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const path = require('path');
const cors = require('cors');
let contentLength = null;
const bandwidthThrottle = require('bandwidth-throttle-stream');

const bandwidthThrottleGroup = bandwidthThrottle.createBandwidthThrottleGroup({});

app.use(bodyParser.json());

app.use(cors());

app.use(express.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, '..')));  //looks for index.html

app.get("/network", getNetworkValue, (req, res) => {
    // console.log(req.url);
    // const
    // let network_value = req.query.value;  //use this if you use a post request with axios
    
    //start throttling and make switch statement to set the bytespersecond value
    switch (req.networkValue) {
        case 'None': bandwidthThrottleGroup.config.bytesPerSecond = Infinity;             //set bytespersecond back to default (Infinity)
            break;
        case 'GPRS': bandwidthThrottleGroup.config.bytesPerSecond = 300000;             //test 1  this aint the actual value for GPRS
            break;
        case 'Regular 2G': bandwidthThrottleGroup.config.bytesPerSecond = 500000;       //test 2  not actual value for Regular 2G
            break;
        // case 'Good 2G': bandwidthThrottleGroup.config.bytesPerSecond = 4;          //
        //     break;
        // case 'Regular 3G': bandwidthThrottleGroup.config.bytesPerSecond = 144375;       //
        //     break;
        // case 'Good3G': bandwidthThrottleGroup.config.bytesPerSecond = 14375;           //
        //     break;
        // case 'Regular 4G': bandwidthThrottleGroup.config.bytesPerSecond = 14375;       //
        //     break;
        // case 'DSL': bandwidthThrottleGroup.config.bytesPerSecond = 14375;              //
        //     break;
        // case 'WIFI': bandwidthThrottleGroup.config.bytesPerSecond = 14375;             //
        //     break;
    }
    
    const path = '../index.html'
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    contentLength = fileSize;
    //attach throttle
    const throttle = bandwidthThrottleGroup.createBandwidthThrottle(contentLength);

});

async function getNetworkValue(req, res, next) {
    req.networkValue = req.query.networkValue; //pass the network value selected to app.get('/network')
    next();  //executes app.get('/network')
}

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

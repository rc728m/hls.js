// import { networkChange } from "./app.js";
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const path = require('path');
const cors = require('cors');
const bandwidthThrottle = require('bandwidth-throttle-stream');

const bandwidthThrottleGroup = bandwidthThrottle.createBandwidthThrottleGroup({});

app.use(bodyParser.json());

app.use(cors());

app.use(express.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, '..')));  


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

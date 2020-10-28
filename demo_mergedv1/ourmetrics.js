  // Variable Decleration
  
  // Timers
  var initialTime = 0;
  var vst = 0;
  var pauseTime = 0;
  var totalPauseTime = 0;
  var totalPlayTime = 0;
  var totalRebufferTime = 0;
  var bufferStartTime = 0;
  var bufferEndTime = 0;
  var bufferSeconds = 0;
  var t0 = 0; 
  var t1 = 0; 
  var t2 = 0; 
  var t3 = 0; 
  var timeDiff = 0;   

  // Counters
  var rebufferCount = 0;
  var pauseCount = 0;
  var fullScreenCount = 0;
  var errorCount = 0;
  var seekCount = 0;
  var sessionTime = 0;
  var playcounter = 0; 

  // Bools
  var boolPaused = false; 
  var isBuffering = false;
  var boolCanPlay = false;
  var boolIsSupported = false;
  var boolWaiting = false;
  var bufferedDuringLast5Seconds = false;
  var playd = false;
  var firstPlay = true;  
  var fullScreenBool = false;

  // Hls init
  var hls;   
  var video = document.getElementById('video');
  var videoSrc ='https://att-advavtech-output.s3.amazonaws.com/csula/At_S_SPR_1080p24.m3u8';
  // Video configs
  var configs = {
    autoStartLoad:true,
    debug:false,
    // maxBufferLength: 0.1,
    // maxBufferSize: 10*100,  
  };

  // Initialize video player
  window.onload = function init() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      boolCanPlay = true;
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      boolIsSupported = true;
      hls = new Hls(configs);
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.muted = true;
        video.play();
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        errorCount++;
        document.getElementById("errorCount").innerHTML = errorCount;
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
        changeLevelCounter++;
        document.getElementById("changeLevelCounter").innerHTML = changeLevelCounter;
        document.getElementById("bitrateChange").innerHTML += ", " + (hls.levels[hls.currentLevel].bitrate / 1024).toFixed(2) + "Kbps(" + hls.currentLevel + ")";
      }); 
    }
  }
  
  //play count
  video.addEventListener("play", function(){ 
    playcounter++; 
    document.getElementById("playcounter").innerHTML = playcounter;
  });
  // Paused event function
  video.addEventListener("pause", function(){
    t0 = performance.now();
    pauseCount++;
    updateMetrics();
    boolPaused = true; 
  });

  // Waiting event function
  video.addEventListener("waiting", function(){
    t0 = performance.now();
    if (firstPlay === false){
	  rebufferCount++;
	}
    bufferedDuringLast5Seconds = true;
    boolWaiting = true;
    updateMetrics();
  });

  // Playing event function
  video.addEventListener("playing", function(){
    boolWaiting = false;
    t1 = performance.now();
    timeDiff = (t1-t0) / 1000;
    if(firstPlay){
      initialTime = t0 / 1000;
      vst = timeDiff;
	  duration = video.duration;
	  document.getElementById("Duration").innerHTML = duration;
      document.getElementById("VSTinitial").innerHTML = vst.toFixed(4); 
      document.getElementById("VSTcontinuous").innerHTML = timeDiff.toFixed(4); 
    }else{ document.getElementById("VSTcontinuous").innerHTML = timeDiff.toFixed(4);}
        
    if (boolPaused == false){
      if (firstPlay === false){
        totalRebufferTime += timeDiff;
      }
      updateMetrics();
      document.getElementById("rebufferCount").innerHTML = rebufferCount;
      document.getElementById("bufferDuration").innerHTML = timeDiff.toFixed(4) + " seconds";
      document.getElementById("totalRebufferTime").innerHTML = totalRebufferTime.toFixed(4) + " seconds";
    }
    else {
      totalPauseTime += timeDiff;
      document.getElementById("totalPauseTime").innerHTML = totalPauseTime.toFixed(4) + " seconds";
      boolPaused = false;
      document.getElementById("pauseCount").innerHTML = pauseCount;
    }
    firstPlay = false;	
  });
  //Seeked event function
  video.addEventListener("seeked", function(){
    seekCount++;
    boolPaused = false;
    document.getElementById("seekCount").innerHTML = seekCount;
  });
  
  // Update Metrics function
  function updateMetrics() {
    currentTime = performance.now() / 1000;
	totalPlayTime = currentTime - initialTime - totalPauseTime;
	bufferStartTime = video.buffered.start(0);
	bufferEndTime = video.buffered.end(0);
    document.getElementById("time3").innerHTML = totalPlayTime.toFixed(4) + " seconds";
    document.getElementById("demo").innerHTML = ((totalRebufferTime / totalPlayTime) * 100).toFixed(4) + "%";
	document.getElementById("bufferSize").innerHTML = (bufferEndTime - bufferStartTime) + " (" + bufferStartTime + "s~" + bufferEndTime + "s)";
	document.getElementById("currentTime").innerHTML = video.currentTime + "s";
	document.getElementById("watchedPercent").innerHTML = ((video.currentTime / duration) * 100).toFixed(4) + "%";
  }

  window.setInterval(function getSessionTime(){
      sessionTime = performance.now() / 1000 - initialTime;    
      document.getElementById("sessionTime").innerHTML = sessionTime.toFixed(4) + " seconds";
  },2000);

  // Call to Update Metrics
  window.setInterval(function(){if (boolPaused === false && firstPlay === false) {updateMetrics()}}, 3000);

  // Resolution
  window.setInterval(function(){
    document.getElementById('resolution').innerText = video.videoHeight + "x" + video.videoWidth;
  }, 3000);

  // Volume function
  video.addEventListener('volumechange', function() {
    if (video.muted) {
      document.getElementById("Volume").innerHTML = 0 + "%";
    }
    else {
      document.getElementById("Volume").innerHTML = (video.volume*100).toFixed(0) + "%";
    }
  });

  // Full-screen fuction
  video.addEventListener("webkitfullscreenchange", function() {
    if (!fullScreenBool) {
      fullScreenCount++;
      fullScreenBool = true;
    }
    else {
      fullScreenBool = false;
    }
    document.getElementById("fullScreenCount").innerHTML = fullScreenCount;
  });

  //Playlist Manager
  function PlaylistClicked(source, id){
    if (boolCanPlay) {
      video.src = source;
    }else if(boolIsSupported) {
      hls.destroy();
      hls = new Hls(configs);
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.muted = true;
        video.play();
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        errorCount++;
        document.getElementById("errorCount").innerHTML = errorCount;
      }); 
      hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
        changeLevelCounter++;
        document.getElementById("changeLevelCounter").innerHTML = changeLevelCounter;
        document.getElementById("bitrateChange").innerHTML += ", " + hls.levels[hls.currentLevel].bitrate + "Kbps(" + hls.currentLevel + ")";
      }); 
    }
    var activeElements = document.getElementsByClassName('nav-link active');
    for (var i = 0; i < activeElements.length; i++) {
      var current = activeElements[i];
      current.className = current.className.replace(" active", "");
    }

    // Reset Variables
    var clickedElement = document.getElementById(id);
    clickedElement.className += " active";
    vst = 0;
    decodedFrames = 0;
    droppedFrames = 0;
    fps = 0;
    
    // Reset Timers
    vst = 0;
    bufferDuration = 0;
    bufferEndTime = 0;
    bufferStartTime = 0;
    bufferSeconds = 0;
    totalRebufferTime = 0;
    pauseTime = 0;
    totalPauseTime = 0;
    totalPlayTime = 0;
    t0 = performance.now();
    t1 = 0;
    t2 = 0;
    timeDiff = 0; 

    // Reset Counters
    rebufferCount = 0; 
    pauseCount = 0;
    fullScreenCount = 0;
    errorCount = 0;
    seekCount = 0;
    
    // Reset Bools
    firstPlay = true;
    isBuffering = false;

    // Reset innerHTML
    document.getElementById("rebufferCount").innerHTML = rebufferCount;
    document.getElementById("bufferDuration").innerHTML = bufferSeconds;
    document.getElementById("totalRebufferTime").innerHTML = totalRebufferTime;
    document.getElementById("VSTinitial").innerHTML = "";
    document.getElementById("VSTcontinuous").innerHTML = "";
    document.getElementById("demo").innerHTML = "";
    document.getElementById("DecodedFps").innerHTML = "";
    document.getElementById("DroppedFps").innerHTML = "";
    document.getElementById("Fps").innerHTML = "";
    document.getElementById("totalPauseTime").innerHTML = 0;
    document.getElementById("time3").innerHTML = "";
    document.getElementById("fullScreenCount").innerHTML = 0;
    document.getElementById("errorCount").innerHTML = 0;
    document.getElementById("seekCount").innerHTML = 0;
  document.getElementById("playcounter").innerHTML = 0;
  document.getElementById("bitrateChange").innerHTML = "";
  }

  // Get FPS , Decoded Frames, Dropped Frames
  var fps = 0; 
  var decodedFrames = 0;  
  var droppedFrames = 0; 
  var lastDecodedFrames = 0;
  var currentFPS = 0; 
  window.setInterval(function getCurrentFPS(){
    if(!boolPaused && !isBuffering && !boolWaiting && !bufferedDuringLast5Seconds){
      decodedFrames = video.webkitDecodedFrameCount || video.mozDecodedFrames || 0;
      droppedFrames = video.webkitDroppedFrameCount || video.mozParsedFrames - video.mozDecodedFrames || 0;
      if(lastDecodedFrames == 0 ){
        lastDecodedFrames = decodedFrames;
      }else{
        currentFPS = decodedFrames;
        document.getElementById("Fps").innerHTML = ((currentFPS - lastDecodedFrames)/5).toFixed(0);
        document.getElementById("DecodedFps").innerHTML = decodedFrames;
        document.getElementById("DroppedFps").innerHTML = droppedFrames;            
        lastDecodedFrames = currentFPS;
      }
    } 
    bufferedDuringLast5Seconds = false; 
  },  5000);

  window.setInterval(function getBandwidth(){
      if(hls.bandwidthEstimate <  1024){
          document.getElementById("Bandwidth").innerHTML = hls.bandwidthEstimate.toFixed(0) + "bps";
      }else if(hls.bandwidthEstimate >=  1024 && hls.bandwidthEstimate < 1048576){
         document.getElementById("Bandwidth").innerHTML = (hls.bandwidthEstimate/1024).toFixed(0) + "Kbps";
      }else if(hls.bandwidthEstimate >= 1048576){
         document.getElementById("Bandwidth").innerHTML = (hls.bandwidthEstimate/1048576).toFixed(0) + "Mbps";
      }
  },  10000);
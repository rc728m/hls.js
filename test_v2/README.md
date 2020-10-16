Update: v2.0
"Welcome to version 2 of our HLS.js Test Player Updates are below, Check v1.0 for cloning directions"
Updates to Display:
-- Startup time from loading to the video playing
-- Improved video start time with more accurate timers
-- Buffer count, to count the initial buffer and each time the player needs to rebuffer
-- Total buffer time, to add all buffering and rebuffering time
-- Buffer ratio (percentage), calculated as total buffer time divided by total play time
-- Play time, the total time the user is playing the video
-- Pause count, which counts every time video is paused
-- Estimated frames per second (FPS) which delivers the current FPS minus the last decoded frames
-- Total decoded frames, which is the running total of decoded frames
-- Dropped frames, which displays the amount of frames dropped

Update: v1.1
-- This update includes a VST timer beta and a video resolution display
-- Use git pull to pull in the updates
-- The test folder is now named test_v1 and the update is test_v1.1.html (use this html)
-- All test videos are loaded into clickable links above the player
-- To add more video links, simply add another <a>Video URL</a> to the html page
-- No DASH video formats are allowed
-- Check back for more updates

Initial: v1.0
-- This is a simple HLS.js test player v1.0

Directions:
-- First, copy the address of the repository to the clipboard (top left of repo)
-- Next, in terminal, cd into the directory of your choice to house the code
-- Next use git clone -b <branch> <remote_repo> to clone the proper branch
-- Next, locate the directory where you cloned the repo to
-- Next open the HLS.js folder and the test_v1.0 folder

--To test, simply load the test_v1.0.html into Safari or Chrome.
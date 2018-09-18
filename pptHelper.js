
const fs = require('fs');
const decompress = require('decompress');
const convert = require('xml-js');
// remove util if no longer needed
const util = require('util');
const path = require('path');
const Ffmpeg = require('fluent-ffmpeg');
const del = require('del');

// remove once done playing
const fetch = require('node-fetch');

var target = process.argv[2];
var copy = target.split(".").shift() + "_copy.zip";
var PPTFolder;
var pptHelperDir = "/pptHelperDir";

/////////////////////////

// tutorial for working outside project's root folder: http://www.monitis.com/blog/6-node-js-recipes-working-with-the-file-system/

// // uncomment after getting extraneous files to be created here
// fs.mkdirSync("pptHelperDir", function(err) {
// 	if (err) {
// 		console.log("failed to create pptHelperDir")
// 	} else {
// 		console.log("successfully created pptHelperDir");
// 	}
// });

/////////////////////////

// Make zip file
fs.copyFile(target, copy, (err) => {
	if (err) throw err;
	console.log("\n", target, "\n ...was copied to...\n", copy, "\n");

	// Unzip file
	decompress(copy, copy.split('.').shift()).then((files, err) => {
		// check to make sure decompress module has this error reporting capability
		if (err) throw err;
		PPTFolder = copy.split('.').shift();
		console.log(copy, "\n ...was unzipped to create...\n", PPTFolder);
		locateVideos(PPTFolder);
	});
});

function locateVideos(PPTFolder) {

	// var absolutePathOfPPTFolder = path.join(__dirname, PPTFolder);
	var absolutePathOfPPTFolder = PPTFolder;

	var slidesRelsFolder = path.join(absolutePathOfPPTFolder, 'ppt', 'slides', '_rels');

	console.log("\n======================\n");

	fs.readdir(slidesRelsFolder, (err, entries) => {

		// create array of objects. Each object has "slide", "hasVideo", "vidLocation", and (possibly) vidLocation2 properties.
		var resultsList = entries.map(x => {

			var obj = {};

			// add slide number property to object
			obj.slide = parseInt(x.split(".").shift().split("slide").pop());

			// location of rels file
			var relsFile = path.join(slidesRelsFolder, x);

			// read relsFile contents in string form
			var fileGuts = fs.readFileSync(relsFile, 'utf8', (err, data) => {
				if (err) throw err;
				return data;
			});

			// add hasVideo (and vidLocation, if applicable) property to object. If no vid, hasVid is false.
			if (fileGuts.indexOf('relationships/video"') >= 0) {
				obj.hasVideo = true

				// convert XML to JSON. JSON is a string at this point
				var fileGutsJSONString = convert.xml2json(fileGuts, {compact: false, spaces: 4});

				// de-stringify, making it a proper JSON object
				var fileGutsJSON = JSON.parse(fileGutsJSONString);

				// array of all slide relationship properties (equivalent of original XML properties)
				var relArray = fileGutsJSON.elements[0].elements;

				// returns array of video locations. If a slide has no video, returns undefined
				relTarget = relArray.map(relationship => {
					if (relationship.attributes.Type.indexOf('video') >= 0) {
						return relationship.attributes.Target;
					}
				});

				// array of all video locations. Typically should be only one item in the array
				var vidLocationArray = relTarget.filter(relTarget => relTarget != undefined);

				// add vidLocation property to object
				obj.vidLocation = vidLocationArray[0].toString();

				// what to do with extra videos? Cross reference "slides" folder to find if there are two video tags?
				// If second video, logs an alert to console and adds vidLocation2 property to obj
				if (vidLocationArray[1] != undefined) {
					console.log("\n Slide ", obj.slide, " has a second video at: ", vidLocationArray[1]);
				obj.vidLocation2 = vidLocationArray[1].toString();
				}

				// test this
				// if 3rd video, logs warning to console
				if (vidLocationArray[2] != undefined) {
					console.log ("\n There are three or more videos in slide ", obj.slide, "!")
				}

			} else {
				obj.hasVideo = false
			}

			return obj;

		});

		// filtered results list: an array of objects, with slides that don't contain videos taken out
		var onlyResultsWVids = resultsList.filter(obj => obj.hasVideo === true);

//////////////////////////

		function getMeanVolume(videoFile) {
		 	return new Promise((resolve, reject) => {
				new Ffmpeg({ source: videoFile })
			  	.withAudioFilter('volumedetect')
					.addOption('-f', 'null')
					.addOption('-t', '500')
					.on('error', function(err, stdout, stderr) {
						console.log('An error occurred: ' + err.message);
						})
					.on('start', function(ffmpegCommand) {
						// console.log('\n the following ffmpeg command is being run:\n', ffmpegCommand, "\n");
					})
					.on('end', function(stdout, stderr) {
				    let meanVolumeRegex = stderr.match(/mean_volume:\s+(-?\d+(\.\d+)?)/);
				    let maxVolumeRegex = stderr.match(/max_volume:\s+(-?\d+(\.\d+)?)/);
				    // return the mean and max volumes as arguments for callback function
				    if(meanVolumeRegex && maxVolumeRegex){
				      let meanVolume = parseFloat(meanVolumeRegex[1]);
				      let maxVolume = parseFloat(maxVolumeRegex[1]);
				      return resolve([meanVolume, maxVolume]);
				    } else {
				    	// console.log("\nmeanVolumeRegex and maxVolumeRegex do not exist. Callback will be set to false\n")
				      return resolve(false);
				    }
			 		})
				 	.saveToFile('/dev/null');
		 	});
		}

		var onlyResultsWVidsPromises = onlyResultsWVids.map(x => {
			let vidFile = path.join(slidesRelsFolder, "..", x.vidLocation);

			return getMeanVolume(vidFile)
				.then((audioInfoArray) => {
					x.meanVolume = audioInfoArray[0];
					x.meanGraph = "-".repeat(91 + audioInfoArray[0])
					x.maxVolume = audioInfoArray[1];
					x.maxGraph = "-".repeat(91 + audioInfoArray[1])
					return x;
				});
		});

		Promise.all(onlyResultsWVidsPromises)
			.then((res) => logResults(res))
			.then(() => {
				del([PPTFolder, copy], { force: true }).then(paths => {
					console.log('\nDeleted files and folders:\n', paths.join(), '\n');
				});
			});

/////////////////////////////

		// fix for singular
		// Log how many slides have videos
		// console.log("\n", arrayWithVidInfo.length + " slides contain videos:", "\n");
		
///////////////////////////// below is an old method of logging sorted results...

		function logResults(finalResultsList) {

			finalResultsList.sort(function(a, b) {
			 return a.slide - b.slide || b.hasVideo - a.hasVideo;					
			})

			console.log(finalResultsList);
		}

/////////////////////////////

	}); // fs.readdir callback

} // locateVideos function callback

///////////////////////////// Below is the beginnings of a way to do this for every PPT file in a folder

function buildTree(startPath) {
	fs.readdir(startPath, (err, entries) => {
		console.log(entries);
		entries.forEach((file) => {
			const path = `${startPath}/${file}`;

			// console.log(path);

			if (fs.lstatSync(path).isDirectory()) {
				buildTree(path);
			}
		})
	});
}

// // buildTree(PPTFolder);
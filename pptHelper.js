
const fs = require('fs');
const decompress = require('decompress');
const convert = require('xml-js');
// remove util if no longer needed
const util = require('util');
const path = require('path');
const Ffmpeg = require('fluent-ffmpeg');

// remove once done playing
const fetch = require('node-fetch');

var target = process.argv[2];
var copy = target.split(".").shift() + "_copy.zip";
var PPTFolder;
var pptHelperDir = "/pptHelperDir";

/////////////////////////

// work through this tutorial before trying to work in a folder besides the project's root folder:
// http://www.monitis.com/blog/6-node-js-recipes-working-with-the-file-system/

// console.log(copy);

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
	console.log("======================");
	console.log(target, "\n ...was copied to... \n", copy);

	// Unzip file
	decompress(copy, copy.split('.').shift()).then((files, err) => {
		// check to make sure decompress module has this error reporting capability
		if (err) throw err;
		PPTFolder = copy.split('.').shift();
		console.log("\n", copy, "\n ...was unzipped to create... \n", PPTFolder);
		locateVideos(PPTFolder);

	});

});

function locateVideos(PPTFolder) {

		var absolutePathOfPPTFolder = path.join(__dirname, PPTFolder);

		var slidesRelsFolder = path.join(absolutePathOfPPTFolder, 'ppt', 'slides', '_rels');

		console.log("======================");

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
			// console.log(onlyResultsWVids);

////////////////////////// working on promises with array

			// let names = ['iliakan', 'remy', 'jeresig'];
    
	  //   let requests = names.map(name => name + " was here");
	    
	  //   Promise.all(requests)
	  //     .then(responses => {
	  //         console.log(responses);
	  //       });


	  ///////////////

			// let experimentalArray = onlyResultsWVids.map(x => {

			// 	function trying (x) {

			// 		return new Promise((resolve, reject) => {
			// 			x.test = 'test';
			// 			resolve(x);
			// 		});
			// 	}

			// 	trying(x)
			// 		// .then((x) => return x)
			// 		.then((x) => console.log("success! \n", x))
			// 		.catch((err) => console.error(err));

			// });

			// Promise.all(experimentalArray)
			// 	.then(responses => {
			// 		// console.log(responses);
			// 		console.log('this string');
			// 	});

	  ///////////////

	  // function transformAndDeliverArray (array) {
	  // 	return new Promise((resolve, reject) => {

	  // 		// let newArray = array.map(array => {
	  // 			setTimeout(() => {
			//   		array.map(array => {
			//   			array.test = 'super good test'
			//   			array.test2 = 'super good test2'
			//   		});
	  // 				console.log("wait is over")
	  // 			}, 2000)

	  // 		// resolve(newArray);
	  // 		resolve(array);

	  // 	});
	  // }

	  // transformAndDeliverArray(onlyResultsWVids)
	  // 	.then((result) => console.log(result));

//////////////////////////

	  // function transformAndDeliverArray (array) {
	  // 	return new Promise((resolve, reject) => {

	  // 		// let newArray = array.map(array => {
	  // 			setTimeout(() => {
			//   		array.map(array => {
			//   			array.test = 'super good test'
			//   			array.test2 = 'super good test2'
			//   		});
	  // 				console.log("2 second wait is over")
	  // 			}, 2000)

	  // 		// resolve(newArray);
	  // 		resolve(array);

	  // 	});
	  // }

	  // transformAndDeliverArray(onlyResultsWVids)
	  // 	.then((result) => console.log(result));
	  // 	// .then((result) => {
	  // 	// 	result.map(array => {
	  // 	// 		array.test = 'super good test'
	  // 	// 		array.test2 = 'super good test2'
	  // 	// 	})
	  // 	// })

////////////////////////// async/await playground

		// let apiUrl = "https://gist.githubusercontent.com/mbostock/ddc6d50c313ebe6edb45519f43358c6c/raw/c443ed14c34c5c1b544949a546dd9d0acd05bad3/temperatures.csv";

		// function passPromise(thingHere) {
		// 	// console.log("\n \n check this: \n");
		// 	// console.log(thingHere);
		// 	return new Promise((resolve, reject) => {
		// 		resolve(thingHere);

		// 	})
		// }

		// fetchApi()
		// 	.then(results => console.log(results))
		// 	// .catch(err => console.error("\n Yo! This is an ERROR, boiiii !!! \n"));
		// 	.catch(err => console.error(err));

		// async function fetchApi() {
		// 	let fetchingApi = await fetch(apiUrl);
		// 	// let consoleLogPromise = await passPromise(fetchingApi);
		// 	let consoleLogPromise = await Promise.resolve(fetchingApi);
		// 	let typeOfThing = await typeof consoleLogPromise;
		// 	// let typeOfThing = await console.log("\n typeOfThing is a(n): \n", typeof consoleLogPromise);
		// 	return {
		// 		originalObject: consoleLogPromise,
		// 		theTypeIs: typeOfThing
		// 	}



			// fetch(apiUrl)
			// 	.then(response => {
			// 		console.log(response)
			// 		return new Promise((resolve, reject) => {
			// 			resolve(response);
			// 		})
			// 	})
			// 	.then(newResponse => console.log("\n newResponse is a(n): \n", typeof newResponse));
			// 	.catch((err) => console.error("\n Yo! This is an ERROR, boiiii !!! \n"));
		// }

		// fetchApi();

//////////////////////////

			var onlyResultsWVidsPromises = onlyResultsWVids.map(x => {
				// use this concept somehow: 
				// const VOLUME_THRESHOLD = -50; // volume threshold

				let vidFile = path.join(slidesRelsFolder, "..", x.vidLocation);
				var promiseResolve = 'placeholder';

				function getMeanVolume(videoFile, callback) {
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
					      return callback(meanVolume, maxVolume);
					    } else {
					    	// console.log("\nmeanVolumeRegex and maxVolumeRegex do not exist. Callback will be set to false\n")
					      return callback(false);
					    }
				 		})
					 	.saveToFile('/dev/null');

				 	return new Promise((resolve, reject) => {
				 			resolve(promiseResolve);
				 	});
				}

				let arrayWithAudioInfo = getMeanVolume(vidFile, function(meanVolume, maxVolume) {

					x.meanVolume = meanVolume;
					x.maxVolume = maxVolume;
				  // console.log(x);
				  promiseResolve = Promise.resolve(x);
				  console.log(promiseResolve);

				});

				  // console.log(Promise.resolve(x));
				  
			  // console.log(arrayWithAudioInfo);
			  arrayWithAudioInfo
			  	.then(result => console.log(result));
			  	// .then(console.log("...do nothing"));

				///////////////////////
			  // function multiply(num) {
			  // 	return num * 2;
			  // }

			  // let testFunction = multiply(4);
			  // console.log(testFunction);
				///////////////////////

			}); // onlyResultsWVidsPromises: end of .map function

//////////////////////////////////

			// console.log(onlyResultsWVidsPromises);

			// Promise.all(onlyResultsWVidsPromises)
			// 	.then(responses => {
			// 		// console.log(responses);
			// 	});

	/////////////////////////////

			// figure out asynchronous coding
			// fix for singular
			// Log how many slides have videos
			// console.log("\n", arrayWithVidInfo.length + " slides contain videos:", "\n");
			
///////////////////////////// below is an old method of logging sorted results...

			// function logResults () {

			// 	resultsList.sort(function(a, b) {
			// 	 return b.hasVideo - a.hasVideo || a.hasVidPlusRepeatCountIndefinite - b.hasVidPlusRepeatCountIndefinite || a.slide - b.slide;					
			// 	})

			// 	console.log(resultsList);
			// }

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
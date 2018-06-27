
const fs = require('fs');
const decompress = require('decompress');

var target = process.argv[2]
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

// console.log("pptHelperDir: ", pptHelperDir);

/////////////////////////

// Make zip file
// fs.copyFile(target, pptHelperDir + "/" + copy, (err) => {
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


		// var promise = locateVideos(PPTFolder);

		// promise.then(function(data) {
		// 	console.log(data);
		// });



	});

});




function locateVideos(PPTFolder) {
	// return new Promise(function(resolve, reject) {

		var slidesFolder = `${PPTFolder}/ppt/slides`;
		var resultsList = [];
		console.log("======================");

		fs.readdir(slidesFolder, (err, entries) => {

			entries.forEach((file) => {

				if (file.split('.').pop() === 'xml') {

					var xmlfile = `${PPTFolder}/ppt/slides/${file}`

					fs.readFile(xmlfile, function (err, data) {
						if (err) throw err;

						var fileContents = data.toString('utf8');	
						var currentSlide = file.split('.').shift().split("slide").pop();

						if (fileContents.indexOf('<p:video>') >= 0) {
							// old-school console log below
							// console.log(file.split('.').shift(), "- contains a video");

							resultsList.push({
								"slide": parseInt(currentSlide),
								"hasVideo": true
							});

						} else {
							// old-school console logs below
							// console.log(file.split('.').shift());
							// console.log("--------------");

							resultsList.push({
								"slide": parseInt(currentSlide),
								"hasVideo": false
							});

						}

					}); // fs.readFile (for xmlfile) callback

				} // "if xml" callback

			}); // entries.forEach callback

			function logResults () {

				resultsList.sort(function(a, b) {
				 return b.hasVideo - a.hasVideo || a.slide - b.slide;					
				})

				console.log(resultsList);
			}

			setTimeout(logResults, 4000);

		}); // fs.readdir callback

	// }); // promise callback

} // locateVideos function callback


/////////////////

		// console.log(resultsList);

		// console.log(resultsList.sort(function(a, b) {
		// 	if (a.slide > b.slide) {
		// 		return 1;
		// 	} else if (a.slide < b.slide) {
		// 		return -1;
		// 	} else { return 0; }
		// }));



/////////////

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
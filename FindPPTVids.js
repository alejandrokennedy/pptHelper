const fs = require('fs');
const decompress = require('decompress');

var target = process.argv[2]
var copy = target.split(".").shift() + "_copy.zip";
var PPTFolder;
var FindPPTVidsDirectory;

/////////////////////////

// work through this tutorial before trying to work in a folder besides the project's root folder: http://www.monitis.com/blog/6-node-js-recipes-working-with-the-file-system/

// console.log(copy);

// // uncomment after getting extraneous files to be created here
// fs.mkdir("FindPPTVidsDirectory", function(err) {
// 	if (err) {
// 		console.log("failed to create FindPPTVidsDirectory")
// 	} else {
// 		console.log("successfully created FindPPTVidsDirectory");
// 	}
// });

// console.log("FindPPTVidsDirectory: ", FindPPTVidsDirectory);

/////////////////////////

// Make zip file
fs.copyFile(target, copy, (err) => {
	if (err) throw err;
	console.log(target, " was copied to ", copy);

	// Unzip file
	decompress(copy, copy.split('.').shift()).then((files, err) => {
		// check to make sure decompress module has this error reporting capability
		if (err) throw err;
		PPTFolder = copy.split('.').shift();
		console.log(copy, " was unzipped to create ", PPTFolder);
		locateVideos(PPTFolder);
	});

});

function locateVideos(PPTFolder) {
	var slidesFolder = `${PPTFolder}/ppt/slides`;
	console.log("======================");

	fs.readdir(slidesFolder, (err, entries) => {

		entries.forEach((file) => {

			if (file.split('.').pop() == 'xml') {

				var xmlfile = `${PPTFolder}/ppt/slides/${file}`

				fs.readFile(xmlfile, function (err, data) {
					if (err) throw err;

					var fileContents = data.toString('utf8');

					if (fileContents.indexOf('<p:video>') >= 0) {
						console.log(file.split('.').shift(), "contains a video");
					} else {
						console.log("-------------------------------", file.split('.').shift(), "- no video")
					}

					// console.log(fileContents);
				});
			}

		});

	});
}

// function buildTree(startPath) {
// 	fs.readdir(startPath, (err, entries) => {
// 		console.log(entries);
// 		entries.forEach((file) => {
// 			const path = `${startPath}/${file}`;

// 			// console.log(path);

// 			if (fs.lstatSync(path).isDirectory()) {
// 				buildTree(path);
// 			}
// 		})
// 	});
// }

// // buildTree(PPTFolder);
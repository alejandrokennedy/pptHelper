const fs = require('fs');
const decompress = require('decompress');

// in-progress attempt to unzip file
// const zlib = require('zlib');


// zlib.gunzip(PPTFolder, function(err, result) {
//     if(err) return console.error(err);

//     console.log(result);
// });

/////////////////////////

var target = process.argv[2]
var copy = target.split(".").shift() + "_copy.zip";

fs.copyFile(target, copy, (err) => {
  if (err) throw err;
  console.log(target, " was copied to ", copy);
});

var PPTFolder = decompress(copy, 'dist').then(files => {
    console.log('done!');
});

/////////////////////////

// change this assignment once I'm able to unzip files
// var PPTFolder = process.argv[2]
// var PPTFolder = copy



function locateVideos(PPTFolder) {

	var slidesFolder = `${PPTFolder}/ppt/slides`;
	console.log("-------------------");
	console.log("in ", PPTFolder.split('/').pop(), "...");

	fs.readdir(slidesFolder, (err, entries) => {
		// console.log(entries);

		entries.forEach((file) => {


				// // fs.readFile( '\'' + file + '\'', function (err, data) {
				// fs.readFile(file, function (err, data) {
				// // fs.readFile(`file`, function (err, data) {
				// // fs.readFile('/slide1.xml', function (err, data) {
				// 	if (err) throw err;
				// console.log(data.toString('utf8'));
				// });


			// console.log(file);

			if (file.split('.').pop() == 'xml') {

				var xmlfile = `${PPTFolder}/ppt/slides/${file}`

				fs.readFile(xmlfile, function (err, data) {
					if (err) throw err;

					var fileContents = data.toString('utf8');


					// if (fileContents.indexOf('\<p:video\>') >= 0) {
					if (fileContents.indexOf('<p:video>') >= 0) {
						// console.log("--------------");
						// console.log(data.toString('utf8'));

						console.log(file.split('.').shift(), "contains a video");
					}

					// console.log(fileContents);
					// console.log("===============");
				});
			}

		});

	});
}



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

// buildTree(PPTFolder);
locateVideos(PPTFolder);
# pptHelper

A node.js script that identifies embeded videos in Microsoft PowerPoint presentations and logs which slides contain them. Soon, it will also log whether the videos have audio, and how loud that audio is.

## Getting Started

### Prerequisites

You must have [node.js](https://nodejs.org/en/) installed. If you're using OS X, you can install node using [brew](https://brew.sh/):
```
brew install node
```
[Here](https://medium.com/@kkostov/how-to-install-node-and-npm-on-macos-using-homebrew-708e2c3877bd) are more detailed instructions for installing node.

### Installation

Clone or download pptHelper using the "Clone or download" button on the [project home page](https://github.com/alejandrokennedy/pptHelper).

### Instructions for use

2. In OS X, open a Terminal window and navigate to the project folder (pptHelper)

3. Type "node pptHelper.js [path-and-name-of-ppt-file.ppt]", replacing [path-and-name-of-ppt-file.ppt] with the path and name of your PowerPoint file. For example:

```
$ node pptHelper.js /Users/JohnDoe/Documents/Presentation.ppt
```

4. Read the resulting console logs. Slides that have videos in them will read
```
"hasVideo: true"
```
Videos that are not set to repeat (play only once, and as such are probably not gifs or animated logos) will read
```
repeatCountIndefinite: false".
```

##
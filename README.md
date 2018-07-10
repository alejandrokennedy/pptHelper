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

### Usage

1. In OS X, open a Terminal window and navigate to the project folder (pptHelper)

2. Type "node pptHelper.js [path-and-name-of-ppt-file.pptx]", replacing [path-and-name-of-ppt-file.pptx] with the path and name of your PowerPoint file. For example:
```
⋅⋅⋅$ node pptHelper.js /Users/JohnDoe/Documents/Presentation.pptx
```
3. Read the resulting console logs. Slides that have videos in them will read
```
⋅⋅⋅"hasVideo: true"
```
⋅⋅⋅Videos that are not set to repeat (play only once, and as such are probably not gifs or animated logos) will read
```
⋅⋅⋅repeatCountIndefinite: false".
```

## Example Output

```
======================
/Users/JohnDoe/Documents/Presentation.pptx 
 ...was copied to... 
 /Users/JohnDoe/Documents/Presentation.ppt_copy.zip

 /Users/JohnDoe/Documents/Presentation.ppt_copy.zip 
 ...was unzipped to create... 
 /Users/JohnDoe/Documents/Presentation.ppt_copy
======================
[ { slide: 19, hasVideo: true, repeatCountIndefinite: false },
  { slide: 87, hasVideo: true, repeatCountIndefinite: false },
  { slide: 104, hasVideo: true, repeatCountIndefinite: false },
  { slide: 124, hasVideo: true, repeatCountIndefinite: false },
  { slide: 125, hasVideo: true, repeatCountIndefinite: false },
  { slide: 126, hasVideo: true, repeatCountIndefinite: false },
  { slide: 127, hasVideo: true, repeatCountIndefinite: false },
  { slide: 128, hasVideo: true, repeatCountIndefinite: false },
  { slide: 129, hasVideo: true, repeatCountIndefinite: false },
  { slide: 130, hasVideo: true, repeatCountIndefinite: false },
  { slide: 141, hasVideo: true, repeatCountIndefinite: false },
  { slide: 144, hasVideo: true, repeatCountIndefinite: false },
  { slide: 145, hasVideo: true, repeatCountIndefinite: false },
  { slide: 172, hasVideo: true, repeatCountIndefinite: false },
  { slide: 177, hasVideo: true, repeatCountIndefinite: false },
  { slide: 197, hasVideo: true, repeatCountIndefinite: false },
  { slide: 8, hasVideo: true, repeatCountIndefinite: true },
  { slide: 28, hasVideo: true, repeatCountIndefinite: true },
  { slide: 85, hasVideo: true, repeatCountIndefinite: true },
  { slide: 101, hasVideo: true, repeatCountIndefinite: true },
  { slide: 133, hasVideo: true, repeatCountIndefinite: true },
  { slide: 151, hasVideo: true, repeatCountIndefinite: true },
  { slide: 164, hasVideo: true, repeatCountIndefinite: true },
  { slide: 179, hasVideo: true, repeatCountIndefinite: true },
  { slide: 198, hasVideo: true, repeatCountIndefinite: true },
  { slide: 1, hasVideo: false, repeatCountIndefinite: false },
  { slide: 2, hasVideo: false, repeatCountIndefinite: false },
  { slide: 3, hasVideo: false, repeatCountIndefinite: false },
  { slide: 4, hasVideo: false, repeatCountIndefinite: false },
  { slide: 5, hasVideo: false, repeatCountIndefinite: false },
  { slide: 6, hasVideo: false, repeatCountIndefinite: false },
  { slide: 7, hasVideo: false, repeatCountIndefinite: false },
  { slide: 9, hasVideo: false, repeatCountIndefinite: false },
  { slide: 10, hasVideo: false, repeatCountIndefinite: false },
  { slide: 11, hasVideo: false, repeatCountIndefinite: false },
  { slide: 12, hasVideo: false, repeatCountIndefinite: false },
  { slide: 13, hasVideo: false, repeatCountIndefinite: false },
  { slide: 14, hasVideo: false, repeatCountIndefinite: false },
  { slide: 15, hasVideo: false, repeatCountIndefinite: false },
  { slide: 16, hasVideo: false, repeatCountIndefinite: false },
  { slide: 17, hasVideo: false, repeatCountIndefinite: false },
  { slide: 18, hasVideo: false, repeatCountIndefinite: false },
  { slide: 20, hasVideo: false, repeatCountIndefinite: false },
  { slide: 21, hasVideo: false, repeatCountIndefinite: false },
  { slide: 22, hasVideo: false, repeatCountIndefinite: false },
  { slide: 23, hasVideo: false, repeatCountIndefinite: false },
  { slide: 24, hasVideo: false, repeatCountIndefinite: false },
  { slide: 25, hasVideo: false, repeatCountIndefinite: false },
  { slide: 26, hasVideo: false, repeatCountIndefinite: false },
  { slide: 27, hasVideo: false, repeatCountIndefinite: false },
  { slide: 29, hasVideo: false, repeatCountIndefinite: false },
  { slide: 30, hasVideo: false, repeatCountIndefinite: false },
  { slide: 31, hasVideo: false, repeatCountIndefinite: false },
  { slide: 32, hasVideo: false, repeatCountIndefinite: false },
  { slide: 33, hasVideo: false, repeatCountIndefinite: false },
  { slide: 34, hasVideo: false, repeatCountIndefinite: false },
  { slide: 35, hasVideo: false, repeatCountIndefinite: false },
  { slide: 36, hasVideo: false, repeatCountIndefinite: false },
  { slide: 37, hasVideo: false, repeatCountIndefinite: false },
  { slide: 38, hasVideo: false, repeatCountIndefinite: false },
  { slide: 39, hasVideo: false, repeatCountIndefinite: false },
  { slide: 40, hasVideo: false, repeatCountIndefinite: false },
  { slide: 41, hasVideo: false, repeatCountIndefinite: false },
  { slide: 42, hasVideo: false, repeatCountIndefinite: false },
  { slide: 43, hasVideo: false, repeatCountIndefinite: false },
  { slide: 44, hasVideo: false, repeatCountIndefinite: false },
  { slide: 45, hasVideo: false, repeatCountIndefinite: false },
  { slide: 46, hasVideo: false, repeatCountIndefinite: false },
  { slide: 47, hasVideo: false, repeatCountIndefinite: false },
  { slide: 48, hasVideo: false, repeatCountIndefinite: false },
  { slide: 49, hasVideo: false, repeatCountIndefinite: false },
  { slide: 50, hasVideo: false, repeatCountIndefinite: false },
  { slide: 51, hasVideo: false, repeatCountIndefinite: false },
  { slide: 52, hasVideo: false, repeatCountIndefinite: false },
  { slide: 53, hasVideo: false, repeatCountIndefinite: false },
  { slide: 54, hasVideo: false, repeatCountIndefinite: false },
  { slide: 55, hasVideo: false, repeatCountIndefinite: false },
  { slide: 56, hasVideo: false, repeatCountIndefinite: false },
  { slide: 57, hasVideo: false, repeatCountIndefinite: false },
  { slide: 58, hasVideo: false, repeatCountIndefinite: false },
  { slide: 59, hasVideo: false, repeatCountIndefinite: false },
  { slide: 60, hasVideo: false, repeatCountIndefinite: false },
  { slide: 61, hasVideo: false, repeatCountIndefinite: false },
  { slide: 62, hasVideo: false, repeatCountIndefinite: false },
  { slide: 63, hasVideo: false, repeatCountIndefinite: false },
  { slide: 64, hasVideo: false, repeatCountIndefinite: false },
  { slide: 65, hasVideo: false, repeatCountIndefinite: false },
  { slide: 66, hasVideo: false, repeatCountIndefinite: false },
  { slide: 67, hasVideo: false, repeatCountIndefinite: false },
  { slide: 68, hasVideo: false, repeatCountIndefinite: false },
  { slide: 69, hasVideo: false, repeatCountIndefinite: false },
  { slide: 70, hasVideo: false, repeatCountIndefinite: false },
  { slide: 71, hasVideo: false, repeatCountIndefinite: false },
  { slide: 72, hasVideo: false, repeatCountIndefinite: false },
  { slide: 73, hasVideo: false, repeatCountIndefinite: false },
  { slide: 74, hasVideo: false, repeatCountIndefinite: false },
  { slide: 75, hasVideo: false, repeatCountIndefinite: false },
  { slide: 76, hasVideo: false, repeatCountIndefinite: false },
  { slide: 77, hasVideo: false, repeatCountIndefinite: false },
  { slide: 78, hasVideo: false, repeatCountIndefinite: false },
  ... 98 more items ]
  ```
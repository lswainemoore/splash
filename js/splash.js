
//returns index in data given with variable I, height variable J, and width W
function getIndex (i,j,w) {
  return (j * 4) * w + i * 4;
}

// basic bitmap of my name
function loadName() {

  var name = [
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
    0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
    0,1,1,0,0,0,0,0,0,1,0,1,1,0,0,0,1,1,1,0,0,1,1,0,0,1,1,0,1,0,1,1,0,0,
    0,1,1,0,0,0,1,1,0,1,1,0,1,1,0,1,1,0,0,0,1,0,0,1,0,1,1,0,1,1,0,1,1,0,
    0,1,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,0,0,1,0,0,1,0,1,1,0,1,1,0,1,1,0,
    0,1,1,1,1,0,1,1,0,1,1,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,0,1,1,0,1,1,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
  ];

  var name_width = 34;
  var name_height = 8;

  name_2d = [];
  for (i = 0; i < name_width; i++) {
    name_2d[i] = []
    for (j = 0; j < name_height; j++) {
      name_2d[i][j] = name[i + j * name_width];
    }
  }
  return name_2d;

}

// factor must be an integer greater than 1
function scale(original, factor) {

  var scaled = []
  for (var i = 0; i < factor * original.length; i++) {
    scaled[i] = [];
    for (var j = 0; j < factor * original[0].length; j++) {
      scaled[i][j] = 0;
    }
  }
  for (var i = 0; i < original.length; i++) {
    for (var j = 0; j < original[0].length; j++) {
      for (var fi = 0; fi < factor; fi++) {
        for (var fj = 0; fj < factor; fj++) {
          scaled[i*factor + fi][j*factor + fj] = original[i][j];
        }
      }
    }
  }

  return scaled;

}

var scaledName = scale(loadName(), 3);

var params = {
  color: {
    r: 0,
    g: 110,
    b: 207
  },
  onAlpha: 105,
  offAlpha: 150,
  onNoise: 100,
  offNoise: 100
};

// http://jsfiddle.net/guffa/tvt5k/
// http://stackoverflow.com/questions/20160827/when-generating-normally-distributed-random-values-what-is-the-most-efficient-w
function generateNormal() {
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function pickColors(numSquaresH, numSquaresV) {
  var colors = new Float32Array(numSquaresH * numSquaresV * 4);

  for (i = 0; i < numSquaresH; i++) {
    for (j = 0; j < numSquaresV; j++) {
      var index = getIndex(i, j, numSquaresH);

      if ( i < scaledName.length && j < scaledName[0].length && scaledName[i][j] == 1) {
        colors[index] = params.color.r;
        colors[index + 1] = params.color.g;
        colors[index + 2] = params.color.b;
        colors[index + 3] = params.onAlpha + params.onNoise * generateNormal();
      }

      else {
        colors[index] = params.color.r;
        colors[index + 1] = params.color.g;
        colors[index + 2] = params.color.b;
        colors[index + 3] = params.offAlpha + params.offNoise * generateNormal();
      }
    }
  }
  return colors;
}

function assignColors(x, y, squareLength, numSquaresH, colors, imoutData) {
  for (i = 0; i < x; i++) {
    for (j = 0; j < y; j++) {
      var index = getIndex(i,j,x);

      var iBox = Math.floor(i / squareLength);
      var jBox = Math.floor(j / squareLength);

      var indexBox = getIndex(iBox, jBox, numSquaresH);

      imoutData.data[index] = colors[indexBox]
      imoutData.data[index + 1] = colors[indexBox + 1];
      imoutData.data[index + 2] = colors[indexBox + 2];
      imoutData.data[index + 3] = colors[indexBox + 3];

    }
  }
}

function drawSquares(numSquaresH, numSquaresV, colors, squareLength, myCanvasContext) {
  // console.log(numSquaresV);

  for (i = 0; i < numSquaresH; i++) {
    for (j = 0; j < numSquaresV; j++) {
      var index = getIndex(i, j, numSquaresH);

      var r = colors[index];
      var g = colors[index + 1];
      var b = colors[index + 2];
      var alpha = Math.round(colors[index + 3] / 255. * 100) / 100.;
      var rgba = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";

      myCanvasContext.fillStyle = rgba;
      myCanvasContext.fillRect(i * squareLength, j * squareLength, squareLength, squareLength);
    }
  }
}

// adapted from http://stackoverflow.com/questions/3914203/javascript-filter-image-color
function drawCanvas(){

  var numSquaresH = scaledName.length;

  // create a new canvas element
  // var myCanvas = document.createElement("canvas");
  var myCanvas = document.getElementById("squares");
  var myCanvasContext = myCanvas.getContext("2d");

  // http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

  myCanvas.width = x;
  myCanvas.height = y;

  var squareLength = x / numSquaresH;
  var numSquaresV = Math.max(Math.ceil(y / squareLength));

  var colors = pickColors(numSquaresH, numSquaresV);

  myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
  drawSquares(numSquaresH, numSquaresV, colors, squareLength, myCanvasContext);

  // var imoutData = myCanvasContext.createImageData(x,y);

  // assignColors(x, y, squareLength, numSquaresH, colors, imoutData);

  // myCanvasContext.putImageData(imoutData, 0, 0);

  colors = undefined;
  imoutData = undefined;

}


function drawBackground(){
	// var img = new Image();
	// img.onload = function (){
 //  		createCanvas(img,img.n,img.m);
	// }
	// var nhorizontal = document.getElementById("nhorizontal").value;
	// var nvertical = document.getElementById("nvertical").value;

	drawCanvas();




}

function toggleSettings() {
  // see https://stackoverflow.com/a/36317392
  $('.settings-tray').toggleClass('closed');
}



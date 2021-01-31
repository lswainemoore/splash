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

// http://jsfiddle.net/guffa/tvt5k/
// http://stackoverflow.com/questions/20160827/when-generating-normally-distributed-random-values-what-is-the-most-efficient-w
function generateStandardNormal() {
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function generateScaledNormal(mean, stdDev) {
  return mean + stdDev * generateStandardNormal();
}


function generateClippedNormal(mean, stdDev, lowerBound, upperBound) {
  // clip at edge and just stick the leftovers at the edge
  // this produces a funky looking distribution
  return Math.min(upperBound, Math.max(lowerBound, generateScaledNormal(mean, stdDev)));
}

function generateTruncatedNormal(mean, stdDev, lowerBound, upperBound) {
  // technically a different distribution: "truncated normal distribution"
  // reject candidates outside range until you get one.
  while (true) {
    const candidate = generateScaledNormal(mean, stdDev);
    if (candidate >= lowerBound && candidate <= upperBound) {
      return candidate;
    }
  }
}


var distributionChoices = {
  truncated: generateTruncatedNormal,
  clipped: generateClippedNormal
}
var params = {
  color: {
    r: 0,
    g: 110,
    b: 207
  },
  scale: 1,
  distributionChoice: 'truncated',
  onAlpha: .3,
  offAlpha: .6,
  onNoise: .4,
  offNoise: .4
};

var alphas = {
  on: [],
  off: []
}

var scaledName;

function pickColors(numSquaresH, numSquaresV) {
  var colors = new Float32Array(numSquaresH * numSquaresV * 4);

  for (i = 0; i < numSquaresH; i++) {
    for (j = 0; j < numSquaresV; j++) {
      var index = getIndex(i, j, numSquaresH);

      if ( i < scaledName.length && j < scaledName[0].length && scaledName[i][j] == 1) {
        colors[index] = params.color.r;
        colors[index + 1] = params.color.g;
        colors[index + 2] = params.color.b;
        colors[index + 3] = distributionChoices[params.distributionChoice](params.onAlpha, params.onNoise, 0., 1.);
        alphas['on'].push(colors[index + 3]);
      }

      else {
        colors[index] = params.color.r;
        colors[index + 1] = params.color.g;
        colors[index + 2] = params.color.b;
        colors[index + 3] = distributionChoices[params.distributionChoice](params.offAlpha, params.offNoise, 0., 1.);
        alphas['off'].push(colors[index + 3]);
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
  for (i = 0; i < numSquaresH; i++) {
    for (j = 0; j < numSquaresV; j++) {
      var index = getIndex(i, j, numSquaresH);

      var r = colors[index];
      var g = colors[index + 1];
      var b = colors[index + 2];
      var alpha = colors[index + 3];
      var rgba = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";

      myCanvasContext.fillStyle = rgba;
      myCanvasContext.fillRect(i * squareLength, j * squareLength, squareLength, squareLength);
    }
  }
}

// adapted from http://stackoverflow.com/questions/3914203/javascript-filter-image-color
function drawCanvas(){
  scaledName = scale(loadName(), params.scale);

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

  alphas['on'] = [];
  alphas['off'] = [];
  var colors = pickColors(numSquaresH, numSquaresV);

  myCanvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
  drawSquares(numSquaresH, numSquaresV, colors, squareLength, myCanvasContext);

  plotify();

  // var imoutData = myCanvasContext.createImageData(x,y);

  // assignColors(x, y, squareLength, numSquaresH, colors, imoutData);

  // myCanvasContext.putImageData(imoutData, 0, 0);

  colors = undefined;
  imoutData = undefined;

}

function plotify() {
  const width = $('.hist-wrapper').width();
  const height = Math.min(width / 4., 150.);
  const binInfo = {
    end: 1.02,  // this boundary is open
    size: 0.02,
    start: 0.
  }
  Plotly.newPlot(
    'hist',
    [
      {
        x: alphas['on'],
        name: 'text',
        type: 'histogram',
        histnorm: 'probability',
        autobinx: false,
        xbins: binInfo,
        marker: {
          color: "rgba(255, 255, 255, 1)",
          line: {
            color: "rgba(0, 0, 0, 1)",
            width: 1
          }
        }
      },
      {
        x: alphas['off'],
        name: 'background',
        type: 'histogram',
        histnorm: 'probability',
        autobinx: false,
        xbins: binInfo,
        marker: {
          color: "rgba(0, 0, 0, 1)",
          line: {
            color: "rgba(0, 0, 0, 1)",
            width: 1
          }
        }
      }
    ],
    {
      autosize: false,
      width: width,
      height: height,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      yaxis: {
        showgrid: false,
      },
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1,
        bgcolor: 'rgba(255,255,255,.5)'
      }
    },
    {
      staticPlot: true,
      // responsive: true,
    }
  )

  // attempt at better responsiveness. see: https://gist.github.com/aerispaha/63bb83208e6728188a4ee701d2b25ad5
  // var d3 = Plotly.d3;
  // var WIDTH_IN_PERCENT_OF_PARENT = 90,
  //     HEIGHT_IN_PERCENT_OF_PARENT = 100;
  // var gd3 = d3.selectAll(".responsive-plot")
  //     .style({
  //       width: WIDTH_IN_PERCENT_OF_PARENT + '%',
  //       'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

  //       height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
  //       'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
  //     });

  // var nodes_to_resize = gd3[0]; //not sure why but the goods are within a nested array
  // for (var i = 0; i < nodes_to_resize.length; i++) {
  //   Plotly.Plots.resize(nodes_to_resize[i]);
  // }
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
  $('.tray').toggleClass('closed');
  $('#chevron').toggleClass('rotate');

  // size full tray to content
  // unfortunately, seems to require specification of height
  // (rather than auto or something), in order to make
  // transform work
  const padding = 20;
  if ($('.tray').hasClass('closed')) {
    $('.tray').height('0px');
  } else {
    $(".tray").height(($("#distribution-settings-tray").height() + padding) + 'px');
  }

}

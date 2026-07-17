// see very helpful:
// - rotations/triangle meshes/perlin noise:
//   - https://www.youtube.com/watch?v=IKB1hWWedMk
//   - https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_011_PerlinNoiseTerrain/P5/sketch.js
// - bajillion articles about lighting:
//   - https://learnopengl.com/Lighting/Basic-Lighting
//   - https://www.cs.utexas.edu/~bajaj/graphics2012/cs354/lectures/lect14.pdf
//   - https://web.cs.wpi.edu/~emmanuel/courses/cs543/f13/slides/lecture06_p1.pdf
//   - http://learnwebgl.brown37.net/09_lights/lights_diffuse.html#:~:text=The%20normal%20vector%20defines%20a,to%20simulate%20a%20curved%20surface.
//   - https://paroj.github.io/gltut/Illumination/Tut11%20BlinnPhong%20Model.html
//   - https://web.cs.ucdavis.edu/~ma/ECS175_S00/Notes/0509.pdf
//   - https://www.gabrielgambetta.com/computer-graphics-from-scratch/03-light.html
//   - https://cglearn.codelight.eu/pub/computer-graphics/shading-and-lighting
//   - http://math.hws.edu/graphicsbook/c7/s2.html


const fullW = 400;  // keeping this small so it's not super taxing
const nDivs = 60;

const ambientCoeff = 1;    // this is high, i think.
const diffuseCoeff = .2;   // i'm not entirely sure this is a legit concept, but whatever.
const specularCoeff = 50;  // technically an exponent, not a coefficient

var jadeite;  // can't use createVector out here :/

var heights;
var normals;

var maxHeight;

var direction = -1;
var speed = .25;
var angle = 0;
var range = .25;

function setup() {
  createCanvas(fullW, fullW, WEBGL);

  // straight outta Martha Stewart's collection:
  // https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F34%2F2019%2F07%2F18235707%2Fjadeite-05-0911-106409_vert.jpg
  jadeite = createVector(130,190,134);

  // generate heights
  heights = [];
  maxHeight = 0;
  // <= b/c need heights at edges too!
  for (var i = 0; i <= nDivs; i++) {
    heights.push([]);
    for (var j = 0; j <= nDivs; j++) {
      height = generateHeight(i * fullW / nDivs, j * fullW / nDivs);
      if (height > maxHeight) {
        maxHeight = height;
      }
      heights[i].push(height);
    }
  }

  // generate normals (one for each triangle)
  // note that = is gone, because we're using edges, not points now.
  normals = [];
  for (var i = 0; i < nDivs; i++) {
    normals.push([]);
    for (var j = 0; j < nDivs; j++) {

      let tNormals = [];
      let p = createVector(i, j, heights[i][j]);
      let edge1 = p5.Vector.sub(
        createVector(i + 1, j, heights[i + 1][j]),
        p
      );
      let edge2 = p5.Vector.sub(
        createVector(i, j + 1, heights[i][j + 1]),
        p
      );
      let normal = p5.Vector.cross(edge1, edge2);
      normal.normalize();

      tNormals.push(normal);

      let p2 = createVector(i + 1, j + 1, heights[i + 1][j + 1]);
      let edge3 = p5.Vector.sub(
        createVector(i + 1, j, heights[i + 1][j]),
        p2
      );
      let edge4 = p5.Vector.sub(
        createVector(i, j + 1, heights[i][j + 1]),
        p2
      );
      let normal2 = p5.Vector.cross(edge4, edge3);
      normal2.normalize();

      tNormals.push(normal2);

      normals[i].push(tNormals);
    }
  }

  frameRate(15);
  // noLoop();
}


function generateHeight(x, y) {
  // return 0;
  // return random()*3;
  // janky hard-coded variables
  // why are we scaling down then back up?
  // short answer is that it generates different kinds of variation
  // increasing "scale" makes it much noisier point to point
  // but decreasing it makes gradients harder to distinguish, so we beef them up.
  // it's like how 2f(x) != f(2x) for non-linear functions.
  var scale = .002;
  return noise(x * scale, y * scale)*700;
}


function getCamera() {
  // not true after rotation, but :shrug:
  return createVector(0, 0, 1);
}

function getLightSource() {
  var c = p5.Vector.sub(
    // createVector(fullW/2., fullW/2., 800),
    createVector(mouseX, mouseY, 800),  // swap these and turn on looping to change light angle
    createVector(fullW/2., fullW/2., 0)
  );
  c.normalize();
  return c;
}

function ambient() {
  return ambientCoeff;
}

function diffuse(normal) {
  return Math.max(p5.Vector.dot(normal, getLightSource()), 0.) * diffuseCoeff;
}

function specular(normal) {
  return 0;  // for now.
  // Blinn-Phong
  var h = p5.Vector.add(getCamera(), getLightSource());
  h.normalize();
  return Math.max(Math.pow(Math.max(p5.Vector.dot(h, normal), 0), specularCoeff), 0);
}

function makeColor(normal) {
  var mods = ambient() + diffuse(normal) +  specular(normal);
  var c = p5.Vector.mult(jadeite, mods);
  var cStr = 'rgba(' + Math.min(Math.round(c.x), 255) + ',' + Math.min(Math.round(c.y), 255) + ',' + Math.min(Math.round(c.z), 255) + ',1)';
  return color(cStr);
}

function addVertex(x, y, z) {
  var scale = fullW / nDivs;
  vertex(x * scale, y * scale, z);
}


function draw() {

  clear();

  rotateX(-radians(angle))
  rotateY(radians(angle))
  rotateZ(-radians(angle))

  translate(-fullW / 2, -fullW /2, -maxHeight );

  if (Math.abs(angle) > range) {
    direction = -1 * direction;
  }
  angle += speed * direction;

  var camera = getCamera();
  beginShape(TRIANGLES);
  for (var i = 0; i < nDivs; i++) {
    for (var j = 0; j < nDivs; j++) {
      noStroke();

      let c = makeColor(normals[i][j][0]);
      let c2 = makeColor(normals[i][j][1]);

      fill(c);
      addVertex(i, j, heights[i][j]);
      addVertex(i + 1, j, heights[i + 1][j]);
      addVertex(i, j + 1, heights[i][j + 1]);

      fill(c2);
      addVertex(i + 1, j, heights[i + 1][j]);
      addVertex(i, j + 1, heights[i][j + 1]);
      addVertex(i + 1, j + 1, heights[i + 1][j + 1]);
    }

    // normal vectors, sort of (it's hard to get them to come from right origin)
    // for (var j = 0; j < nDivs; j++) {
    //   // noStroke();
    //   var base = createVector((i +.5) * fullW / nDivs, (j + .5) * fullW / nDivs, heights[i][j]);
    //   var end  = p5.Vector.add(base, p5.Vector.mult(normals[i][j][0], 30));
    //   var end2 = p5.Vector.add(base, p5.Vector.mult(normals[i][j][1], 30));

    //   line(base.x, base.y, base.z, end.x, end.y, end.z);
    //   line(base.x, base.y, base.z, end2.x, end2.y, end2.z);
    // }
  }
  endShape();

  translate(fullW / 2, fullW / 2, maxHeight );  // need to translate back before setting controls
  orbitControl();

}

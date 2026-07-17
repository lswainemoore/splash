let polygons;
let lines;
const fullW = 800;
const depth = 9;
const spacing = 8;

function setup() {
  createCanvas(fullW, fullW);

  lines = [];

  var origin = p(0, 0);
  var initialPol = new Polygon([
    p(origin.x, origin.y),
    p(origin.x + fullW, origin.y),
    p(origin.x + fullW, origin.y + fullW),
    p(origin.x, origin.y + fullW)
  ]);

  // var initialPol = new Polygon([
  //   p(origin.x, origin.y),
  //   p(origin.x + 200, origin.y + 20),
  //   p(origin.x + 300, origin.y + 250),
  //   p(origin.x + 50, origin.y + 300)
  // ])
  polygons = subPolys(initialPol, depth);
  // background('blue');
  noLoop();
}

function p(x, y) {
  return createVector(x, y);
}

class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
}
function l(p1, p2) {
  return new Line(p1, p2);
}

class Polygon {
  constructor(vertices) {
    this.vertices = vertices;
  }

  draw() {
    // fill(255,255,255,50);
    noStroke();
    beginShape();
    this.vertices.forEach(v => {
      vertex(v.x, v.y);
    })
    endShape(CLOSE);
  }
}

function splitVerticesEven(p1, p2) {
  return p(
    (p1.x + p2.x) / 2.,
    (p1.y + p2.y) / 2.
  );
}

function distance(p1, p2) {
  return p5.Vector.sub(p2, p1).mag();
}

function truncatedNormal(mean, stdDev, min, max) {
  var val = min - 1;  // guaranteed to fail
  while (val < min || val > max) {
    val = randomGaussian(mean, stdDev);
  }
  return val;
}

function splitVerticesRandom(p1, p2, randomizer) {
  var lenAlong = distance(p1, p2) * randomizer();
  var theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);  // atan2 handles negatives better
  return p(
    p1.x + Math.cos(theta) * lenAlong,
    p1.y + Math.sin(theta) * lenAlong
  );
}
splitVerticesRandomUniform = (p1, p2) => { return splitVerticesRandom(p1, p2, Math.random) }
splitVerticesRandomNormal = (p1, p2) => {
  return splitVerticesRandom(
    p1,
    p2,
    () => truncatedNormal(.5, .1, 0, 1)
  );
}

function subPoly(poly) {
  var newVertices = [];

  for (var i = 0; i < poly.vertices.length; i++) {
    var p1 = poly.vertices[i];
    var p2 = poly.vertices[(i + 1) % poly.vertices.length];  // wrap
    newVertices.push(splitVerticesRandomNormal(p1, p2));
    // newVertices.push(splitVerticesEven(p1, p2));
  }

  return new Polygon(newVertices);
}

function subPolys(poly, levels) {

  if (levels == 0) {
    return [];
  }

  var newPoly = subPoly(poly);

  // lines
  for (var i = 0; i < newPoly.vertices.length; i++) {
    var p1 = newPoly.vertices[i];                                  // new polygon vertex
    var p2 = newPoly.vertices[(i + 1) % newPoly.vertices.length];  // new polygon next vertex (wrapped)
    var q = poly.vertices[(i + 1) % newPoly.vertices.length];      // old polygon vertex in between

    // construct our "radiating" lines that are parellel to this new polygon edge (as many as we need).
    // unfortunately, i think this is basically impossible to understand without drawing,
    // but the gist is that we're constructing the two endpoints of a line that is parellel to
    // the relevant edge of newPoly, but shorter because it intersects the edges of the containing poly.
    // the trickiest bit of this is that we're trying to produce lines that are evenly spaced.
    // it would be easier to iterate in the x or y direction, and convert to the other, but that would produce
    // different spacings between lines for different edge angles (i think).

    // angles between edges of old containing poly and newPolygon, on either side
    var theta = p5.Vector.sub(q, p1).angleBetween(p5.Vector.sub(p2, p1));
    var rho = p5.Vector.sub(q, p2).angleBetween(p5.Vector.sub(p1, p2));

    var currentSpacing = spacing;
    while (true) {
      var thetaEdgeLen = currentSpacing / Math.sin(theta);                   // length
      var p1_prime = p5.Vector.add(p1, p5.Vector.sub(q, p1).copy().normalize().mult(thetaEdgeLen));

      var rhoEdgeLen = currentSpacing / Math.sin(rho);
      var p2_prime = p5.Vector.add(p2, p5.Vector.sub(p2, q).copy().normalize().mult(rhoEdgeLen));

      // this is where we hit the corner
      // i'm pretty sure it's fine to do this only for theta, breaking condition should be same for rho.
      if (thetaEdgeLen >= p5.Vector.sub(q, p1).mag()) {
        break;
      }

      lines.push(l(p1_prime, p2_prime));

      currentSpacing += spacing;
    }
  }

  var subSubs = subPolys(newPoly, levels - 1);
  subSubs.push(poly);
  return subSubs;
}


function draw() {
  // clear();
  // background('blue');
  // polygons.reverse().forEach((pol, i) => {
  //   pol.draw();
  // });

  lines.forEach(li => {
    stroke('blue');
    line(li.p1.x, li.p1.y, li.p2.x, li.p2.y);
  });
}

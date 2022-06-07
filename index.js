class Point {
  #x = null;
  #y = null;
  #name = '';

  constructor(x, y, name) {
    this.#x = x
    this.#y = y
    this.#name = name
  }

  get getX() {
    return this.#x;
  }

  get getY() {
    return this.#y;
  }

  get getName() {
    return this.#name;
  }
}

class Line {
  #point1 = null;
  #point2 = null;

  constructor(point1, point2) {
    this.#point1 = point1;
    this.#point2 = point2;
  }

  get getLine() {
    return {
      start: this.#point1,
      end: this.#point2,
    }
  }

  get getStartPoint() {
    return this.#point1;
  }

  get getEndPoint() {
    return this.#point2;
  }
}

function getIntersectionPointByBaseAngles(point1, point2, deg1, deg2, name = '') {
  if ((point1 instanceof Point) && (point2 instanceof Point)) {
    if (!(typeof deg1 === 'number') || !(typeof deg2 === 'number')) return null;

    const degToRad = (deg = 0) => deg / 180 * Math.PI;
    const gradient1 = Math.tan(degToRad(deg1));
    const gradient2 = Math.tan(degToRad(deg2));

    if (gradient1 - gradient2 === 0) return null;

    const yAxisIntercept1 = point1.getY - point1.getX * gradient1;
    const yAxisIntercept2 = point2.getY - point2.getX * gradient2;

    const xIntercept = (yAxisIntercept1 - yAxisIntercept2) / (gradient2 - gradient1);
    const yIntercept = gradient1 * xIntercept + yAxisIntercept1;
    const interceptPoint = new Point(xIntercept, yIntercept, name);
    return interceptPoint;
  }

  return null;
};

function getGradientOfLine(line) {
  if (line instanceof Line) {
    const lineStartPoint = line.getStartPoint;
    const lineEndPoint = line.getEndPoint;
    if (lineStartPoint instanceof Point && lineEndPoint instanceof Point) {
      const rise = lineEndPoint.getY - lineStartPoint.getY;
      const run = lineEndPoint.getX - lineStartPoint.getX;
      const gradient = rise / run;
      return gradient;
    }
    return null;
  }
  return null;
}

function getGradientAndYAxisInterceptOfLine(line) {
  const gradient = getGradientOfLine(line);
  if (gradient === null) return null;

  const lineStartPoint = line.getStartPoint;
  if (lineStartPoint instanceof Point) {
    const yAxisIntercept = lineStartPoint.getY - lineStartPoint.getX * gradient;
    return { gradient, yAxisIntercept }
  } return null;
}

function getIntersectionPointByLines(line1, line2, name = '') {
  if (line1 instanceof Line && line2 instanceof Line) {
    const { gradient: m1, yAxisIntercept: c1 } = getGradientAndYAxisInterceptOfLine(line1);
    const { gradient: m2, yAxisIntercept: c2 } = getGradientAndYAxisInterceptOfLine(line2);

    const rise = c1 - c2;
    const run = m2 - m1;

    if (!run) return null;

    const xIntercept = rise / run;
    const yIntercept = m1 * xIntercept + c1;
    const interceptPoint = new Point(xIntercept, yIntercept, name);
    return interceptPoint;
  }
  return null;
}

// manually define the triangle shape, cuz automating is a whole thing...
const base = 3;
const height = 9;
const baseAngleLeft = 69;
const baseAngleRight = 180 - baseAngleLeft;

const a = new Point(0, 0, 'a');
const b = new Point(base / 3, 0, 'b');
const c = new Point(2 * base / 3, 0, 'c');
const d = new Point(base, 0, 'd');
const e = getIntersectionPointByBaseAngles(a, d, baseAngleLeft, baseAngleRight, 'e');
const f = getIntersectionPointByBaseAngles(a, d, baseAngleLeft / 2, 180 - baseAngleLeft / 2, 'f');
const g = getIntersectionPointByLines(new Line(a, f), new Line(b, e), 'g');
const h = getIntersectionPointByLines(new Line(d, f), new Line(c, e), 'h');
const i = getIntersectionPointByLines(new Line(d, f), new Line(b, e), 'i');
const j = getIntersectionPointByLines(new Line(a, f), new Line(c, e), 'j');
const helperF = new Point(f.getX - 1, f.getY, 'helperF');
const k = getIntersectionPointByLines(new Line(a, e), new Line(f, helperF), 'k')
const l = getIntersectionPointByLines(new Line(b, e), new Line(f, helperF), 'l')
const m = getIntersectionPointByLines(new Line(c, e), new Line(f, helperF), 'm')
const n = getIntersectionPointByLines(new Line(d, e), new Line(f, helperF), 'n')
const o = getIntersectionPointByLines(new Line(a, e), new Line(d, f), 'o');
const r = getIntersectionPointByLines(new Line(d, e), new Line(a, f), 'r');
const p = getIntersectionPointByLines(new Line(b, e), new Line(o, r), 'p');
const q = getIntersectionPointByLines(new Line(c, e), new Line(o, r), 'q');

const pointsGraph = {
  a: { refPoint: a, graph: new Set([k, o, e, g, f, j, r, b, c, d]), },
  b: { refPoint: b, graph: new Set([a, c, d, g, l, i, p, e]), },
  c: { refPoint: c, graph: new Set([a, b, d, h, m, j, q, e]), },
  d: { refPoint: d, graph: new Set([a, b, c, h, f, i, o, n, r, e]), },
  g: { refPoint: g, graph: new Set([a, f, j, r, b, i, l, p, e]), },
  h: { refPoint: h, graph: new Set([d, f, i, o, c, m, j, q, e]), },
  k: { refPoint: k, graph: new Set([a, o, e, l, f, m, n]), },
  l: { refPoint: l, graph: new Set([k, f, m, n, b, g, i, p, e]), },
  f: { refPoint: f, graph: new Set([a, g, j, r, d, h, i, o, k, l, m, n]), },
  m: { refPoint: m, graph: new Set([k, l, f, n, c, h, j, q, e]), },
  n: { refPoint: n, graph: new Set([k, l, f, m, d, r, e]), },
  i: { refPoint: i, graph: new Set([b, g, l, p, e, o, f, h, d]), },
  j: { refPoint: j, graph: new Set([a, g, f, r, c, h, m, q, e]), },
  o: { refPoint: o, graph: new Set([a, k, e, p, q, r, i, f, h, d]), },
  p: { refPoint: p, graph: new Set([o, q, r, e, i, l, g, b]), },
  q: { refPoint: q, graph: new Set([o, p, r, e, j, m, h, c]), },
  r: { refPoint: r, graph: new Set([a, g, f, j, d, n, e, o, p, q]), },
  e: { refPoint: e, graph: new Set([o, k, a, p, i, l, g, b, q, j, m, h, c, r, n, d]), },
}

function isTriangle(firstPoint, secondPoint, thirdPoint, pointsGraph) {
  if (firstPoint instanceof Point && secondPoint instanceof Point && thirdPoint instanceof Point) {
    const doesOneHaveOthers = pointsGraph?.[firstPoint.getName].graph.has(secondPoint) && pointsGraph?.[firstPoint.getName].graph.has(thirdPoint);
    const doesTwoHaveOthers = pointsGraph?.[secondPoint.getName].graph.has(firstPoint) && pointsGraph?.[secondPoint.getName].graph.has(thirdPoint);
    const doesThreeHaveOthers = pointsGraph?.[thirdPoint.getName].graph.has(firstPoint) && pointsGraph?.[thirdPoint.getName].graph.has(secondPoint);

    // a more careful implementation uses a Fraction class for exact enumeration. That's more than I wish to do in this moment
    const isCollinear = Math.abs(getGradientOfLine(new Line(firstPoint, secondPoint)) - getGradientOfLine(new Line(firstPoint, thirdPoint))) <= 10 ** (-6);
    return doesOneHaveOthers && doesTwoHaveOthers && doesThreeHaveOthers && !isCollinear;
  }

  return false;
};

function numberOfTriangles(pointsGraph) {
  let count = 0;
  const triangles = {};

  const keys = Object.keys(pointsGraph);

  for (const key1 of keys) {
    const firstPoint = pointsGraph[key1].refPoint;
    for (const key2 of keys) {
      if (key2 === key1) continue;
      const secondPoint = pointsGraph[key2].refPoint;
      for (const key3 of keys) {
        if (key3 === key2 || key3 === key1) continue;

        const thirdPoint = pointsGraph[key3].refPoint;
        const currentKeys = [key1, key2, key3];
        const sortedKeys = currentKeys.sort((a, b) => a < b ? -1 : 1);
        const triangleKey = sortedKeys.reduce((finKey, tempKey) => finKey + tempKey, '');

        if (triangles[triangleKey] !== undefined) continue;

        triangles[triangleKey] = isTriangle(firstPoint, secondPoint, thirdPoint, pointsGraph);
        if (triangles[triangleKey] === true) count++;
      }
    }
  }
  // const solutionsArray = Object.entries(triangles).filter(([_, value]) => value);
  // const solutionsObj = Object.fromEntries(solutionsArray);
  // console.log(solutionsObj);

  return count;
}

console.log(numberOfTriangles(pointsGraph));

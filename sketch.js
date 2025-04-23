let colors = ["#52140b", "#52140b", "#52140b", "#a90103", "#b25300", "#dba708", "#c4c550", "#008ba7", "#201214", "#201214", "#201214"];
let morphs = [];
let stay = 50;
let between = 50;
let gs;

function userStartAudio() {
  // 確保 AudioContext 在用戶手勢後啟動
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let m = min(windowWidth, windowHeight);
  gs = m * 0.075;

  for (let x = 0; x < width + gs; x += gs * 2) {
    for (let y = 0; y < height + gs; y += gs) {
      morphs.push(new morph(x, y, gs));
      morphs.push(new morph(x, y, gs * 0.5));
      morphs.push(new morph(x, y, gs * 0.25));
      morphs.push(new morph(x + gs, y - (gs * 0.5), gs));
      morphs.push(new morph(x + gs, y - (gs * 0.5), gs * 0.5));
      morphs.push(new morph(x + gs, y - (gs * 0.5), gs * 0.25));
    }
  }
}

function draw() {
  // 背景顏色隨滑鼠移動變化
  let bgBrightness = map(mouseX, 0, width, 50, 255); // 根據滑鼠 X 座標調整亮度
  background(bgBrightness);

  for (let m of morphs) {
    m.morphing();
    m.display();
  }
}

function mousePressed() {
  userStartAudio(); // 在用戶點擊時啟動 AudioContext
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布
}

class morph {
  constructor(x, y, sizew) {
    this.center = createVector(x, y);
    this.size = sizew;
    this.points = shapes(0, this.size);
    this.color = random(colors);
    this.startColor = this.color;
    this.nextColor = random(colors);
    this.startShape = shapes(random([0, 1, 2, 4]), this.size);
    this.nextShape = shapes(random([0, 1, 2, 4]), this.size);
    this.morphCount = stay;
    this.stayCount = between;
    this.morphtime = true;
  }

  display() {
    fill(this.color);
    noStroke();
    strokeWeight(this.size * 0.05);
    push();
    translate(this.center.x, this.center.y);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape(CLOSE);
    pop();
  }

  morphing() {
    if (!this.morphtime) {
      this.morphCount--;
    }
    if (this.morphCount == 0) {
      this.morphtime = true;
      this.morphCount = stay;
    }
    if (this.stayCount == 0) {
      this.morphtime = false;
      this.stayCount = between;
      this.startShape = this.nextShape;
      let shapeChooser = floor(noise(this.center.x / 10, this.center.y / 10, frameCount + this.size) * 5);
      this.nextShape = shapes(shapeChooser, this.size);
      this.startColor = this.nextColor;
      let colorChooser = floor(noise(this.center.x / 10, this.center.y / 10, frameCount + this.size) * colors.length);
      this.nextColor = colors[colorChooser];
    }
    if (this.morphtime) {
      this.stayCount--;
      let betweenPoint = map(this.stayCount, between, 0, 0, 1);
      for (let i = 0; i < this.points.length; i++) {
        this.points[i] = p5.Vector.lerp(this.startShape[i], this.nextShape[i], betweenPoint);
      }
      this.color = lerpColor(color(this.startColor), color(this.nextColor), betweenPoint);
    }
  }
}

function shapes(no, size) {
  let pts = [];
  let h = size * 0.5;
  let q = size * 0.25;
  let t = size * 0.33;
  switch (no) {
    case 0:
      pts.push(
        createVector(-h, -h),
        createVector(0, -h),
        createVector(h, -h),
        createVector(h, 0),
        createVector(h, h),
        createVector(0, h),
        createVector(-h, h),
        createVector(-h, 0)
      );
      break;
    case 1:
      pts.push(
        createVector(0, -h),
        createVector(0, -h),
        createVector(-t, h),
        createVector(h, -t * 0.5),
        createVector(-h, -t * 0.5),
        createVector(t, h),
        createVector(0, -h),
        createVector(0, -h)
      );
      break;
    case 2:
      pts.push(
        createVector(0, -h),
        createVector(t, -t),
        createVector(h, 0),
        createVector(t, t),
        createVector(0, h),
        createVector(-t, t),
        createVector(-h, 0),
        createVector(-t, -t)
      );
      break;
    case 3:
      pts.push(
        createVector(0, -h),
        createVector(t * 0.5, -t * 0.5),
        createVector(h, 0),
        createVector(t * 0.5, t * 0.5),
        createVector(0, h),
        createVector(-t * 0.5, t * 0.5),
        createVector(-h, 0),
        createVector(-t * 0.5, -t * 0.5)
      );
      break;
    case 4:
      pts.push(
        createVector(-h, -h),
        createVector(0, -q),
        createVector(h, -h),
        createVector(q, 0),
        createVector(h, h),
        createVector(0, q),
        createVector(-h, h),
        createVector(-q, 0)
      );
      break;
  }
  return pts;
}

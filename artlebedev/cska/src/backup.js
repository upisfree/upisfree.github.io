let camera;
let scene;
let renderer;
let geometry;
let mesh;
let gui = new dat.GUI();

const vertex = `
varying vec2 vUv;
varying vec3 vPosition;

void main()  {
  vUv = uv;
  vPosition = position;

  gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
uniform float time;
uniform float modConst;
uniform float resolution;
uniform vec3 replacementColorBlack;
uniform vec3 replacementColorWhite;

uniform vec3 coef1;
uniform vec3 color1;
uniform float scale1;
uniform vec3 coef2;
uniform vec3 color2;
uniform float scale2;

// vec3[4] palette;
// palette[0] = color1;
// palette[1] = color2;
// palette[1] = replacementColorBlack;
// palette[4] = replacementColorWhite;

varying vec2 vUv;
varying vec3 vPosition;

// float modConst = 289.0;
// float resolution = 1000.0;
// float scale = 0.5;

// Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / modConst)) * modConst; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / modConst)) * modConst; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float noise(vec3 P) {
    vec3 i0 = mod289(floor(P));
    vec3 i1 = mod289(i0 + vec3(1.0));
    vec3 f0 = fract(P);
    vec3 f1 = f0 - vec3(1.0);
    vec3 f = fade(f0);

    vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x);
    vec4 iy = vec4(i0.yy, i1.yy);
    vec4 iz0 = i0.zzzz;
    vec4 iz1 = i1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;

    gx0 = fract(gx0);
    gx1 = fract(gx1);

    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));

    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g0 = vec3(gx0.x, gy0.x, gz0.x);
    vec3 g1 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g2 = vec3(gx0.z, gy0.z, gz0.z);
    vec3 g3 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g4 = vec3(gx1.x, gy1.x, gz1.x);
    vec3 g5 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g6 = vec3(gx1.z, gy1.z, gz1.z);
    vec3 g7 = vec3(gx1.w, gy1.w, gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));
    vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));

    g0 *= norm0.x;
    g1 *= norm0.z;
    g2 *= norm0.y;
    g3 *= norm0.w;
    g4 *= norm1.x;
    g6 *= norm1.y;
    g5 *= norm1.z;
    g7 *= norm1.w;

    vec4 nz = mix(
      vec4(
        dot(g0, vec3(f0.x, f0.y, f0.z)),
        dot(g1, vec3(f1.x, f0.y, f0.z)),
        dot(g2, vec3(f0.x, f1.y, f0.z)),
        dot(g3, vec3(f1.x, f1.y, f0.z))
      ),
      vec4(
        dot(g4, vec3(f0.x, f0.y, f1.z)),
        dot(g5, vec3(f1.x, f0.y, f1.z)),
        dot(g6, vec3(f0.x, f1.y, f1.z)),
        dot(g7, vec3(f1.x, f1.y, f1.z))
      ),
      f.z
    );

    return resolution * mix(mix(nz.x, nz.z, f.y), mix(nz.y, nz.w, f.y), f.x);
}

float noise(vec2 P) { return noise(vec3(P, 0.0)); }

float turbulence(vec3 P) {
    float f = 0., s = 1.;
    for (int i = 0 ; i < 9 ; i++) {
        f += abs(noise(s * P)) / s;
        s *= 2.;
        P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);
    }
    return f;
}

vec3 clouds(float x, float y) {
    float L = turbulence(vec3(x, y, time * .1));
    return vec3(noise(vec3(.5, .5, L) * .7));
}

bool isBlack(vec3 c) {
  return (c.r <= 0.0 && c.g <= 0.0 && c.b <= 0.0);
}

bool isWhite(vec3 c) {
  return (c.r >= 1.0 && c.g >= 1.0 && c.b >= 1.0);
}

vec3 getColor(float scale, vec3 coef, vec3 blackReplacement, vec3 whiteReplacement) {
  vec3 noiseColor;

  float x = vPosition.x * scale * coef.x;
  float y = vPosition.y * scale * coef.y;

  noiseColor = vec3(noise(vec2(x * 21., y * 20.)));

  if (isBlack(noiseColor)) {
    noiseColor = blackReplacement;  
  } else {
    noiseColor = whiteReplacement;
  }

  // noiseColor *= color;

  return noiseColor;
}

float getDistance(vec3 a, vec3 b) {
  float dx = a.x - b.x;
  float dy = a.y - b.y;
  float dz = a.z - b.z;

  return sqrt(dx * dx + dy * dy + dz * dz);
}

vec3 getClosestColor(vec3 target) {
  vec3 closest = color1;

  // for (int i = 1; i < palette.lenght; i++) {
  //   vec3 curr = palette[i];

  //   if (getDistance(target, curr) < getDistance(target, closest)) {
  //     closest = curr;
  //   }
  // }

  if (getDistance(target, color2) < getDistance(target, closest)) {
    closest = color2;
  }

  if (getDistance(target, replacementColorBlack) < getDistance(target, closest)) {
    closest = replacementColorBlack;
  }

  if (getDistance(target, replacementColorWhite) < getDistance(target, closest)) {
    closest = replacementColorWhite;
  }

  return closest;
}

float getSum(vec3 a) {
  return a.x + a.y + a.z;
}

// vec3 cloudEffect = clouds(vPosition.x, vPosition.y);
// color = cloudEffect + vec3(.5, .8, 0.95);
// gl_FragColor = vec4(ncolor, 1.);

void main() {
  vec3 c1 = getColor(scale1, coef1, color1, replacementColorBlack);
  vec3 c2 = getColor(scale2, coef2, color1, replacementColorWhite);
  // vec3 c = c1 + c2;
  vec3 c = c1;

  // if (getSum(c1) > getSum(c2)) {
  //   c = c2;
  // } else {
  //   c = c1;
  // }

  // if (isWhite(c)) {
  //   c = c2;
  // }

  // c = getClosestColor(c);

  gl_FragColor = vec4(c, 1.0);
}
`;

const darkBlue = new THREE.Color('rgb(20, 43, 91)');
const lightBlue = new THREE.Color('rgb(26, 70, 131)');
const red = new THREE.Color('rgb(234, 35, 47)');
const white = new THREE.Color('rgb(255, 255, 255)');
const gray = new THREE.Color('rgb(168, 169, 172)');

let material1 = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    modConst: { value: 289.0 },
    resolution: { value: 100000.0 },
    replacementColorBlack: { value: red }, // цвет, на который заменяем чёрный
    replacementColorWhite: { value: lightBlue }, // цвет, на который заменяем белый
    
    scale1: { value: 0.2 },
    coef1: { value: new THREE.Vector2(1, 1) },
    color1: { value: darkBlue },
    
    scale2: { value: 0.1 },
    coef2: { value: new THREE.Vector2(1 + Math.random(), 1 + Math.random()) },
    color2: { value: lightBlue }
  },

  vertexShader: vertex,
  fragmentShader: fragment
});

let material2 = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    modConst: { value: 289.0 },
    resolution: { value: 100000.0 },
    replacementColorBlack: { value: darkBlue }, // цвет, на который заменяем чёрный
    replacementColorWhite: { value: white }, // цвет, на который заменяем белый
    
    scale1: { value: 0.1 },
    coef1: { value: new THREE.Vector2(10, 1) },
    color1: { value: lightBlue },
    
    scale2: { value: 0.35 },
    coef2: { value: new THREE.Vector2(2 + Math.random(), 1 + Math.random()) },
    color2: { value: darkBlue }
  },

  vertexShader: vertex,
  fragmentShader: fragment
});

material2.tra

console.log(material1)

// let material2 = new THREE.ShaderMaterial({
//   uniforms: {
//     time: { value: 1.0 },
//     coef: { value: new THREE.Vector2(2, 1) },
//     color: { value: new THREE.Vector3(1, 1, 0) }
//   },

//   vertexShader: vertex,
//   fragmentShader: fragment
// });

init();
initGui();
animate();

function init() {
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  camera.position.z = 1;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 1);

  geometry = new THREE.PlaneBufferGeometry(2, 2);
  // geometry = new THREE.IcosahedronGeometry(2, 4);

  mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [material1, material2]);
  // mesh = new THREE.Mesh(geometry, [material1]);
  // mesh = new THREE.Mesh(geometry, [material1, material2]);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  material1.uniforms.time.value = time * 0.00025;
  material2.uniforms.time.value = time * 0.00025;
  // mesh.material.forEach(m => m.uniforms.time.value = time * 0.00025);
  
  renderer.render(scene, camera);
}

function getRandomInt(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  return new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
}

function randomize() {
  // let mod = getRandomInt(1, 10000);
  // mod = (mod % 2 === 0) ? mod + 1 : mod;
  // material.uniforms.modConst.value = mod;

  // material.uniforms.modConst.value = getRandomInt(0, 100000);
  
  // material.uniforms.replacementColorBlack.value = getRandomColor();
  // material.uniforms.replacementColorWhite.value = getRandomColor();

  material.uniforms.scale1.value = getRandomFloat(0, 1.5);
  material.uniforms.coef1.value.x = getRandomFloat(0, 2);
  material.uniforms.coef1.value.y = getRandomFloat(0, 2);
  // material.uniforms.color1.value = getRandomColor();

  material.uniforms.scale2.value = getRandomFloat(0, 1.5);
  material.uniforms.coef2.value.x = getRandomFloat(0, 2);
  material.uniforms.coef2.value.y = getRandomFloat(0, 2);
  // material.uniforms.color2.value = getRandomColor();
}

function initGui() {
  gui.add({ randomize: randomize }, 'randomize');

  return;

  gui.add(material.uniforms.modConst, 'value', 0, 10000).name('modConst').listen();
  gui.add(material.uniforms.resolution, 'value', 0, 100000).name('resolution').listen();
  gui.addColor({ color: material.uniforms.replacementColorBlack.value.getHex() }, 'color').name('replacementColorBlack').onChange(color => material.uniforms.replacementColorBlack.value.set(color)).listen();
  gui.addColor({ color: material.uniforms.replacementColorWhite.value.getHex() }, 'color').name('replacementColorWhite').onChange(color => material.uniforms.replacementColorWhite.value.set(color)).listen();
  
  gui.add(material.uniforms.scale1, 'value', 0, 1.5, 0.0001).name('scale1').listen();
  gui.add(material.uniforms.coef1.value, 'x', 0, 2, 0.0001).name('coef1 x').listen();
  gui.add(material.uniforms.coef1.value, 'y', 0, 2, 0.0001).name('coef1 y').listen();
  gui.addColor({ color: material.uniforms.color1.value.getHex() }, 'color').name('color1').onChange(color => material.uniforms.color1.value.set(color)).listen();

  gui.add(material.uniforms.scale2, 'value', 0, 1.5, 0.0001).name('scale2').listen();
  gui.add(material.uniforms.coef2.value, 'x', 0, 2, 0.0001).name('coef2 x').listen();
  gui.add(material.uniforms.coef2.value, 'y', 0, 2, 0.0001).name('coef2 y').listen();
  gui.addColor({ color: material.uniforms.color2.value.getHex() }, 'color').name('color2').onChange(color => material.uniforms.color2.value.set(color)).listen();
}
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

uniform vec3 coef;
uniform float noiseConst;
uniform vec3 color;
uniform float scale;

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

    vec4 gx0 = ixy0 * (1.0 / noiseConst);
    vec4 gy0 = fract(floor(gx0) * (1.0 / noiseConst)) - 0.5;
    vec4 gx1 = ixy1 * (1.0 / noiseConst);
    vec4 gy1 = fract(floor(gx1) * (1.0 / noiseConst)) - 0.5;

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

vec3 getNoise(float scale, vec3 coef) {
  float x = vPosition.x * scale * coef.x;
  float y = vPosition.y * scale * coef.y;

  return vec3(noise(vec2(x * 21., y * 20.)));
}

// vec3 cloudEffect = clouds(vPosition.x, vPosition.y);
// color = cloudEffect + vec3(.5, .8, 0.95);
// gl_FragColor = vec4(ncolor, 1.);

void main() {
  vec3 c = getNoise(scale, coef);
  vec4 fragColor;

  if (isBlack(c)) {
    fragColor = vec4(color, 1.0);
  } else {
    fragColor = vec4(c, 0.0);
  }

  gl_FragColor = fragColor;
}
`;

const MIN_PLAYERS_DISTANCE = 0.65;
let playersScale = 0.35;

const darkBlue = new THREE.Color('rgb(20, 43, 91)');
const lightBlue = new THREE.Color('rgb(31, 66, 134)');
const red = new THREE.Color('rgb(237, 29, 37)');
const white = new THREE.Color('rgb(255, 255, 255)');
const gray = new THREE.Color('rgb(168, 169, 172)');

let playersTeamFolder = 'cska';
const playersBasePngUrl = './assets/png/';
const playersBaseSvgUrl = './assets/svg/';
const playersPngUrls = [
  'h-1.png',
  'h-2.png',
  'h-3.png',
  'h-4.png',
  'h-5.png',
  'h-6.png'
];

const playersSvgUrls = [
  'h-1.svg',
  'h-2.svg',
  'h-3.svg',
  'h-4.svg',
  'h-5.svg',
  'h-6.svg'
];

let players = [];
let currentPlayer;

const textures = {};
const svgs = {};

let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
camera.position.z = 1;

let scene = new THREE.Scene();
scene.background = lightBlue;

let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(2);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.PlaneBufferGeometry(2, 2);

let controls = new THREE.TransformControls(camera, renderer.domElement);
// controls.showY = false;
scene.add(controls);

let manager = new THREE.LoadingManager();
let loader = new THREE.TextureLoader(manager);
let fileLoader = new THREE.FileLoader(manager);
manager.onLoad = init;

let materials = [];
let gui = new dat.GUI();
let guiOptions = {
  randomizeColors: false,
  currentPlayerScale: 0.25
};

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

const presets = {
  'цска': {
    'background': new THREE.Color('rgb(31, 66, 134)'),
    'folder': 'cska',
    'materials': [
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },

          scale: { value: 0.2 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(20, 43, 91)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      }),

      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },
          
          scale: { value: 0.1 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(237, 29, 37)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      })
    ]
  },

  'звезда': {
    'background': new THREE.Color('rgb(30, 66, 134)'),
    'folder': 'star',
    'materials': [
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },
          
          scale: { value: 0.1 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(237, 28, 36)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      }),

      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },

          scale: { value: 0.2 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(24, 40, 95)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      }),

      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },
          
          scale: { value: 0.1 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(95, 138, 199)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      })
    ]
  },

  'красная армия': {
    'background': new THREE.Color('rgb(177, 15, 31)'),
    'folder': 'red-army',
    'materials': [
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },

          scale: { value: 0.2 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(121, 0, 14)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      }),

      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },
          
          scale: { value: 0.1 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(24, 40, 95)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      }),

      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },
          
          scale: { value: 0.1 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(237, 28, 36)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      }),

      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
          modConst: { value: 289.0 },
          resolution: { value: 100000.0 },

          scale: { value: 0.2 },
          noiseConst: { value: 7.0 },
          coef: { value: new THREE.Vector2(1, 1) },
          color: { value: new THREE.Color('rgb(121, 0, 14)') }
        },

        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
      })
    ]
  },
};

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('keypress', onKeyPress, false);
renderer.domElement.addEventListener('click', onClick, false);

animate();
load();

function addMaterial(material) {
  if (!material) {
    material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        modConst: { value: 289.0 },
        resolution: { value: 100000.0 },

        scale: { value: getRandomFloat(0.1, 0.5) },
        noiseConst: { value: 7.0 },
        coef: { value: new THREE.Vector2(getRandomFloat(0.5, 4), getRandomFloat(0.5, 4)) },
        color: { value: (Math.random() > 0.5) ? darkBlue.clone() : red.clone() }
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true
    });

    materials.push(material);
  }

  let mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'background';
  scene.add(mesh);
  materials.push(material);

  addMaterialControls(material);
}

function init() {
  initGui();

  onPresetChange('цска');

  randomizePlayers();
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  materials.forEach(m => m.uniforms.time.value = time * 0.00025);
  
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);

  if (intersects[0] && intersects[0].object.name.includes('player')) {
    currentPlayer = intersects[0].object;
  }

  renderer.render(scene, camera);
}

function load() {
  const folders = Object.values(presets).map(p => p.folder);

  playersPngUrls.forEach(filename => {
    folders.forEach(folder => {
      const f = folder + '/';

      loader.load(playersBasePngUrl + f + filename, (texture) => {
        textures[f + filename] = texture;
      });
    });
  });

  playersSvgUrls.forEach(filename => {
    folders.forEach(folder => {
      const f = folder + '/';

      fileLoader.load(playersBaseSvgUrl + f + filename, (svg) => {
        svgs[f + filename] = SVG(svg);
      });
    });
  });
}

function getRandomInt(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomFromArray(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function getRandomColor() {
  return new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
}

function randomize() {
  if (guiOptions.randomizeColors) {
    scene.background = getRandomColor();
  }

  materials.forEach(m => {
    // let mod = getRandomInt(1, 10000);
    // mod = (mod % 2 === 0) ? mod + 1 : mod;
    // m.uniforms.modConst.value = mod;

    // m.uniforms.modConst.value = getRandomInt(0, 100000);

    m.uniforms.noiseConst.value = getRandomFloat(1, 20);
    
    m.uniforms.scale.value = getRandomFloat(0.05, 0.5);
    m.uniforms.coef.value.x = getRandomFloat(0.5, 1.5);
    m.uniforms.coef.value.y = getRandomFloat(0.5, 1.5);

    if (guiOptions.randomizeColors) {
      m.uniforms.color.value = getRandomColor();      
    }
  });

  randomizePlayers();

  // onPlayerScaleChange(materials[1].uniforms.scale.value / 4);

  gui.__controllers.forEach(c => {
    c.updateDisplay();
  });
}

function randomizePlayers(count = 20) {
  controls.detach(currentPlayer);

  players.forEach(mesh => {
    scene.remove(mesh);
  });

  players.length = 0;

  for (let i = 0; i < count; i++) {
    const folderTextures = Object.values(textures).filter(t => {
      let folder = t.image.src.split('/');
      folder = folder[folder.length - 2];

      return folder === playersTeamFolder;
    });

    let randomTexture = getRandomFromArray(folderTextures);

    let geo = new THREE.PlaneBufferGeometry(1, 2);
    let mat = new THREE.MeshBasicMaterial({
      map: randomTexture,
      transparent: true
    });

    let name = randomTexture.image.src.split('/');
    name = name[name.length - 1];

    let mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'player-' + name;

    // mesh.position.set(getRandomFloat(-1, 1), getRandomFloat(-1, 1), 1);
    
    // TODO: в свг экспортируется не отзеркаленный игрок
    mesh.scale.set(playersScale * getRandomSign(), playersScale, playersScale);

    let p = getRandomPlayerPosition();
    
    if (p === null) {
      continue;
    }

    mesh.position.set(p.x, p.y, p.z);

    players.push(mesh);
    scene.add(mesh);
  }
}

function getRandomSign() {
  return (Math.random() > 0.5) ? 1 : -1;
}

function getRandomPlayerPosition() {
  let restartCount = 0;
  let position = new THREE.Vector3(getRandomFloat(-1, 1), getRandomFloat(-1, 1), 1);

  if (players.length) {
    while (isNearAnySprite(position)) {
      position = new THREE.Vector3(getRandomFloat(-1, 1), getRandomFloat(-1, 1), 1);
      
      restartCount++;

      if (restartCount === 5) {
        return null;
      }
    }
  } 

  return position;
}

function isNearAnySprite(pos) {
  return players.some(p => p.position.distanceTo(pos) < MIN_PLAYERS_DISTANCE);
}

function initGui() {
  gui.add({ randomize: randomize }, 'randomize');
  gui.add({ randomizePlayers: randomizePlayers }, 'randomizePlayers');
  gui.add(guiOptions, 'randomizeColors');
  gui.add({ downloadSVG: downloadSVG }, 'downloadSVG');
  gui.add({ downloadPNG: downloadPNG }, 'downloadPNG');
  gui.add({ presets: presets }, 'presets', Object.keys(presets)).onChange(onPresetChange);

  gui.add({ playerScale: 0.35 }, 'playerScale', 0.05, 1, 0.001).onChange(onPlayerScaleChange);

  // gui.add(guiOptions, 'currentPlayerScale', 0, 1.5, 0.0001).name('currentPlayerScale').onChange(scale => {
  //   if (controls.object) {
  //     controls.object.scale.set(scale, scale, scale)
  //   }
  // });
  // gui.add({ addMaterial: addMaterial }, 'addMaterial');  
  // gui.addColor({ color: scene.background.getHex() }, 'color').name('background').onChange(color => scene.background.set(color));
  materials.forEach(m => addMaterialControls(m));
}

function addMaterialControls(m) {
  m.folder = gui.addFolder('0x' + m.uniforms.color.value.getHex().toString(16) + ', ' + Date.now());
  // m.folder.add(m.uniforms.modConst, 'value', 0, 10000).name('modConst');
  // m.folder.add(m.uniforms.resolution, 'value', 0, 100000, 1).name('resolution');
  
  m.folder.add(m.uniforms.scale, 'value', 0, 1.5, 0.0001).name('scale');
  // m.folder.add(m.uniforms.noiseConst, 'value', 0, 200, 0.1).name('noiseConst');
  m.folder.add(m.uniforms.coef.value, 'x', 0, 2, 0.0001).name('x');
  m.folder.add(m.uniforms.coef.value, 'y', 0, 2, 0.0001).name('y');
  // m.folder.addColor({ color: m.uniforms.color.value.getHex() }, 'color').name('color').onChange(color => m.uniforms.color.value.set(color));
}

function onPlayerScaleChange(scale) {
  playersScale = scale;

  players.forEach(p => {
    p.scale.set(playersScale * Math.sign(p.scale.x), playersScale, playersScale);
  });
}

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onKeyPress(event) {
  console.log(event.keyCode, controls)
  switch (event.keyCode) {
    case 49: // 1
      controls.setMode('translate');
      
      break;

    // case 50: // 2
    //   controls.setMode('rotate');
      
    //   break;

    case 51: // 3
      currentPlayer.material.map = getRandomFromArray(Object.values(textures));
      
      break;
  }
}

function onClick() {
  console.log(currentPlayer);

  players.forEach(player => {
    controls.detach(player);
  })

  controls.attach(currentPlayer);

  guiOptions.currentPlayerScale = currentPlayer.scale.x;
}

function onPresetChange(p) {
  const preset = presets[p];

  scene.background = preset.background;
  scene.children.filter(m => m.name === 'background').forEach(m => scene.remove(m));
  
  materials.forEach(m => {
    if (m.folder) {
      gui.removeFolder(m.folder);      
    }
  });
  materials = [];
  preset.materials.forEach(m => addMaterial(m));

  playersTeamFolder = preset.folder;

  randomizePlayers();
}

function downloadPNG() {
  document.querySelector('#alert').style.display = 'block';

  controls.visible = false;

  let img = new Image();
  img.src = renderer.domElement.toDataURL('image/png');
  img.onload = () => {
    let a = document.createElement('a');
    a.download = 'camouflage (' + new Date().toLocaleString() + ').png';
    a.href = img.src;
    a.click();

    document.querySelector('#alert').style.display = 'none';
  };

  controls.visible = true;
}

function downloadSVG() {
  document.querySelector('#alert').style.display = 'block';

  controls.visible = false;
  setPlayersVisibility(false);

  traceCamouflage((svg) => {
    let svgWithPlayers = addPlayersToSVG(svg);

    const blob = new Blob([svgWithPlayers], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'camouflage (' + new Date().toLocaleString() + ').svg';
    a.href = url;
    a.click();

    document.querySelector('#alert').style.display = 'none';
  });
}

function traceCamouflage(callback) {
  // хоккеисты не исчезают мгновенно, поэтому подождём
  setTimeout(() => {
    let img = new Image();
    img.src = renderer.domElement.toDataURL('image/png');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = renderer.domElement.width;
      canvas.height = renderer.domElement.height;
      
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0,0, renderer.domElement.width, renderer.domElement.height);

      const svg = ImageTracer.imagedataToSVG(imageData, {
        ltres: 0.00001,
        qtres: 0.00001,
        pathomit: 0.00001,
        linefilter: true,
        roundcoords: 6
      });

      setPlayersVisibility(true);
      controls.visible = true;

      callback(svg);
    };
  }, 300);
}

function addPlayersToSVG(camouflageSvgString) {
  const draw = SVG(camouflageSvgString);
  const size = 525; // подобранное значение из пнгшек, если разные скейлы, надо умножать это значение

  players.forEach(p => {
    let filename = p.name.replace('player-', '').replace('png', 'svg');
    let svg = svgs[filename].clone();
    svg.size(525, 525);

    let pos = getScreenCoordinates(p.position);
    svg.center(pos.x, pos.y);

    console.log(getScreenCoordinates(p.position));

    draw.add(svg);
  });

  return draw.svg();
}

// конвертируем из координат three.js в канвасные
function getScreenCoordinates(p) {
  let pos = p.clone();

  let wHalf = 0.5 * renderer.domElement.width;
  let hHalf = 0.5 * renderer.domElement.height;

  pos.x = pos.x * wHalf + wHalf;
  pos.y = -(pos.y * hHalf) + hHalf;
  
  return pos;
}

function setPlayersVisibility(status) {
  players.forEach(mesh => {
    mesh.visible = status;
  });
}
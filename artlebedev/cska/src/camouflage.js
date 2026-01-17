// snoise() from https://thebookofshaders.com/edit.php#11/lava-lamp.frag

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
uniform float rarity;
uniform float modConst;
uniform vec2 resolution;
uniform float positionCoef;

uniform vec3 color;
uniform float scale;

varying vec2 vUv;
varying vec3 vPosition;

// float modConst = 289.0;
// float resolution = 1000.0;
// float scale = 0.5;

// Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

bool isBlack(vec3 c) {
  return (c.r <= 0.0 && c.g <= 0.0 && c.b <= 0.0);
}

bool isWhite(vec3 c) {
  return (c.r >= 1.0 && c.g >= 1.0 && c.b >= 1.0);
}

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  st.x *= resolution.x / resolution.y;
  vec3 col = vec3(0);
  vec2 pos = vec2(st * 10.) + positionCoef;

  float DF = 0.0;

  // Add a random position
  float a = 0.0;
  vec2 vel = vec2(time * .0);
  DF += snoise(pos + vel) * .25 + .25;

  // animation
  a = snoise(pos * vec2(cos(time * 0.15), sin(time * 0.1)) * 0.1) * 3.1415;
  vel = vec2(cos(a),sin(a));
  DF += snoise(pos + vel) * .25 + .25;

  col = vec3(smoothstep(rarity, rarity + 0.05, fract(DF)));

  vec4 fragColor;

  if (isBlack(col)) {
    fragColor = vec4(color, 1.0);
  } else {
    fragColor = vec4(col, 0.0);
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
  randomizeNoise: false,
  randomizeColors: false,
  animationSpeed: 0,
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
          rarity: { value: 0.45 },
          resolution: { value: new THREE.Vector2(2048, 2048) },
          positionCoef: { value: Math.random() * 1000 },
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
          rarity: { value: 0.3 },
          resolution: { value: new THREE.Vector2(2048, 2048) },
          positionCoef: { value: Math.random() * 1000 },
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
          rarity: { value: 0.6 },
          resolution: { value: new THREE.Vector2(2048, 2048) },
          positionCoef: { value: Math.random() * 1000 },
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
          rarity: { value: 0.26 },
          resolution: { value: new THREE.Vector2(6050, 6050) },
          positionCoef: { value: Math.random() * 1000 },
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
          rarity: { value: 0.4 },
          resolution: { value: new THREE.Vector2(2956, 2956) },
          positionCoef: { value: Math.random() * 1000 },
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
          rarity: { value: 0.39 },
          resolution: { value: new THREE.Vector2(2700, 2700) },
          positionCoef: { value: Math.random() * 1000 },
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
          rarity: { value: 0.32 },
          resolution: { value: new THREE.Vector2(3830, 3830) },
          positionCoef: { value: Math.random() * 1000 },
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
          rarity: { value: 0.3 },
          resolution: { value: new THREE.Vector2(2956, 2956) },
          positionCoef: { value: Math.random() * 1000 },
          color: { value: new THREE.Color('rgb(237, 28, 36)') }
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
  materials.forEach(m => m.uniforms.time.value = time * 0.0000025 * guiOptions.animationSpeed);
  
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

    m.uniforms.positionCoef.value = getRandomFloat(1, 20000);

    if (guiOptions.randomizeNoise) {
      m.uniforms.rarity.value = getRandomFloat(0, 1);
      m.uniforms.rarity.value.y = getRandomFloat(512, 4096);
    }

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
  gui.add(guiOptions, 'randomizeNoise');
  gui.add(guiOptions, 'randomizeColors');
  gui.add({ downloadSVG: downloadSVG }, 'downloadSVG');
  gui.add({ downloadPNG: downloadPNG }, 'downloadPNG');
  gui.add({ presets: presets }, 'presets', Object.keys(presets)).onChange(onPresetChange);

  gui.add(guiOptions, 'animationSpeed', 0, 4, 0.0001);
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
  m.folder.add(m.uniforms.positionCoef, 'value', 0, Math.pow(2, 16), 1).name('position');
  m.folder.add(m.uniforms.rarity, 'value', 0, 1, 0.0001).name('rarity');
  m.folder.add(m.uniforms.resolution.value, 'y', 0, 20000, 1).name('scale');

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
    a.download = 'cska-pattern (' + new Date().toLocaleString() + ').png';
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
    let filename = playersTeamFolder + '/' + p.name.replace('player-', '').replace('png', 'svg');
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
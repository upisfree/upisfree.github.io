let camera;
let scene;
let renderer;
let geometry;
let mesh;

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

varying vec2 vUv;
varying vec3 vPosition;

float modConst = 289.0;
float resolution = 100.0;
float scale = 0.5;

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

void main() {
    vec3 color;

    float x = vPosition.x * scale;
    float y = vPosition.y * scale;

    vec3 cloudEffect = clouds(vPosition.x, vPosition.y);
    color = cloudEffect + vec3(.5, .8, 0.95);
    gl_FragColor = vec4(color, 1.);

   // color = vec3(noise(vec2(x * 21., y * 15.)));
   // gl_FragColor = vec4(color, 1.);
   // // // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
}
`;

let material = new THREE.ShaderMaterial( {
  uniforms: {
    time: { value: 1.0 }
  },

  vertexShader: vertex,
  fragmentShader: fragment
});

init();
animate();

function init() {
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  camera.position.z = 1;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(1, 0, 1);

  geometry = new THREE.PlaneBufferGeometry(2, 2);
  // geometry = new THREE.IcosahedronGeometry(2, 4);

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  mesh.material.uniforms.time.value = time * 0.00025;
  
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02;

  renderer.render(scene, camera);
}
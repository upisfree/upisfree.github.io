import * as THREE from 'https://unpkg.com/three@0.117.1/build/three.module.js';
import { BasisTextureLoader } from './BasisTextureLoader.js';

var camera, scene, renderer;

var texturePath = './textures/';
var texturesNames = [
  'main-1.basis',
  'main-2.basis',
  'main-3.basis',
  'main-4.basis',
  'main-5.basis',
  'main-5.basis',
  'main-5.basis',
  'main-5.basis',
  'main-5.basis',
  'main-5.basis',
];

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 0.8;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const basisLoader = new BasisTextureLoader();
  basisLoader.setTranscoderPath('./basis/');
  basisLoader.setWorkerLimit(4);
  basisLoader.useAlpha = true;
  basisLoader.detectSupport(renderer);


  texturesNames.forEach((name, index) => {
    basisLoader.load(texturePath + name, (texture) => {
      var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      });

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = (index - 3) / 5;
      scene.add( mesh );

      console.log(texture);
    });
  });

}

function animate() {

  requestAnimationFrame( animate );

  // scene.traverse(obj => {
  //   obj.rotation.x += 0.01;
  //   obj.rotation.y += 0.02;
  // });

  renderer.render( scene, camera );

}
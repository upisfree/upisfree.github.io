// Lol, I'm too lazy to install CoffeeScript and do it with it
// Utils
function random(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min; 
};

function resize()
{
  window.w = window.innerWidth;
  window.h = window.innerHeight;
};

function rgbToHex(r, g, b)
{
  return '0x' + r.toString(16) + g.toString(16) + b.toString(16);
};

function generateNoise()
{
  if (container.children.length != 0)
    container.removeChildAt(0);

  var gl = new PIXI.Graphics();

  var s = 10;

  for (var x = 0; x <= window.w / s; x++)
  {
    for (var y = 0; y <= window.h / s; y++)
    {
      if (Math.random() > 0.5)
      {
        gl.beginFill(0x000000, 1);
        gl.drawRect(x * s, y * s, s, s);
      }
    };
  };

  container.addChild(gl);
};

var coordinates = 
[
  [-96.789, 46.877, 14],
  [-0.124, 51.504, 15],
  [26.939, 60.462, 14],
  [30.326, 59.923, 15],
  [37.614, 55.76, 15],
  [73.374, 54.979, 14],
  [121.467, 31.237, 14],
  [135.521, 34.675, 15],
  [135.521, 34.675, 15]
];

function getMapURL()
{
  var c = coordinates[random(0, coordinates.length - 1)];

  return 'http://api.tiles.mapbox.com/v4/upisfree.lnoaln7j/' + c[0] + ',' + c[1] + ',' + c[2] + '/640x480@2x.png?access_token=pk.eyJ1IjoidXBpc2ZyZWUiLCJhIjoiendQb1RXOCJ9.kWzWlTV5W5XyfNwCRktbbA&nocash=' + Math.random();
}

var color = [random(0, 255), random(0, 255), random(0, 255)];

function animate()
{
  renderer.render(stage);

  time += 0.01;

  stage.setBackgroundColor(rgbToHex(color[0], color[1], color[2]));

  map.rotation = time * 0.25;
  map.scale.x = Math.sin(time) + 4;
  map.scale.y = Math.sin(time) + 4;

  colorMatrix[1] = Math.sin(time) * 3;
  colorMatrix[2] = Math.cos(time);
  colorMatrix[3] = Math.cos(time) * 1.5;
  colorMatrix[4] = Math.sin(time / 3) * 2;
  colorMatrix[5] = Math.sin(time / 2);
  colorMatrix[6] = Math.sin(time / 4);
  cmFilter.matrix = colorMatrix;

  grayFilter.gray = Math.sin(time);

  twistFilter.angle = Math.sin(time);
  twistFilter.radius = Math.sin(time);
  twistFilter.offset.x = Math.cos(time);
  twistFilter.offset.y = Math.sin(time);

  /*
  if (Date.now() - time > 10000)
  {
    document.getElementById('noise').style.display = 'block';
    document.getElementById('map').style.display   = 'none';

    generateNoise();
    setRandomCenter();

    setTimeout(function()
    {
      document.getElementById('noise').style.display = 'none';
      document.getElementById('map').style.display   = 'block';

      time = Date.now();
    }, 2500);
  }
  else
    mapMoving();
*/
  requestAnimFrame(animate);
};

// Start
var time = 0;

resize();
window.onresize = resize;

document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

// Stage
var stage = new PIXI.Stage(0x383838, true);
var renderer = new PIXI.WebGLRenderer(window.w, window.h);
document.body.appendChild(renderer.view);

// Filters
// Pixel
var pixelFilter = new PIXI.PixelateFilter();
pixelFilter.size.x = pixelFilter.size.y = 5;

// RGB
var rgbFilter = new PIXI.RGBSplitFilter();

// Color Matrix (Mat Groves: http://www.goodboydigital.com/pixijs/examples/15/)
var colorMatrix = [1,0,0,0,
                   0,1,0,0,
                   0,0,1,0,
                   0,0,0,1];

var cmFilter = new PIXI.ColorMatrixFilter();

// Gray
var grayFilter = new PIXI.GrayFilter();

// Twist
var twistFilter = new PIXI.TwistFilter();

// Container
var container = new PIXI.DisplayObjectContainer();

container.filters = [pixelFilter, rgbFilter, cmFilter, grayFilter, twistFilter];

stage.addChild(container);

//// Map
var url = getMapURL();
var map = null;

var loader = new PIXI.AssetLoader([url]);

loader.onComplete = function()
{
  map = new PIXI.Sprite.fromImage(url);
  map.anchor.x = 0.5;
  map.anchor.y = 0.5;
  map.position.x = window.w / 2;
  map.position.y = window.h / 2;

  container.addChild(map);

  requestAnimFrame(animate);
};

loader.load();
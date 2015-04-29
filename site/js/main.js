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
  if (noiseContainer.children.length != 0)
    noiseContainer.removeChildAt(0);

  var gl = new PIXI.Graphics();

  var s = 12.5;

  for (var x = 0, w = window.w / s; x < w; x++)
  {
    for (var y = 0, h = window.h / s; y < h; y++)
    {
      var r = Math.random();

      if (r < 0.25)
      {
        gl.beginFill(0x000000, 1);
      }
      else if (r > 0.25 && r < 0.5)
      {
        gl.beginFill(0x696969, 1);
      }
      else if (r > 0.5 && r < 0.75)
      {
        gl.beginFill(0xd3d3d3, 1);
      }
      else if (r > 0.75)
      {
        gl.beginFill(0xffffff, 1);
      }

      gl.drawRect(x * s, y * s, s, s);
    }
  }

  noiseContainer.addChild(gl);
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

function animate()
{
  renderer.render(stage);

  count += 0.01;

  stage.setBackgroundColor(rgbToHex(bgColor[0], bgColor[1], bgColor[2]));

  map.rotation = count * 0.25;
  map.scale.x = Math.sin(count) + 4;
  map.scale.y = Math.sin(count) + 4;

  colorMatrix[1] = Math.sin(count) * 3;
  colorMatrix[2] = Math.cos(count);
  colorMatrix[3] = Math.cos(count) * 1.5;
  colorMatrix[4] = Math.sin(count / 3) * 2;
  colorMatrix[5] = Math.sin(count / 2);
  colorMatrix[6] = Math.sin(count / 4);
  cmFilter.matrix = colorMatrix;

  grayFilter.gray = Math.sin(count);

  twistFilter.angle = Math.sin(count);
  twistFilter.radius = Math.sin(count);
  twistFilter.offset.x = Math.cos(count);
  twistFilter.offset.y = Math.sin(count);

  if (noiseContainer.visible)
  {
    generateNoise();
/*
    noiseContainer.getChildAt(0).rotation = count * 0.5;
    noiseContainer.getChildAt(0).scale.x = Math.sin(count) + 2;
    noiseContainer.getChildAt(0).scale.y = Math.sin(count) + 2;
*/  }

  requestAnimFrame(animate);
};

// Start
var count = 0;

resize();
window.onresize = resize;

document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

// Stage
var stage = new PIXI.Stage(0x383838, true);
var renderer = new PIXI.WebGLRenderer(window.w, window.h);
document.body.appendChild(renderer.view);

var bgColor = [random(0, 255), random(0, 255), random(0, 255)];

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
var noiseContainer = new PIXI.DisplayObjectContainer();

noiseContainer.filters = [pixelFilter, rgbFilter, cmFilter, grayFilter, twistFilter];
container.filters = [pixelFilter, rgbFilter, cmFilter, grayFilter, twistFilter];

//// Map
var map = new PIXI.Sprite(PIXI.Texture.fromImage(getMapURL()));
map.anchor.x = 0.5;
map.anchor.y = 0.5;
map.position.x = window.w / 2;
map.position.y = window.h / 2;

container.addChild(map);

var loader = new PIXI.AssetLoader();
loader.onComplete = function()
{
  map.setTexture(PIXI.Texture.fromImage(loader.assetURLs[0]));
};

stage.addChild(container);
stage.addChild(noiseContainer);

// Start
var time = Date.now();

setInterval(function()
{
  if (noiseContainer.visible)
  {
    noiseContainer.visible = false;
  }
  else
  {
    noiseContainer.visible = true;
    loader.assetURLs = [getMapURL()];
    loader.load();
  }
}, 5000);

requestAnimFrame(animate);
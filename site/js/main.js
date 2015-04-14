// Lol, I'm too lazy to install CoffeeScript and do it with it
// Utils
Math.randomInt = function(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min; 
};

function resize()
{
  window.w = window.innerWidth;
  window.h = window.innerHeight;
};

function getRandomColor(min, max)
{
  if (typeof(min) === 'undefined') min = 0;
  if (typeof(max) === 'undefined') max = 255;

  return { r: Math.randomInt(min, max), g: Math.randomInt(min, max), b: Math.randomInt(min, max) };
};

function rgbToHex(c)
{
  return '0x' + c.r.toString(16) + c.g.toString(16) + c.b.toString(16);
};

// Start
resize();
window.onresize = resize;

document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

// Stage
var stage = new PIXI.Stage(0x191919, true);
var renderer = PIXI.autoDetectRenderer(window.w, window.h);
document.body.appendChild(renderer.view);

// Container
var container = new PIXI.DisplayObjectContainer();
container.filters = [pixelFilter, grayFilter];
stage.addChild(container);

// Animation
requestAnimFrame(animate);

function animate()
{
  renderer.render(stage);

  requestAnimFrame(animate);
};
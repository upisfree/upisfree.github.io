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

// Start
resize();
window.onresize = resize;

document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

// Stage
var stage = new PIXI.Stage(0x383838, true);
var renderer = new PIXI.WebGLRenderer(window.w, window.h);
document.body.appendChild(renderer.view);

// Container
var container = new PIXI.DisplayObjectContainer();
stage.addChild(container);

// Animation
requestAnimFrame(animate);

function animate()
{
  renderer.render(stage);
  
  generateNoise();

  requestAnimFrame(animate);
};
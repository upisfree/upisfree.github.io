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

  var about = document.getElementById('about').style;
  console.log(about);
  about.left = (window.w - 250) / 2; // 250? Move it.
  about.top = (window.h - 150) / 2; // 150? Move it.
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

function generateCircles(i)
{
  if (container.children.length != 0)
    container.removeChildAt(0);

  var g = new PIXI.Graphics();

  c = getRandomColor(0, 25);
  d = 1; // what is “d”? delta? what?

  for (; i >= 0; i--)
  {
    if (c.r + d <= 255 || c.g + d <= 255 || c.b + d <= 255) // what are you doing?
    {
      c.r += d;
      c.g += d;
      c.b += d;
    };

    //g.lineStyle(3, rgbToHex(c), 1);
    g.beginFill(rgbToHex(c), 1);
    g.drawCircle(window.w / 2, window.h / 2, i * 10);
  };
    
  container.addChild(g);
};

// Sound
function soundOn()
{
  document.getElementsByTagName('audio')[0].play();
  document.getElementById('soundOffControl').style.display = 'block';
  document.getElementById('soundOnControl').style.display = 'none';
};

function soundOff()
{
  document.getElementsByTagName('audio')[0].pause();
  document.getElementById('soundOffControl').style.display = 'none';
  document.getElementById('soundOnControl').style.display = 'block';
};

// Start
resize();
window.onresize = resize;

document.body.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

var circles = 35;

// Stage
var stage = new PIXI.Stage(0x191919, true);
var renderer = PIXI.autoDetectRenderer(window.w, window.h);
//renderer.view.style.display = 'block';
document.body.appendChild(renderer.view);

// Filters
var pixelFilter = new PIXI.PixelateFilter();
pixelFilter.size = { x: 4, y: 4 };

var grayFilter = new PIXI.GrayFilter();
grayFilter.gray = 1;

// Container
var container = new PIXI.DisplayObjectContainer();
container.filters = [pixelFilter, grayFilter];
stage.addChild(container);

// Animation
requestAnimFrame(animate);

function animate()
{
  renderer.render(stage);

  if (Math.random() > 0.5)
    circles += Math.randomInt(-1, 1);

  if (Math.random() > 0.85)
    generateCircles(circles);

  requestAnimFrame(animate);
};
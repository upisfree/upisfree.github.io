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

var phrases =
[
  'UPISFREE', 'SENYA PUGACH', 'ARE YOU ALIVE?',
  'IS THIS TRUE?', 'YOR\'RE ALONE', 'WHY ARE YOU DRUNK?',
  'I SEE YOU', 'YOU CAN\'T', 'DON\'T TRY',
  'WHERE\'S THE END?', 'OWLS NOT WHAT THEY SEEM', 'LAURA',
  'I\'LL SEE YOU IN 25 YEARS', 'ALL HAIL THE KING', 'I WAS BORN TO PLAY',
  'ME OR YOU?', 'MAYBE LATER', 'YOU HEAR IT?',
  'WHY ARE YOU MUST DOING THIS?', 'YOU\'RE VERY FUNNY', 'BETTER TOMORROW',
  'NIGHT', 'DAY', 'SUN', 'MOON', 'STAR', 'SPACE',
  'WE TRY TO POISON YOU', 'WHAT HAPPENS AFTER DEATH?', 'WHY ARE YOU HERE?',
  'THE END', 'NOW', 'WOW', 'YES', 'NO', 'LAURA LAURA LAURA',
  'I\'LL SEE YOU UNDER THE WATER', 'SHINE ON YOUR CRAZY DIAMOND',
  'CHILD IN TIME', 'STAIRWAY TO HEAVEN', 'POOR TOM', 'UNIVERSE',
  'TIME IS OVER', 'DO IT NOW', 'DON\'T', 'SERIOUSLY?',
  'MAYBE YES', 'MAYBE NOT', 'IT\'S LOCKED',
  'TIME TO DIE', 'FAR FAR AWAY', 'LUCKY BOY', 'THERE\'S NO SOUL'
];

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

  return 'http://api.tiles.mapbox.com/v4/upisfree.lnoaln7j/' + c[0] + ',' + c[1] + ',' + c[2] + '/640x480@2x.png?access_token=pk.eyJ1IjoidXBpc2ZyZWUiLCJhIjoiendQb1RXOCJ9.kWzWlTV5W5XyfNwCRktbbA';
}

function animate()
{
  renderer.render(stage);

  count += 0.01;

  map.rotation = count * 0.25;
  map.scale.x = Math.sin(count) + 4;
  map.scale.y = Math.sin(count) + 4;

  // Map filters
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

  // Text filters
  textPixelFilter.size.x = textPixelFilter.size.y = Math.sin(count) * Math.random() * 25;

  textTwistFilter.angle = Math.sin(count) * Math.random() * 0.5;
  textTwistFilter.radius = Math.sin(count);
  textTwistFilter.offset.x = Math.cos(count) * Math.random();
  textTwistFilter.offset.y = Math.sin(count) * Math.random();

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

stage.setBackgroundColor(rgbToHex(random(0, 255), random(0, 255), random(0, 255)));

// Filters
// Pixel
var pixelFilter = new PIXI.PixelateFilter();
pixelFilter.size.x = pixelFilter.size.y = 5;

var textPixelFilter = new PIXI.PixelateFilter();

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
grayFilter.gray = 0;

// Twist
var twistFilter = new PIXI.TwistFilter();
var textTwistFilter = new PIXI.TwistFilter();

// Containers
var container = new PIXI.DisplayObjectContainer();

var linksContainer = new PIXI.DisplayObjectContainer();

//// Map
var map = new PIXI.Sprite(PIXI.Texture.fromImage(getMapURL()));
map.anchor.x = 0.5;
map.anchor.y = 0.5;
map.position.x = window.w / 2;
map.position.y = window.h / 2;

map.filters = [pixelFilter, rgbFilter, cmFilter, grayFilter, twistFilter];

container.addChild(map);

//// Text
var title;

var font = new Font(); 
font.onload = function() // да, надпись сделана на pixi, а ссылки на html. так проще, потому что зачем мне париться с ссылками, если эффекты нужны только для заголовка?
{
  title = new PIXI.Text(phrases[0], { font: 'bold 175px Terminal', fill: '#fff', stroke: '#000', strokeThickness: 20});
  title.position.x = (window.w - title.width) / 2;
  title.position.y = (window.h - title.height) / 2;
  
  title.filters = [textTwistFilter, textPixelFilter];

  container.addChild(title);

  document.getElementById('links').style.left = (window.w - document.getElementById('links').width) / 2;
}

font.onerror = function(err) { alert(err); }
font.fontFamily ="Terminal";
font.src = "./site/assets/terminal.ttf";

container.addChild(linksContainer);

// Loader
var loader = new PIXI.AssetLoader();
loader.onComplete = function()
{
  map.setTexture(PIXI.Texture.fromImage(loader.assetURLs[0]));
};

stage.addChild(container);

// Start
var ticks = 0;

setInterval(function()
{
  stage.setBackgroundColor(rgbToHex(random(0, 255), random(0, 255), random(0, 255)));

  ticks += 1;

  if (ticks % 2)
    title.setText(phrases[random(0, phrases.length - 1)]);
  else
    title.setText(phrases[0]);

  title.position.x = (window.w - title.width) / 2;

  loader.assetURLs = [getMapURL()];
  loader.load();
}, 5000);

requestAnimFrame(animate);
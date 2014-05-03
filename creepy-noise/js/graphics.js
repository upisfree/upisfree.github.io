// Question about stats

var isStatsEnable = confirm('Show stats (FPS, etc)?');

// Pixi

var stage = new PIXI.Stage(0x000000, true);

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);

document.body.appendChild(renderer.view);
renderer.view.style.position = 'absolute';
renderer.view.style.top = '0px';
renderer.view.style.left = '0px';
requestAnimFrame(animate);

// Stats

if (isStatsEnable)
{
  var stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
};

// App resources

var textures = [];

for (var i = 1; i <= 20; i++)
{
  textures[i] = i.toString();

  if (textures[i].length == 1)
    textures[i] = '0' + i;
};

textures.shift();

function drawRectangle(x, y)
{
  var t = PIXI.Texture.fromImage('img/' + textures[random(0, textures.length - 1)] + '.png');

  var rectangle = new PIXI.Sprite(t);

  rectangle.dynamic = false;

  rectangle.width = 10;
  rectangle.height = 10;

  rectangle.position.x = x;
  rectangle.position.y = y;
  
  stage.addChild(rectangle);
}

function generateRectangles()
{
  if (stage.children.length == 0)
    drawRectangle(0, 0);

  if (stage.children[stage.children.length - 1].y != (window.innerHeight - (window.innerHeight % 10)))
  {
    for (var i = 0; i < 250; i++)
    {
      var lastChild = stage.children[stage.children.length - 1];

      var x = lastChild.x + 10;
      var y = lastChild.y;

      if (x == window.innerWidth)
      {
        x = 0;
        y = lastChild.y + 10;
      };

      drawRectangle(x, y);
    };
  };
}

function updateRectangles()
{
/*
  for (var i = 0; i < 50; i++)
  {
    stage.children.splice(random(0, stage.children.length - 1), 1);
  };
*/
  for (var i = 0; i < stage.children.length - 1; i++)
  {
    stage.children[random(0, stage.children.length - 1)].texture = PIXI.Texture.fromImage('img/' + textures[random(0, textures.length - 1)] + '.png');
  };
}

// App start

function animate()
{
  requestAnimFrame(animate);

  if (isStatsEnable)
    stats.begin();

  generateRectangles();
  updateRectangles();

  if (isStatsEnable)
    stats.end();

  renderer.render(stage);  
}
function random(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min; 
};

function getRandomColor()
{
  return 'rgb(' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ')';
};

function getRandomColorAlpha()
{
  var a = random(0, 255),
      b = random(0, 255),
      c = random(0, 255),
      alpha = Math.random();

  return 'rgba(' + a + ', ' + b + ', ' + c + ', ' + alpha + ')';
};

function getGradient()
{
  var array = Array.prototype.slice.call(arguments, 0);

  return 'linear-gradient(' + array.join(', ') + ')';
};
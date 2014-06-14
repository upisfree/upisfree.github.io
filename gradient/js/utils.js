function random(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min; 
};

function getRandomColor()
{
  var a = random(0, 255),
      b = random(0, 255),
      c = random(0, 255),
      alpha = Math.random();

  return 'rgba(' + a + ', ' + b + ', ' + c + ', ' + alpha + ')';
};
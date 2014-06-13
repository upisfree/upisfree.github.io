function random(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min; 
};

function getRandomColor()
{
  return 'rgb(' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ')';
};
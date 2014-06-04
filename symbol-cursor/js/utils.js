function random(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min; 
};

function getRandomColor()
{
  return 'rgb(' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ')';
};

function getRandomSymbol()
{
  if (!window.symbols) // эффективное управление памятью, чо
  {
    window.symbols = [];

    for (var i = 0; i <= 10000; i++)
    {
      symbols.push(String.fromCharCode(i));
    }    
  };

  return symbols[random(0, symbols.length - 1)];
};
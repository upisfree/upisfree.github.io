function random(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min; 
};

function getRandomColor()
{
  return 'rgb(' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ')';
};

function generateRandomSymbols()
{
  if (!window.symbols) // эффективное управление памятью, чо
  {
    window.symbols = [];

    for (var i = 0; i <= 10000; i++)
    {
      symbols.push(String.fromCharCode(i));
    }    
  }
  else
    return;
};

function getRandomSymbol()
{
  generateRandomSymbols();

  return symbols[random(0, symbols.length - 1)];
};

Array.prototype.shuffle = function(b)
{
  var i = this.length, j, t;

  while (i) 
  {
    j = Math.floor((i--) * Math.random());
    t = (b && typeof this[i].shuffle !== 'undefined') ? this[i].shuffle() : this[i];
    this[i] = this[j];
    this[j] = t;
  }

  return this;
};
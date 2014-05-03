// Noise

function generateNoise()
{
  var data = [];

  for (var i = 0; i < 100000; i++)
  {
    data[i] = Math.round(100 * Math.random());
  }

  return new RIFFWAVE(data);
}

var noise = new Audio(generateNoise().dataURI);

noise.addEventListener('ended', function()
{
  this.currentTime = 0;

  setTimeout(function() {noise.play();}, 1500);
}, false);

noise.play();

// Effects

var effects = ['clock', 'cough', 'cough2',
               'cracking', 'kick', 'scream',
               'scream2', 'sneeze', 'steel',
               'swallowing', 'swing', 'tea', 'water', 'zippo'];

setInterval(function()
{
  var effect = new Audio('../sound/' + effects[random(0, effects.length - 1)] + '.mp3');
  effect.play();
}, 1000);
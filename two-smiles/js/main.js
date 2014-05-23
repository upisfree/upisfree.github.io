function makeSmile()
{
  var smiles = ['༼ つ ◕_◕ ༽つ', '༼ つ ◕◡◕ ༽つ'];
  var smile  = '<span>' + smiles[random(0, smiles.length - 1)] + '</span>';

  $(smile).css(
  {
    position: 'absolute',
    top: random(0, window.innerHeight),
    left: random(0, window.innerWidth)
  }).appendTo('body');
};

$(function()
{
  setInterval(function()
  {
    makeSmile();
  }, 10);
});
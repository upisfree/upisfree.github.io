function getGradient()
{
  var array = Array.prototype.slice.call(arguments, 0);

  return 'linear-gradient(' + array.join(', ') + ')';
};

function setGradients()
{
  $('div').each(function()
  {
    $(this).css('background', getGradient(random(0, 360) + 'deg', getRandomColor(), getRandomColor()));
  });
};

$(function()
{
  setGradients();

  setInterval(function()
  {
    $('div').each(function()
    {
      $(this).animate({opacity: Math.random()}, 2500);
    });
  }, 5000);

  $('body').click(function()
  {
    setGradients();
  });
});
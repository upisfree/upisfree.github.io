function appendSymbol(x, y)
{
  var symbol = '<div class="symbol">' + getRandomSymbol() + '</div>';

  $(symbol).css(
  {
    left: x,
    top: y,
    color: getRandomColor()
  }).appendTo('body');
};

$(function()
{
  $('body').mousemove(function(event)
  {
    appendSymbol(event.pageX - 8, event.pageY - 20);
  }).click(function()
  {
    $('.symbol').remove();
  });;
});
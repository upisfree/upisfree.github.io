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
  var left,
      right;

  // Блокируем контекстное меню
  $('body').on('contextmenu', function(event)
  {
    event.preventDefault();
  });

  // Изменяем флаг, когда клавиша нажата
  $(document).mousedown(function(event)
  {
    switch (event.which)
    {
      case 1:
        left = true;
        break;
      case 3:
        right = true;
        break;
    }
  });

  // Изменяем флаг, когда клавиша не нажата
  $(document).mouseup(function(event)
  {
    switch (event.which)
    {
      case 1:
        left = false;
        break;
      case 3:
        right = false;
        break;
    }
  });

  // Ну, тут мышку типа двигаем
  $('body').mousemove(function(event)
  {
    if (left)
      appendSymbol(event.pageX - 8, event.pageY - 20);

    $('.symbol').mouseenter(function()
    {
      if (right)
        $(this).remove();
    });
  }).click(function(event)
  {
    if (event.which == 2)
      $('.symbol').remove();
  });
});
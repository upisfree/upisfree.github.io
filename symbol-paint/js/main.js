function appendSymbol(x, y, ctx, s)
{
  if (!s)
    s = getRandomSymbol();

  ctx.fillStyle = getRandomColor();
  ctx.font = '24px Times';
  ctx.fillText(s, x, y);
};

function setCanvasSize()
{
  $('canvas').attr(
  {
    width: window.innerWidth,
    height: window.innerHeight
  });
};

$(function()
{
  var left,
      right;

  var timer,
      timerFlag;

  var helpFlag;

  setCanvasSize();
  generateRandomSymbols();

  $(window).resize(setCanvasSize());

  var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');

  // Блокируем контекстное меню
  $(document).on('contextmenu', function(event)
  {
    event.preventDefault();
  });

  // Вставка случайных символов в бегущую строку
  (function()
  {
    var a,
        b = symbols.shuffle();

    b.length = 1000;

    for (var i = 0; i <= b.length - 1; i++)
    {
      a = '<span>' + b[i] + '</span>';
      $(a).css('background', getRandomColor()).appendTo('marquee');
    };
  })();

  // Тряска
  $(document).keypress(function(event)
  {
    if (event.which != 104 && event.which != 1088)
    {
      if (timerFlag)
        timerFlag = false;
      else
        timerFlag = true;

      if (timerFlag)
      {
        timer = setInterval(function()
        {
          var x = random(-10, 10),
              y = random(-10, 10);

          $('canvas').css(
          {
            left: x,
            top: y
          });
        }, 1);
      }
      else
      {
        clearInterval(timer);
      };
    }
    else
    {
      var speed = 'fast';

      if (helpFlag)
        helpFlag = false;
      else
        helpFlag = true;

      if (helpFlag)
      {
        $('body > div').slideUp(speed);
      }
      else
      {
        $('body > div').slideDown(speed);
      }
    };
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
  $(document).mousemove(function(event)
  {
    if (left)
      appendSymbol(event.pageX - 8, event.pageY, ctx);
  }).click(function(event)
  {
    if (event.which == 2)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});
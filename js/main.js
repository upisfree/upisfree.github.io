var change =
{
  colors: function()
  {
    var a = random(0, 255),
        b = random(0, 255),
        c = random(0, 255);

    $('body').css('background-color', 'rgb(' + a + ', ' + b + ', ' + c + ')');
    $('h1').css('color', 'rgb(' + (255 - a) + ', ' + (255 - b) + ', ' + (255 - c) + ')');
  },

  text: function()
  {
    var phrases = ['upisfree', '༼ ༎ຶ ෴ ༎ຶ༽', 'ヽ(◉◡◔)ﾉ', '┬━┬ノ( º _ ºノ)', '(•_•)',
                   '(⌐■_■)', '༼ つ ◕_◕ ༽つ', '༼ つ ◕◡◕ ༽つ', '¯\\_(ツ)_/¯'];

    $('h1').text(phrases[random(0, phrases.lenght - 1)]);
  }
};

$(function()
{
  setInterval(function()
  {
    change.text();
    change.colors();
  }, 2500);
});
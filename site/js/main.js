function setGradients(target)
{
  $(target).each(function()
  {
    $(this).css('background', getGradient(random(0, 360) + 'deg', getRandomColorAlpha(), getRandomColorAlpha()));
  });
};

var twoSmiles = ['༼ つ ◕_◕ ༽つ', '༼ つ ◕◡◕ ༽つ'];

var forDevelopers_a = ['хуёвая', 'пиздатая', 'ебанная', 'ёбанная', 'блядивая']; // русский язык настолько могуч, что 
var forDevelopers_b = ['пизда', 'манда', 'курва', 'хуйня', 'херня']; // мне нужно создать отдельный репозиторий, чтобы перечислить все маты в нём

$(function()
{
  // Градиенты
  setGradients('.gradient, #gradientCircle');

  setInterval(function()
  {
    $('.gradient').each(function()
    {
      $(this).animate({opacity: Math.random()}, 2500);
    });
  }, 5000);

  // Парсер внешних ссылок
  $('a').each(function()
  {
    var link = $(this).attr('href');

    if (link.match(/((http|https|mailto|skype):)/i))
      $(this).attr('target', '_blank');;
  });

  // Наведение на «двоичный» абзац
  var binaryText    = "";
  var binaryOldText = "";

  $('#binary').mouseenter(function()
  {
    binaryOldText = $('#binary').text();

    for (var i in binaryOldText)
    {
      binaryText += (Math.random() > 0.5) ? 0 : 1;
    };

    $('#binary').text(binaryText);
  });

  $('#binary').mouseleave(function()
  {
    $('#binary').text(binaryOldText);
    binaryText = "";
  });

  setInterval(function()
  {
    $('#two-smiles').text(twoSmiles[random(0, twoSmiles.length - 1)]);
    $('#symbol-paint').text(String.fromCharCode(random(0, 10000))).css('color', getRandomColor());
    setGradients('#gradientCircle');
    
    var binary = "";

    for (var i = 0; i <= 1; i++)
    {
      binary += (Math.random() > 0.5) ? 0 : 1;
    };

    $('#binary-bot').text(binary);

    console.log(forDevelopers_a[random(0, forDevelopers_a.length - 1)] + ' ' + forDevelopers_b[random(0, forDevelopers_b.length - 1)]);
  }, 100);
});
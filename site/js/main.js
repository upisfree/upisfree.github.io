var twoSmiles = ['༼ つ ◕_◕ ༽つ', '༼ つ ◕◡◕ ༽つ'];

var forDevelopers_a = ['хуёвая', 'пиздатая', 'ебанная', 'ёбанная', 'блядивая']; // русский язык настолько могуч, что 
var forDevelopers_b = ['пизда', 'манда', 'курва', 'хуйня', 'херня']; // мне нужно создать отдельный репозиторий, чтобы перечислить все маты в нём

$(function()
{
  $('a').each(function() // Парсер внешних ссылок
  {
    var link = $(this).attr('href');

    if (link.match(/((http|https|mailto|skype):)/i))
      $(this).attr('target', '_blank');;
  });

  setInterval(function()
  {
    $('#two-smiles').text(twoSmiles[random(0, twoSmiles.length - 1)]);
    $('#symbol-paint').text(String.fromCharCode(random(0, 10000))).css('color', getRandomColor());

    console.log(forDevelopers_a[random(0, forDevelopers_a.length - 1)] + ' ' + forDevelopers_b[random(0, forDevelopers_b.length - 1)]);
  }, 100);
});
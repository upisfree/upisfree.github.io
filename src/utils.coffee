# utils.coffee

utils =
  random: (min, max) ->
    return Math.floor(Math.random() * (max - min + 1)) + min 
  shuffleArray: (array) -> # http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    currentIndex = array.length

    while currentIndex
      randomIndex = Math.floor Math.random() * currentIndex
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue

    return array

# export
module.exports = utils
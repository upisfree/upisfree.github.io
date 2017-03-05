# utils/array.coffee
Array::shuffle = -> # http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  currentIndex = @length

  while currentIndex
    randomIndex = Math.floor Math.random() * currentIndex
    currentIndex -= 1

    temporaryValue = @[currentIndex]
    @[currentIndex] = @[randomIndex]
    @[randomIndex] = temporaryValue
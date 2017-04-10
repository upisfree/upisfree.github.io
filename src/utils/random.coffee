# utils/random.coffee
random = (min, max) ->
  return Math.floor(Math.random() * (max - min + 1)) + min

# export
module.exports = random
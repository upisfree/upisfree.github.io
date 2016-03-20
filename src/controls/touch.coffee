# controls/touch.coffee
# Touch things
player = require('../player.coffee')()

touch = ->
  # touchmove — invisible volume slider!
  window.addEventListener 'touchmove', (e) ->
    e.preventDefault()

    player.setVolume 100 - (Math.round e.touches[0].clientY * 100 / window.innerHeight) # get % by the touch Y coordinate

# export
module.exports = touch
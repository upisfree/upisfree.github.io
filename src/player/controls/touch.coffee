# controls/touch.coffee
# Touch things
config = require '../../config.coffee'
player = require('../player.coffee')()
fullscreen = require '../../utils/fullscreen.coffee'

touch = ->
  window.addEventListener 'touchend', (e) -> # iOS
    player.playNext()

  # invisible volume slider!
  # window.addEventListener 'touchmove', (e) ->
  #   e.preventDefault()

  #   player.setVolume 100 - (Math.round e.touches[0].clientY * 100 / window.innerHeight) # get % by the touch Y coordinate

# export
module.exports = touch
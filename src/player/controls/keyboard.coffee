# controls/keyboard.coffee
# Keyboard things
config = require '../../config.coffee'
player = require('../player.coffee')()
fullscreen = require '../../utils/fullscreen.coffee'

keyboard = ->
  # need repeats? yes, please
  window.onkeydown = (e) ->
    current = player.getVolume()

    switch e.keyCode
      when 38 # up arrow
        player.setVolume current + config.volumeStep
      when 40 # down arrow
        player.setVolume current - config.volumeStep

  # need repeats? no, thanks
  window.onkeyup = (e) ->
    switch e.keyCode
      when 32, 13, 39 then player.playNext() # space, enter, right arrow
      when 70 # F
        fullscreen.switch()
      when 27 # escape
        if fullscreen.isEnabled()
          fullscreen.exit()

# export
module.exports = keyboard
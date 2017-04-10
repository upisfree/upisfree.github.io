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
      when 9 # prevent tab navigation (it's possible to find the video url through youtube player)
        e.preventDefault()

  # need repeats? no, thanks
  window.onkeyup = (e) ->
    switch e.keyCode
      when 32, 13, 39, 9 # space, enter, right arrow, tab
        player.playNext()
      when 70 # F
        fullscreen.switch()
      when 77 # M
        player.mute()
      when 27 # escape
        # e.preventDefault()

        if fullscreen.isEnabled()
          fullscreen.exit()

# export
module.exports = keyboard
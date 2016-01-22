# controls/mouse.coffee
# Mouse things
config = require '../config.coffee'
player = require '../player.coffee'
fullscreen = require './fullscreen.coffee'

mouse = ->
  # click
  window.onclick = (e) ->
    player.playNext()

  # double click
  window.ondblclick = (e) ->
    fullscreen.switch()

  # mouse wheel
  window.onmousewheel = (e) ->
    current = player.getVolume()

    if e.wheelDelta > 0
      player.setVolume current + config.volumeStep
    else
      player.setVolume current - config.volumeStep

# export
module.exports = mouse
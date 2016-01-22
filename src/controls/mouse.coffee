# controls/mouse.coffee
# Mouse things
config = require '../config.coffee'
player = require '../player.coffee'
fullscreen = require './fullscreen.coffee'

mouse = ->
  # single / double click detecting
  window._clicks = 0
  window.onclick = (e) ->
    window._clicks++

    console.log window._clicks

    if window._clicks is 1
      setTimeout ->
        if window._clicks is 1
          player.playNext() # single click
        else if 2
          fullscreen.switch() # double click
        else
          return

        window._clicks = 0
      , config.doubleClickInterval

  # mouse wheel
  window.onmousewheel = (e) ->
    current = player.getVolume()

    if e.wheelDelta > 0
      player.setVolume current + config.volumeStep
    else
      player.setVolume current - config.volumeStep

# export
module.exports = mouse
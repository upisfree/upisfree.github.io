# controls.coffee
# Where controls are
config = require './config.coffee'
utils = require './utils.coffee'
player = require './player.coffee'

controls = ->
  # mouse wheel
  window.onmousewheel = (e) ->
    current = player.getVolume()

    if e.wheelDelta > 0
      player.setVolume current + config.volumeStep
    else
      player.setVolume current - config.volumeStep

  # keyboard
  window.onkeyup = (e) ->
    switch e.keyCode
      when 32, 13, 39, 38 then player.playNext()

  # click on cover
  utils.byId('cover').onclick = ->
    player.playNext()

# export
module.exports = controls
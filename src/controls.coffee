# controls.coffee
# Where controls are
config = require './config.coffee'
utils = require './utils.coffee'
player = require './player.coffee'

controls = ->
  # desktop
  # switch click!
  utils.byId('cover').onclick = ->
    player.playNext()

  # swicth keyboard!
  window.onkeyup = (e) ->
    switch e.keyCode
      when 32, 13, 39, 38 then player.playNext()

  # mouse volume wheel!
  window.onmousewheel = (e) ->
    current = player.getVolume()

    if e.wheelDelta > 0
      player.setVolume current + config.volumeStep
    else
      player.setVolume current - config.volumeStep

  # gamepad!
  # window.addEventListener 'gamepadconnected', (e) ->
  #   setInterval ->
  #     gamepad = navigator.getGamepads()[1]

  #     console.log gamepad.buttons[0].value 
  #   , 200

  # mobile
  # invisible volume slider!
  window.addEventListener 'touchmove', (e) ->
    e.preventDefault()

    player.setVolume 100 - (Math.round e.touches[0].clientY * 100 / window.innerHeight) # get % by the touch Y coordinate

# export
module.exports = controls
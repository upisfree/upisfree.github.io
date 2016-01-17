# controls.coffee
# Where controls are
config = require './config.coffee'
utils = require './utils.coffee'
player = require './player.coffee'

controls = ->
  # desktop
  # click
  window.onclick = (e) ->
    player.playNext()

  # double click
  window.ondblclick = (e) ->
    utils.fullscreenSwitch()

  # keyboard
  window.onkeyup = (e) ->
    current = player.getVolume()

    switch e.keyCode
      when 32, 13, 39 then player.playNext() # space, enter, right arrow
      when 38 # up arrow
        player.setVolume current + config.volumeStep
      when 40 # down arrow
        player.setVolume current - config.volumeStep
      when 27 # escape
        if utils.fullscreenEnabled()
          utils.exitFullscreen()
      when 70
        utils.fullscreenSwitch()

  # mouse wheel
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
  # touchmove — invisible volume slider!
  window.addEventListener 'touchmove', (e) ->
    e.preventDefault()

    player.setVolume 100 - (Math.round e.touches[0].clientY * 100 / window.innerHeight) # get % by the touch Y coordinate

# export
module.exports = controls
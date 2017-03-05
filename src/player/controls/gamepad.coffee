# controls/gamepad.coffee
# Gamepad things
config = require '../../config.coffee'
player = require('../player.coffee')()
fullscreen = require '../../utils/fullscreen.coffee'
loopId = 0
firstGamepadId = 0

gamepadsCache = []

_lastTimeVolumeChanged = Date.now()

# isAnyGamepads = ->
#   if navigator.getGamepads().length
#     for gamepad in navigator.getGamepads()
#       if gamepad.mapping is 'standard'
#         return true

#     return false # no standart gamepad
#   else
#     return false

update = ->
  gamepads = navigator.getGamepads()

  # volume
  volume = Math.round (gamepads[1].axes[3] * -100 + 100) / 2

 
  if (volume isnt 50) and (Date.now() - _lastTimeVolumeChanged > config.gamepadVolumeMaxTime)
    player.setVolume volume
    console.log player.getVolume(), volume

    _lastTimeVolumeChanged = Date.now()

  if navigator.getGamepads().length # optimisations wow
    loopId = requestAnimationFrame update
  else
    cancelAnimationFrame loopId

gamepad = ->
  loopId = requestAnimationFrame update

# export
module.exports = gamepad
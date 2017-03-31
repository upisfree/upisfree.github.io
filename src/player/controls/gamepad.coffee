# controls/gamepad.coffee
# Gamepad things
config = require '../../config.coffee'
player = require('../player.coffee')()
fullscreen = require '../../utils/fullscreen.coffee'
loopId = 0
firstGamepadId = 0

gamepadsCache = []

_lastTimeVolumeChanged = Date.now() # variable is shared between all gamepads

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

  for gamepad in gamepads
    if gamepad isnt null # if gamepads connected but not activated
      currentVolume = player.getVolume()

      # console.log currentVolume
      # sticks

      # TODO: remove support of non-standart gamepads?
      if gamepad.axes.length is 2 # for non-standard gamepads without sticks (https://google.com/search?q=logitech+precision&tbm=isch)
        if gamepad.axes[1] is -1 
          player.setVolume currentVolume + config.volumeGamepadStep
        else if gamepad.axes[1] is 1
          player.setVolume currentVolume - config.volumeGamepadStep
      else
        volume = Math.round (gamepad.axes[1] * -100 + 100) / 2 # first stick

        if volume is 50
          volume = Math.round (gamepad.axes[3] * -100 + 100) / 2 # second stick

        if (volume isnt 50) and (Date.now() - _lastTimeVolumeChanged > config.gamepadVolumeMaxTime) # 50 is default stick state
          player.setVolume volume

          _lastTimeVolumeChanged = Date.now()

      # # buttons
      # console.log gamepad.buttons[12].pressed
      # if gamepad.buttons[12].pressed 
      #   player.setVolume currentVolume + config.volumeGamepadStep
      # else if gamepad.buttons[13].pressed
      #   player.setVolume currentVolume - config.volumeGamepadStep


  loopId = requestAnimationFrame update
  
  # cancelAnimationFrame loopId

gamepad = ->
  loopId = requestAnimationFrame update

# export
module.exports = gamepad
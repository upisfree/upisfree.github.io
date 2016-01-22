# controls/gamepad.coffee
# Gamepad things
config = require '../config.coffee'
player = require '../player.coffee'

gamepad = ->
  # window.addEventListener 'gamepadconnected', (e) ->
  #   setInterval ->
  #     gamepad = navigator.getGamepads()[1]

  #     console.log gamepad.buttons[0].value 
  #   , 200

# export
module.exports = gamepad
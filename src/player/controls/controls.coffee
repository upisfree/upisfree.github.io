# controls/controls.coffee
# Init all controls
mouse = require './mouse.coffee'
keyboard = require './keyboard.coffee'
touch = require './touch.coffee'
gamepad = require './gamepad.coffee'

controls = ->
  mouse()
  keyboard()
  touch()
  gamepad()

# export
module.exports = controls
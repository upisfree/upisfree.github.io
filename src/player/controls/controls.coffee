# controls/controls.coffee
# Init all controls
mouse = require './mouse.coffee'
keyboard = require './keyboard.coffee'
touch = require './touch.coffee'

controls = ->
  mouse()
  keyboard()
  touch()
  # gamepad doesn't need to init, it updates in tick.coffee

# export
module.exports = controls
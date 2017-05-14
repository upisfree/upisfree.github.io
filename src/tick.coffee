# tick.coffee
# Things inside requestAnimationFrame
gamepadUpdate = require './player/controls/gamepad.coffee'
ads = require './ui/ads.coffee'

tick = ->
  ads.update()
  gamepadUpdate()

  requestAnimationFrame tick

# export
module.exports = tick
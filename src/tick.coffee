# tick.coffee
# Things inside requestAnimationFrame
gamepadUpdate = require './player/controls/gamepad.coffee'
swipeUpdate = require './ui/swipeUpdate.coffee'
ads = require './ui/ads.coffee'

tick = ->
  ads.update()
  gamepadUpdate()
  swipeUpdate()

  requestAnimationFrame tick

# export
module.exports = tick
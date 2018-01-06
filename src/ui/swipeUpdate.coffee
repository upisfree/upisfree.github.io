# ui/swipeUpdate.coffee
# Touch swipe physics
config = require '../config.coffee'
element = require '../utils/element.coffee'

video = element.byId 'video'

mult = null

swipeUpdate = ->
  start = window.swipeStartPoint
  current = window.swipeCurrentPoint

  if start and current
    delta = current.clientX - start.clientX

    if delta < 0
      mult = config.mobileSwipeLeftMult  # left
    else
      mult = config.mobileSwipeRightMult # right

    video.style.transform = "translateX(#{ delta * mult }px)"

# export
module.exports = swipeUpdate
# controls/touch.coffee
# Touch listeners
config = require '../../config.coffee'
element = require '../../utils/element.coffee'
player = require('../player.coffee')()
fullscreen = require '../../utils/fullscreen.coffee'

video = element.byId 'video'

# window.swipeStartPoint = null
# window.swipeCurrentPoint = null

touch = ->
  window.addEventListener 'touchstart', (e) ->
    window.swipeStartPoint = e.touches[0]

    video.classList.remove 'transition'

  window.addEventListener 'touchmove', (e) ->
    e.preventDefault()

    window.swipeCurrentPoint = e.touches[0]

  window.addEventListener 'touchend', (e) ->
    video.classList.add 'transition'

    if window.swipeCurrentPoint.clientX - window.swipeStartPoint.clientX < config.mobileSwipeNextLimit
      video.style.transform = 'translateX(-100%)'

      setTimeout ->
        video.style.transform = 'translateX(0px)'

        player.playNext()
      , 350
    else
      video.style.transform = 'translateX(0px)'

    window.swipeStartPoint = null
    window.swipeCurrentPoint = null

# export
module.exports = touch
# utils/fullscreen.coffee
# Fullscreen things
fullscreen =
  isEnabled: ->
    return document.fullscreenElement or
           document.webkitFullscreenElement or
           document.mozFullScreenElement or
           document.msFullscreenElement
  enter: ->
    if document.body.requestFullscreen
      document.body.requestFullscreen()
    else if document.body.msRequestFullscreen
      document.body.msRequestFullscreen()
    else if document.body.mozRequestFullScreen
      document.body.mozRequestFullScreen()
    else if document.body.webkitRequestFullscreen
      document.body.webkitRequestFullscreen Element.ALLOW_KEYBOARD_INPUT
  exit: ->
    if document.exitFullscreen
      document.exitFullscreen()
    else if document.msExitFullscreen
      document.msExitFullscreen()
    else if document.mozCancelFullScreen
      document.mozCancelFullScreen()
    else if document.webkitExitFullscreen
      document.webkitExitFullscreen()
  switch: ->
    if not fullscreen.isEnabled()
      fullscreen.enter()
    else
      fullscreen.exit()

# export
module.exports = fullscreen
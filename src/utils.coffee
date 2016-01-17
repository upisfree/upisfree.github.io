# utils.coffee
utils =
  random: (min, max) ->
    return Math.floor(Math.random() * (max - min + 1)) + min 
  byId: (a) ->
    return document.getElementById a
  byClass: (a) ->
    return document.getElementsByClassName a
  byTag: (a) ->
    return document.getElementsByTagName a
  shuffleArray: (array) -> # http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    currentIndex = array.length

    while currentIndex
      randomIndex = Math.floor Math.random() * currentIndex
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue

    return array
  fullscreenEnabled: ->
    return document.fullscreenElement or
           document.webkitFullscreenElement or
           document.mozFullScreenElement or
           document.msFullscreenElement
  requestFullscreen: ->
    if document.body.requestFullscreen
      document.body.requestFullscreen()
    else if document.body.msRequestFullscreen
      document.body.msRequestFullscreen()
    else if document.body.mozRequestFullScreen
      document.body.mozRequestFullScreen()
    else if document.body.webkitRequestFullscreen
      document.body.webkitRequestFullscreen Element.ALLOW_KEYBOARD_INPUT
  exitFullscreen: ->
    if document.exitFullscreen
      document.exitFullscreen()
    else if document.msExitFullscreen
      document.msExitFullscreen()
    else if document.mozCancelFullScreen
      document.mozCancelFullScreen()
    else if document.webkitExitFullscreen
      document.webkitExitFullscreen()
  fullscreenSwitch: ->
    if not utils.fullscreenEnabled()
      utils.requestFullscreen()
    else
      utils.exitFullscreen()

# export
module.exports = utils
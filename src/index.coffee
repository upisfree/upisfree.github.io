window.onYouTubeIframeAPIReady = ->
  loadList = require './loadList.coffee'
  controls = require './controls.coffee'
  player = require './player.coffee'
  
  controls()

  loadList()
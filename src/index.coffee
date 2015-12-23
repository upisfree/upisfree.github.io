window.onYouTubeIframeAPIReady = ->
  loadList = require './loadList.coffee'
  player = require './player.coffee'
  
  loadList()

  # window.onclick = ->
  #   player.playNext()
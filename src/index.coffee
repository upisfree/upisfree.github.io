utils = require './utils.coffee'

window.onYouTubeIframeAPIReady = ->
  loadList = require './loadList.coffee'
  player = require './player.coffee'
  
  loadList()

  utils.byId('cover').onclick = ->
    player.playNext()
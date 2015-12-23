window.onYouTubeIframeAPIReady = ->
  player = require './player.coffee'
  
  setTimeout ->
    player.loadById 'mHUIoikgKT0'
  , 2500
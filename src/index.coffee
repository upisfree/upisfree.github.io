# index.coffee
ui = require './ui/ui.coffee'
ui()

window.onYouTubeIframeAPIReady = ->
  require('./player/player.coffee') ->
    requestAnimationFrame require './tick.coffee'
    require('./player/loadList.coffee')()
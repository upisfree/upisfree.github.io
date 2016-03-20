# index.coffee
window.onYouTubeIframeAPIReady = ->
  require('./player.coffee') ->
    require('./loadList.coffee')()
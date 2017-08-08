# index.coffee
ui = require './ui/ui.coffee'
element = require './utils/element.coffee'
isMobile = require 'ismobilejs'

ui()

window.onYouTubeIframeAPIReady = ->
  require('./player/player.coffee') ->
    requestAnimationFrame require './tick.coffee'
    require('./player/loadList.coffee')()

    if isMobile.apple.device
      element.hide element.byId('cover')
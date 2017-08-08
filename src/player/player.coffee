# player.coffee
# Player init and aliases
require '../utils/array.coffee'
storage = require '../utils/storage.coffee'
element = require '../utils/element.coffee'
logo = require '../ui/logo.coffee'
isMobile = require 'ismobilejs'

player = {}
player._loaded = false

player.onReady = ->
  player.yt.setSize window.innerWidth, window.innerHeight
  player._loaded = true

player.onStateChange = (e) ->
  if e.data is YT.PlayerState.ENDED
    player.playNext()

  if isMobile.apple.device
    if e.data is YT.PlayerState.PLAYING
      element.show element.byId('cover')
      logo.iOSReturnText()

    if e.data is YT.PlayerState.PAUSED # :-)
      player.play()

player.onError = (e) ->
  player.playNext()

player.onPlaybackQualityChange = ->

# time to load YT player
player.yt = new YT.Player 'video',
  playerVars:
    'rel': 0 # remove related videos
    'controls': 0 # remove controls
    'showinfo': 0 # remove title
    'autoplay': if isMobile.apple.device then 0 else 1 # ???
    'disablekb': 1 # remove keyboard controls
    'iv_load_policy': 3 # remove annotations
    'playsinline': 1 # iOS fix (enable autoplay)
  events:
    'onReady': player.onReady
    'onStateChange': player.onStateChange
    'onError': player.onError
    'onPlaybackQualityChange': player.onPlaybackQualityChange

# resize on resize (sic!)
window.onresize = ->
  player.yt.setSize window.innerWidth, window.innerHeight

# aliases
player.loadById = (id) ->
  player.yt.loadVideoById id

# I think, I'll never use it :)
player.play = ->
  player.yt.playVideo()

player.pause = ->
  player.yt.pauseVideo()

player.loadById = (id) ->
  player.yt.loadVideoById id

player.cueById = (id) ->
  player.yt.cueVideoById id

player.playNext = (cue = false) ->
  videos = window.videos
  viewed = window.viewed
  viewedVideos = window.viewedVideos

  if window.videos[window.viewed]? # not end?
    if window.viewedVideos.indexOf(window.videos[window.viewed]) is -1 # anti-bayan system
      if not cue
        player.loadById window.videos[window.viewed]
      else
        player.cueById window.videos[window.viewed] # first video loading for iOS devices

      window.viewedVideos.push window.videos[window.viewed]
      storage.set 'viewedVideos', window.viewedVideos

      window.viewed++
    else
      window.viewed++

      player.playNext()
  else
    window.videos.shuffle()
    window.viewed = 0
    window.viewedVideos = []
    storage.set 'viewedVideos', window.viewedVideos

    player.playNext()

player.getVolume = ->
  player.yt.getVolume()

player.setVolume = (a) ->
  player.yt.setVolume a

player.mute = ->
  if player.yt.isMuted()
    player.yt.unMute()
  else
    player.yt.mute()

# export
module.exports = (callback) ->
  if callback
    player.yt.addEventListener 'onReady', ->
      player.yt.setSize window.innerWidth, window.innerHeight
      player._loaded = true

      callback()

    return player
  else
    return player

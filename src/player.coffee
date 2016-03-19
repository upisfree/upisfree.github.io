# player.coffee
# Player init and aliases
require './utils/array.coffee'

player =
  onReady: ->
    player.yt.setSize window.innerWidth, window.innerHeight
    player._loaded = true
  onStateChange: (e) ->
    if e.data is YT.PlayerState.ENDED
      player.playNext()
  onError: ->
    player.playNext()
  onPlaybackQualityChange: ->
  _loaded: false

# time to load YT player
player.yt = new YT.Player 'video',
  playerVars:
    'rel': 0 # remove related videos
    'controls': 0 # remove controls
    'showinfo': 0 # remove title
    'autoplay': 1 # ???
    'disablekb': 1 # remove keyboard controls
    'iv_load_policy': 3 # remove annotations
  events:
    'onReady': player.onReady,
    'onStateChange': player.onStateChange,
    'onError': player.onError,
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

player.playNext = ->
  window.viewed++

  videos = window.videos
  viewed = window.viewed

  if videos[viewed]? # end?
    player.loadById videos[viewed]
  else
    videos.shuffle()
    viewed = 0

    player.loadById videos[viewed]

player.getVolume = ->
  player.yt.getVolume()

player.setVolume = (a) ->
  player.yt.setVolume a

# export
module.exports = player
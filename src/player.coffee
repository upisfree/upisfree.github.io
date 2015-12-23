# player.coffee
# Player init and aliases

player =
  onReady: ->
    player._loaded = true
  onStateChange: (e) ->
    if e.data is 0
      player.playNext()
  onError: ->
    console.log 'onError'
    player.playNext()
  onPlaybackQualityChange: ->
    console.log 'onPlaybackQualityChange'
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

# aliases
player.loadById = (id) ->
  player.yt.loadVideoById id

player.stop = ->
  player.yt.stopVideo()

player.loadById = (id) ->
  player.yt.loadVideoById id

player.playNext = ->
  viewed++
  player.loadById videos[viewed]

# export
module.exports = player
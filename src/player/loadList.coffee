# loadList.coffee
# All about loading playlist with videos
require '../utils/array.coffee'
config = require '../config.coffee'
controls = require './controls/controls.coffee'
player = require('./player.coffee')()
storage = require '../utils/storage.coffee'
isMobile = require 'ismobilejs'

# store it as a global
window.videos = []
window.viewed = 0
window.viewedVideos = if storage.get('viewedVideos')? then storage.get('viewedVideos') else []

# for more randomness
# config.playlists.shuffle() # second playlist has just funny videos in the beginning, it's bad

# value for load all playlists
_currentPlaylist = 0

loadList = (token) ->
  url = 'https://www.googleapis.com/youtube/v3/playlistItems' +
    '?part=snippet' +
    '&maxResults=50' +
    '&playlistId=' + config.playlists[_currentPlaylist] +
    '&key=' + config.key

  url += '&pageToken=' + token if token?

  xhr = new XMLHttpRequest()
  xhr.open 'GET', url, true
  xhr.onload = ->
    res = JSON.parse this.responseText

    videos.push item.snippet.resourceId.videoId for item in res.items

    if res.nextPageToken or _currentPlaylist isnt config.playlists.length - 1 # recursively load all videos using nextPageToken
      # fast play
      if videos.length >= config.fastPlay and window.viewed is 0 and player._loaded
        videos.shuffle()

        controls()

        if not isMobile.apple.device
          player.playNext()
        else
          player.playNext true

      token = if res.nextPageToken? then res.nextPageToken else null

      if not token? # next playlist?
        _currentPlaylist += 1

      loadList token
    else
      videos.splice 0, window.viewed # remove videos that user already saw
      videos.shuffle()

  xhr.send()

# export
module.exports = loadList
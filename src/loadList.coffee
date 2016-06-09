# loadList.coffee
# All about loading playlist with videos
require './utils/array.coffee'
config = require './config.coffee'
initControls = require './controls/init.coffee'
player = require('./player.coffee')()
storage = require './utils/storage.coffee'

# store it as a global
window.videos = []
window.viewed = 0

loadList = (token) ->
  url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
                                                            '&maxResults=50' +
                                                            '&playlistId=' + config.playlistId +
                                                            '&key=' + config.key

  url += '&pageToken=' + token if token?

  if storage.get('videos') and storage.get('revision') is config.revision
    window.videos = storage.get 'videos'
    window.videos.shuffle()

    initControls()

    player.playNext()
  else
    xhr = new XMLHttpRequest()
    xhr.open 'GET', url, true
    xhr.onload = ->
      res = JSON.parse this.responseText

      window.videos.push item.snippet.resourceId.videoId for item in res.items

      if res.nextPageToken # recursively load all videos using nextPageToken
        # fast play
        if window.videos.length >= config.fastPlay and window.viewed is 0 and player._loaded
          window.videos.shuffle()

          initControls()

          player.playNext()

        loadList res.nextPageToken
      else
        storage.set 'videos', window.videos
        storage.set 'revision', config.revision

        window.videos.splice 0, window.viewed # remove videos that user already saw
        window.videos.shuffle()

    xhr.send()

# export
module.exports = loadList
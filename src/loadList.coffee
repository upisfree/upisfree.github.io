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
  videos = window.videos  
  viewed = window.viewed

  url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
                                                            '&maxResults=50' +
                                                            '&playlistId=' + config.playlistId +
                                                            '&key=' + config.key

  url += '&pageToken=' + token if token?

  xhr = new XMLHttpRequest()
  xhr.open 'GET', url, true
  xhr.onload = ->
    res = JSON.parse this.responseText

    videos.push item.snippet.resourceId.videoId for item in res.items

    if res.nextPageToken # recursively load all videos using nextPageToken
      # fast play
      if videos.length >= config.fastPlay and viewed is 0 and player._loaded
        videos.shuffle()

        initControls()

        player.playNext()

      loadList res.nextPageToken
    else
      videos.splice 0, viewed # remove videos that user already saw
      videos.shuffle()

  xhr.send()

# export
module.exports = loadList
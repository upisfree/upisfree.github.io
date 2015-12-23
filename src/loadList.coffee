# loadList.coffee
# All about loading playlist with videos

config = require './config.coffee'
player = require './player.coffee'
utils = require './utils.coffee'

# store it as global
window.videos = []
window.viewed = 0

loadList = (token) ->
  url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
                                                            '&maxResults=50' +
                                                            '&playlistId=' + config.playlistId +
                                                            '&key=' + config.key

  url += '&pageToken=' + token if token?

  xhr = new XMLHttpRequest()
  xhr.open 'GET', url, true
  xhr.onload = ->
    res = JSON.parse this.responseText

    window.videos.push item.snippet.resourceId.videoId for item in res.items

    if res.nextPageToken # recursively load all videos usin nextPageToken
      if window.videos.length >= config.fastPlay and window.viewed is 0 and player._loaded # fast play
        window.videos = utils.shuffleArray window.videos

        player.playNext()

      loadList res.nextPageToken
    else
      window.videos = utils.shuffleArray window.videos

  xhr.send()

loadList

# export
module.exports = loadList
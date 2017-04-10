# ui/ui.coffee
# Ads init
require '../utils/array.coffee'
element = require '../utils/element.coffee'
config = require '../config.coffee'

ads = ->
  url = './assets/ads.json' # source: http://telestroka.ru/

  xhr = new XMLHttpRequest()
  xhr.open 'GET', url, true
  xhr.onload = ->
    res = JSON.parse this.responseText

    res.shuffle()

    element.byId('ads').textContent = res.toString()
    # element.byId('ads').textContent = res.toString()

  xhr.send()

# export
module.exports = ads
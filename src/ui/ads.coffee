# ui/ui.coffee
# Ads init
require '../utils/array.coffee'
element = require '../utils/element.coffee'
config = require '../config.coffee'
isMobile = require 'ismobilejs'

animationSpeed = 1
e = null

ads =
  init: ->
    url = './assets/ads.json' # source: http://telestroka.ru

    xhr = new XMLHttpRequest()
    xhr.open 'GET', url, true
    xhr.onload = ->
      res = JSON.parse this.responseText

      res.shuffle()

      e = element.byId('ads')

      e.textContent = res.join ' '

      if isMobile.any
        animationSpeed = 3

    xhr.send()
  update: ->
    left = e.style.left.slice(0, -2) # remove 'px'

    if Math.abs(left) >= e.offsetWidth
      left = window.innerWidth

    e.style.left = (left - animationSpeed) + 'px'

# export
module.exports = ads
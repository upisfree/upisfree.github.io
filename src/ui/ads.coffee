# ui/ads.coffee
# Ads init
require '../utils/array.coffee'
element = require '../utils/element.coffee'
config = require '../config.coffee'
isMobile = require 'ismobilejs'

animationSpeed = 2
left = 0
el = null

iOStext = 'НАЖМИ НА КРАСНУЮ КНОПКУ'

ads =
  init: ->
    url = './assets/ads.json' # source: http://telestroka.ru

    xhr = new XMLHttpRequest()
    xhr.open 'GET', url, true
    xhr.onload = ->
      res = JSON.parse this.responseText

      res.shuffle()

      el = element.byId 'ads'

      el.textContent = res.join ' '

      if isMobile.apple.device
        animationSpeed = 0.25

    xhr.send()
  update: ->
    if Math.abs(left) >= el.offsetWidth
      left = window.innerWidth

    left -= animationSpeed

    el.style.transform = "translateX(#{ left - animationSpeed }px)"

# export
module.exports = ads
# ui/logo.coffee
# Logo init
element = require '../utils/element.coffee'
config = require '../config.coffee'
isMobile = require 'ismobilejs'

e = null

logo =
  init: ->
    e = element.byId('logo')

    if isMobile.apple.device
      e.textContent = config.iOSLogoText

  iOSReturnText: ->
    e.textContent = config.logoText

# export
module.exports = logo
# ui/ui.coffee
# UI init
ads = require './ads.coffee'
logo = require './logo.coffee'

ui = ->
  ads.init()
  logo.init()

# export
module.exports = ui
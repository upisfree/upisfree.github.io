# ui/ui.coffee
# UI init
ads = require './ads.coffee'

ui = ->
  ads.init()

# export
module.exports = ui
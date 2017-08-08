# utils/element.coffee
# DOM aliases
element =
  byId: (a) ->
    return document.getElementById a
  byClass: (a) ->
    return document.getElementsByClassName a
  byTag: (a) ->
    return document.getElementsByTagName a
  show: (e) ->
    e.style.display = 'block'
  hide: (e) ->
    e.style.display = 'none'

# export
module.exports = element
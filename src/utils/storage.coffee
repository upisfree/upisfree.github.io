# utils/storage.coffee
# localStorage aliases
storage =
  get: (k) ->
    return localStorage.getItem k
  set: (k, v) ->
    localStorage.setItem k, v
  remove: (k) ->
    localStorage.removeItem k
  clear: ->
    localStorage.clear()
  isEmpty: (k) ->
    if storage.get k
      return true
    else
      return false

# export
module.exports = storage
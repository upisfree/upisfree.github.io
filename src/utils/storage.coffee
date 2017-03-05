# utils/storage.coffee
# localStorage aliases
storage =
  get: (k) ->
    return JSON.parse localStorage.getItem k
  set: (k, v) ->
    localStorage.setItem k, JSON.stringify v
  remove: (k) ->
    localStorage.removeItem k
  clear: ->
    localStorage.clear()

# export
module.exports = storage
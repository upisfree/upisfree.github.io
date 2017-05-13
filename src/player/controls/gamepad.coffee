# controls/gamepad.coffee
# Gamepad things
config = require '../../config.coffee'
player = require('../player.coffee')()
fullscreen = require '../../utils/fullscreen.coffee'
loopId = 0

# Xbox mapping
GAMEPAD =
  A: 0 # 🞪
  B: 1 # ⭘
  Y: 2 # 🛆
  X: 3 # 🞎
  L1: 4
  R1: 5
  L2: 6
  R2: 7
  SELECT: 8
  START: 9
  L3: 10 # left stick
  R3: 11 # right stick
  UP: 12
  DOWN: 13
  LEFT: 14
  RIGHT: 15
  LOGO: 16

_lastTimeVolumeChanged = 0 # variable is shared between all gamepads
_cache = [] # gamepads cache

trigger = (i) ->
  switch i
    when GAMEPAD.A, GAMEPAD.RIGHT, GAMEPAD.R1
      player.playNext()
    when GAMEPAD.B
      player.mute()

    # I know about keypress simulation, but is it worth it?
    # when GAMEPAD.Y, GAMEPAD.START # Chrome: Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
    #   fullscreen.switch()

    # when GAMEPAD.LOGO # it's for future about section
      # ...

updateCache = (gamepad, i) ->
  buttons = []
  a = 0
  b = 0

  if _cache[i]
    while a < _cache[i].length
      if _cache[i][a] is true and gamepad.buttons[a].pressed is false # previous and current values
        trigger a # sorry about normal events

      a++

  while b < gamepad.buttons.length
    if _cache[i]
      _cache[i][b] = gamepad.buttons[b].pressed
    else
      buttons.push gamepad.buttons[b].pressed

    b++

  if not _cache[i]
    _cache.push buttons



update = ->
  gamepads = navigator.getGamepads()
  gamepadIndex = 0 # don't want to use indexOf here

  for gamepad in gamepads
    if gamepad isnt null and gamepad.mapping is 'standard' # if gamepads connected but not activated (non-standard mappings support removed here: #431ae1b)
      currentVolume = player.getVolume()

      # sticks
      volume = Math.round (gamepad.axes[1] * -100 + 100) / 2 # first stick

      if volume is 50
        volume = Math.round (gamepad.axes[3] * -100 + 100) / 2 # second stick

      if (volume isnt 50) and (Date.now() - _lastTimeVolumeChanged > config.gamepadVolumeInterval) # 50 is default stick state
        player.setVolume volume

        _lastTimeVolumeChanged = Date.now()

      # buttons
      if gamepad.buttons[12].pressed # arrow up
        player.setVolume currentVolume + config.volumeGamepadStep
      else if gamepad.buttons[13].pressed # arrow down
        player.setVolume currentVolume - config.volumeGamepadStep

      updateCache gamepad, gamepadIndex
      gamepadIndex++

  loopId = requestAnimationFrame update
  
  # cancelAnimationFrame loopId

gamepad = ->
  loopId = requestAnimationFrame update

# export
module.exports = gamepad
# config.coffee
# I can't understand, what's here
config =
  playlists: ['PLy_pe5XDDZ1IyDxrlXRuz-Qz4gBft5cmt', 'PLy_pe5XDDZ1LrigQrKoQMKAKqtcxlnjEr']
  key: 'AIzaSyA8Wb8ZkXnc9XfcRDLON3gF0Vn7NkiQEWw'
  fastPlay: 250 # the number of video downloads after which playback starts (I can't think normal name :)
  volumeStep: 5 # mouse volume step
  volumeGamepadStep: 2.5 # because here I use requestAnimationFrame for loop and it's much faster than mouse wheel or keyboard events 
  doubleClickInterval: 175 # time between clicks for detecting double click
  gamepadVolumeInterval: 125 # time between volume change for detecting is gamepad stick's position is null (vertical)
  logoText: 'UP TV'
  iOSLogoText: 'НАЖМИ НА ЭКРАН'
  mobileSwipeNextLimit: -200
  mobileSwipeLeftMult: 0.65
  mobileSwipeRightMult: 0.25

# export
module.exports = config
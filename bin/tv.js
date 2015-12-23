(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.onYouTubeIframeAPIReady = function() {
  var player;
  player = require('./player.coffee');
  return setTimeout(function() {
    return player.loadById('mHUIoikgKT0');
  }, 2500);
};


},{"./player.coffee":2}],2:[function(require,module,exports){
var player;

player = {
  onReady: function() {
    return player._loaded = false;
  },
  onStateChange: function() {
    return alert('onStateChange');
  },
  onError: function() {
    return alert('onError');
  },
  onPlaybackQualityChange: function() {
    return alert('onPlaybackQualityChange');
  },
  _loaded: false
};

player.yt = new YT.Player('video', {
  playerVars: {
    'rel': 0,
    'controls': 0,
    'showinfo': 0,
    'autoplay': 1,
    'disablekb': 1,
    'iv_load_policy': 3
  },
  events: {
    'onReady': player.onReady,
    'onStateChange': player.onStateChange,
    'onError': player.onError,
    'onPlaybackQualityChange': player.onPlaybackQualityChange
  }
});

player.loadById = function(id) {
  return player.yt.loadVideoById(id);
};

player.stop = function() {
  return player.yt.stopVideo();
};

player.loadById = function(id) {
  return player.yt.loadVideoById(id);
};

module.exports = player;


},{}]},{},[1]);

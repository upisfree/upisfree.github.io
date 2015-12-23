(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var config;

config = {
  playlistId: 'PLy_pe5XDDZ1IyDxrlXRuz-Qz4gBft5cmt',
  key: 'AIzaSyA8Wb8ZkXnc9XfcRDLON3gF0Vn7NkiQEWw',
  fastPlay: 250
};

module.exports = config;


},{}],2:[function(require,module,exports){
window.onYouTubeIframeAPIReady = function() {
  var player, playlist;
  playlist = require('./playlist.coffee');
  player = require('./player.coffee');
  return playlist.load();
};


},{"./player.coffee":3,"./playlist.coffee":4}],3:[function(require,module,exports){
var player;

player = {
  onReady: function() {
    return player._loaded = true;
  },
  onStateChange: function(e) {
    if (e.data === 0) {
      return player.playNext();
    }
  },
  onError: function() {
    console.log('onError');
    return player.playNext();
  },
  onPlaybackQualityChange: function() {
    return console.log('onPlaybackQualityChange');
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

player.playNext = function() {
  viewed++;
  return player.loadById(videos[viewed]);
};

module.exports = player;


},{}],4:[function(require,module,exports){
var config, load, player, utils;

config = require('./config.coffee');

player = require('./player.coffee');

utils = require('./utils.coffee');

window.videos = [];

window.viewed = 0;

load = function(token) {
  var url, xhr;
  url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' + '&maxResults=50' + '&playlistId=' + config.playlistId + '&key=' + config.key;
  if (token != null) {
    url += '&pageToken=' + token;
  }
  xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    var i, item, len, ref, res;
    res = JSON.parse(this.responseText);
    ref = res.items;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      window.videos.push(item.snippet.resourceId.videoId);
    }
    if (res.nextPageToken) {
      if (window.videos.length >= config.fastPlay && window.viewed === 0 && player._loaded) {
        window.videos = utils.shuffleArray(window.videos);
        player.playNext();
      }
      return load(res.nextPageToken);
    } else {
      return window.videos = utils.shuffleArray(window.videos);
    }
  };
  return xhr.send();
};

loadList;

module.exports = loadList;


},{"./config.coffee":1,"./player.coffee":3,"./utils.coffee":5}],5:[function(require,module,exports){
var utils;

utils = {
  random: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  shuffleArray: function(array) {
    var currentIndex, randomIndex, temporaryValue;
    currentIndex = array.length;
    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
};

module.exports = utils;


},{}]},{},[2]);

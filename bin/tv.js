(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var config;

config = {
  playlistId: 'PLy_pe5XDDZ1IyDxrlXRuz-Qz4gBft5cmt',
  key: 'AIzaSyA8Wb8ZkXnc9XfcRDLON3gF0Vn7NkiQEWw',
  revision: 3,
  fastPlay: 250,
  volumeStep: 10,
  doubleClickInterval: 175
};

module.exports = config;


},{}],2:[function(require,module,exports){
var config, gamepad, player;

config = require('../config.coffee');

player = require('../player.coffee')();

gamepad = function() {};

module.exports = gamepad;


},{"../config.coffee":1,"../player.coffee":9}],3:[function(require,module,exports){
var gamepad, initControls, keyboard, mouse, touch;

mouse = require('./mouse.coffee');

keyboard = require('./keyboard.coffee');

touch = require('./touch.coffee');

gamepad = require('./gamepad.coffee');

initControls = function() {
  mouse();
  keyboard();
  touch();
  return gamepad();
};

module.exports = initControls;


},{"./gamepad.coffee":2,"./keyboard.coffee":4,"./mouse.coffee":5,"./touch.coffee":6}],4:[function(require,module,exports){
var config, fullscreen, keyboard, player;

config = require('../config.coffee');

player = require('../player.coffee')();

fullscreen = require('../utils/fullscreen.coffee');

keyboard = function() {
  window.onkeydown = function(e) {
    var current;
    current = player.getVolume();
    switch (e.keyCode) {
      case 38:
        return player.setVolume(current + config.volumeStep);
      case 40:
        return player.setVolume(current - config.volumeStep);
    }
  };
  return window.onkeyup = function(e) {
    switch (e.keyCode) {
      case 32:
      case 13:
      case 39:
        return player.playNext();
      case 70:
        return fullscreen["switch"]();
      case 27:
        if (fullscreen.isEnabled()) {
          return fullscreen.exit();
        }
    }
  };
};

module.exports = keyboard;


},{"../config.coffee":1,"../player.coffee":9,"../utils/fullscreen.coffee":11}],5:[function(require,module,exports){
var config, fullscreen, mouse, player;

config = require('../config.coffee');

player = require('../player.coffee')();

fullscreen = require('../utils/fullscreen.coffee');

mouse = function() {
  window._clicks = 0;
  window.onclick = function(e) {
    window._clicks++;
    if (window._clicks === 1) {
      return setTimeout(function() {
        if (window._clicks === 1) {
          player.playNext();
        } else if (2) {
          fullscreen["switch"]();
        } else {
          return;
        }
        return window._clicks = 0;
      }, config.doubleClickInterval);
    }
  };
  return window.onmousewheel = function(e) {
    var current;
    current = player.getVolume();
    if (e.wheelDelta > 0) {
      return player.setVolume(current + config.volumeStep);
    } else {
      return player.setVolume(current - config.volumeStep);
    }
  };
};

module.exports = mouse;


},{"../config.coffee":1,"../player.coffee":9,"../utils/fullscreen.coffee":11}],6:[function(require,module,exports){
var player, touch;

player = require('../player.coffee')();

touch = function() {
  return window.addEventListener('touchmove', function(e) {
    e.preventDefault();
    return player.setVolume(100 - (Math.round(e.touches[0].clientY * 100 / window.innerHeight)));
  });
};

module.exports = touch;


},{"../player.coffee":9}],7:[function(require,module,exports){
window.onYouTubeIframeAPIReady = function() {
  return require('./player.coffee')(function() {
    return require('./loadList.coffee')();
  });
};


},{"./loadList.coffee":8,"./player.coffee":9}],8:[function(require,module,exports){
var config, initControls, loadList, player, storage;

require('./utils/array.coffee');

config = require('./config.coffee');

initControls = require('./controls/init.coffee');

player = require('./player.coffee')();

storage = require('./utils/storage.coffee');

window.videos = [];

window.viewed = 0;

loadList = function(token) {
  var url, xhr;
  url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' + '&maxResults=50' + '&playlistId=' + config.playlistId + '&key=' + config.key;
  if (token != null) {
    url += '&pageToken=' + token;
  }
  if (storage.get('videos') && storage.get('revision') === config.revision) {
    window.videos = storage.get('videos');
    window.videos.shuffle();
    initControls();
    return player.playNext();
  } else {
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
          window.videos.shuffle();
          initControls();
          player.playNext();
        }
        return loadList(res.nextPageToken);
      } else {
        storage.set('videos', window.videos);
        storage.set('revision', config.revision);
        window.videos.splice(0, window.viewed);
        return window.videos.shuffle();
      }
    };
    return xhr.send();
  }
};

module.exports = loadList;


},{"./config.coffee":1,"./controls/init.coffee":3,"./player.coffee":9,"./utils/array.coffee":10,"./utils/storage.coffee":12}],9:[function(require,module,exports){
var player;

require('./utils/array.coffee');

player = {};

player._loaded = false;

player.onReady = function() {
  player.yt.setSize(window.innerWidth, window.innerHeight);
  return player._loaded = true;
};

player.onStateChange = function(e) {
  if (e.data === YT.PlayerState.ENDED) {
    return player.playNext();
  }
};

player.onError = function(e) {
  return player.playNext();
};

player.onPlaybackQualityChange = function() {};

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

window.onresize = function() {
  return player.yt.setSize(window.innerWidth, window.innerHeight);
};

player.loadById = function(id) {
  return player.yt.loadVideoById(id);
};

player.play = function() {
  return player.yt.playVideo();
};

player.pause = function() {
  return player.yt.pauseVideo();
};

player.loadById = function(id) {
  return player.yt.loadVideoById(id);
};

player.playNext = function() {
  var videos, viewed;
  window.viewed++;
  videos = window.videos;
  viewed = window.viewed;
  if (videos[viewed] != null) {
    return player.loadById(videos[viewed]);
  } else {
    videos.shuffle();
    viewed = 0;
    return player.loadById(videos[viewed]);
  }
};

player.getVolume = function() {
  return player.yt.getVolume();
};

player.setVolume = function(a) {
  return player.yt.setVolume(a);
};

module.exports = function(callback) {
  if (callback) {
    player.yt.addEventListener('onReady', function() {
      player.yt.setSize(window.innerWidth, window.innerHeight);
      player._loaded = true;
      return callback();
    });
    return player;
  } else {
    return player;
  }
};


},{"./utils/array.coffee":10}],10:[function(require,module,exports){
Array.prototype.shuffle = function() {
  var currentIndex, randomIndex, results, temporaryValue;
  currentIndex = this.length;
  results = [];
  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    results.push(this[randomIndex] = temporaryValue);
  }
  return results;
};


},{}],11:[function(require,module,exports){
var fullscreen;

fullscreen = {
  isEnabled: function() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  },
  enter: function() {
    if (document.body.requestFullscreen) {
      return document.body.requestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      return document.body.msRequestFullscreen();
    } else if (document.body.mozRequestFullScreen) {
      return document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) {
      return document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  },
  exit: function() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    }
  },
  "switch": function() {
    if (!fullscreen.isEnabled()) {
      return fullscreen.enter();
    } else {
      return fullscreen.exit();
    }
  }
};

module.exports = fullscreen;


},{}],12:[function(require,module,exports){
var storage;

storage = {
  get: function(k) {
    return JSON.parse(localStorage.getItem(k));
  },
  set: function(k, v) {
    return localStorage.setItem(k, JSON.stringify(v));
  },
  remove: function(k) {
    return localStorage.removeItem(k);
  },
  clear: function() {
    return localStorage.clear();
  }
};

module.exports = storage;


},{}]},{},[7]);

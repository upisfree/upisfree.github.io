!function e(n,t,o){function r(u,l){if(!t[u]){if(!n[u]){var s="function"==typeof require&&require;if(!l&&s)return s(u,!0);if(i)return i(u,!0);var c=new Error("Cannot find module '"+u+"'");throw c.code="MODULE_NOT_FOUND",c}var f=t[u]={exports:{}};n[u][0].call(f.exports,function(e){var t=n[u][1][e];return r(t?t:e)},f,f.exports,e,n,t,o)}return t[u].exports}for(var i="function"==typeof require&&require,u=0;u<o.length;u++)r(o[u]);return r}({1:[function(e,n,t){var o;o={playlists:["PLy_pe5XDDZ1IyDxrlXRuz-Qz4gBft5cmt","PLy_pe5XDDZ1LrigQrKoQMKAKqtcxlnjEr"],key:"AIzaSyA8Wb8ZkXnc9XfcRDLON3gF0Vn7NkiQEWw",fastPlay:250,volumeStep:5,volumeGamepadStep:2.5,doubleClickInterval:175,gamepadVolumeInterval:125},n.exports=o},{}],2:[function(e,n,t){var o;o=e("./ui/ui.coffee"),o(),window.onYouTubeIframeAPIReady=function(){return e("./player/player.coffee")(function(){return requestAnimationFrame(e("./tick.coffee")),e("./player/loadList.coffee")()})}},{"./player/loadList.coffee":8,"./player/player.coffee":9,"./tick.coffee":10,"./ui/ui.coffee":12}],3:[function(e,n,t){var o,r,i,u;i=e("./mouse.coffee"),r=e("./keyboard.coffee"),u=e("./touch.coffee"),o=function(){return i(),r(),u()},n.exports=o},{"./keyboard.coffee":5,"./mouse.coffee":6,"./touch.coffee":7}],4:[function(e,n,t){var o,r,i,u,l,s,c,f,a;u=e("../../config.coffee"),s=e("../player.coffee")(),l=e("../../utils/fullscreen.coffee"),o={A:0,B:1,Y:2,X:3,L1:4,R1:5,L2:6,R2:7,SELECT:8,START:9,L3:10,R3:11,UP:12,DOWN:13,LEFT:14,RIGHT:15,LOGO:16},i=0,r=[],c=function(e){switch(e){case o.A:case o.RIGHT:case o.R1:return s.playNext();case o.B:return s.mute()}},a=function(e,n){var t,o,i;if(i=[],t=0,o=0,r[n])for(;t<r[n].length;)r[n][t]===!0&&e.buttons[t].pressed===!1&&c(t),t++;for(;o<e.buttons.length;)r[n]?r[n][o]=e.buttons[o].pressed:i.push(e.buttons[o].pressed),o++;if(!r[n])return r.push(i)},f=function(){var e,n,t,o,r,l,c,f;for(o=navigator.getGamepads(),t=0,c=[],r=0,l=o.length;r<l;r++)n=o[r],null!==n&&"standard"===n.mapping?(e=s.getVolume(),f=Math.round((n.axes[1]*-100+100)/2),50===f&&(f=Math.round((n.axes[3]*-100+100)/2)),50!==f&&Date.now()-i>u.gamepadVolumeInterval&&(s.setVolume(f),i=Date.now()),n.buttons[12].pressed?s.setVolume(e+u.volumeGamepadStep):n.buttons[13].pressed&&s.setVolume(e-u.volumeGamepadStep),a(n,t),c.push(t++)):c.push(void 0);return c},n.exports=f},{"../../config.coffee":1,"../../utils/fullscreen.coffee":15,"../player.coffee":9}],5:[function(e,n,t){var o,r,i,u;o=e("../../config.coffee"),u=e("../player.coffee")(),r=e("../../utils/fullscreen.coffee"),i=function(){return window.onkeydown=function(e){var n;switch(n=u.getVolume(),e.keyCode){case 38:return u.setVolume(n+o.volumeStep);case 40:return u.setVolume(n-o.volumeStep);case 9:return e.preventDefault()}},window.onkeyup=function(e){switch(e.keyCode){case 32:case 13:case 39:case 9:return u.playNext();case 70:return r["switch"]();case 77:return u.mute();case 27:if(r.isEnabled())return r.exit()}}},n.exports=i},{"../../config.coffee":1,"../../utils/fullscreen.coffee":15,"../player.coffee":9}],6:[function(e,n,t){var o,r,i,u;o=e("../../config.coffee"),u=e("../player.coffee")(),r=e("../../utils/fullscreen.coffee"),i=function(){return window._clicks=0,window.onclick=function(e){if(window._clicks++,1===window._clicks)return setTimeout(function(){return 1===window._clicks?u.playNext():r["switch"](),window._clicks=0},o.doubleClickInterval)},window.onmousewheel=function(e){var n;return n=u.getVolume(),e.wheelDelta>0?u.setVolume(n+o.volumeStep):u.setVolume(n-o.volumeStep)}},n.exports=i},{"../../config.coffee":1,"../../utils/fullscreen.coffee":15,"../player.coffee":9}],7:[function(e,n,t){var o,r;o=e("../player.coffee")(),r=function(){return window.addEventListener("touchmove",function(e){return e.preventDefault(),o.setVolume(100-Math.round(100*e.touches[0].clientY/window.innerHeight))})},n.exports=r},{"../player.coffee":9}],8:[function(e,n,t){var o,r,i,u,l,s;e("../utils/array.coffee"),r=e("../config.coffee"),i=e("./controls/controls.coffee"),l=e("./player.coffee")(),s=e("../utils/storage.coffee"),window.videos=[],window.viewed=0,window.viewedVideos=null!=s.get("viewedVideos")?s.get("viewedVideos"):[],o=0,u=function(e){var n,t;return n="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId="+r.playlists[o]+"&key="+r.key,null!=e&&(n+="&pageToken="+e),t=new XMLHttpRequest,t.open("GET",n,!0),t.onload=function(){var n,t,s,c,f;for(f=JSON.parse(this.responseText),c=f.items,n=0,s=c.length;n<s;n++)t=c[n],videos.push(t.snippet.resourceId.videoId);return f.nextPageToken||o!==r.playlists.length-1?(videos.length>=r.fastPlay&&0===window.viewed&&l._loaded&&(videos.shuffle(),i(),l.playNext()),e=null!=f.nextPageToken?f.nextPageToken:null,null==e&&(o+=1),u(e)):(videos.splice(0,window.viewed),videos.shuffle())},t.send()},n.exports=u},{"../config.coffee":1,"../utils/array.coffee":13,"../utils/storage.coffee":16,"./controls/controls.coffee":3,"./player.coffee":9}],9:[function(e,n,t){var o,r;e("../utils/array.coffee"),r=e("../utils/storage.coffee"),o={},o._loaded=!1,o.onReady=function(){return o.yt.setSize(window.innerWidth,window.innerHeight),o._loaded=!0},o.onStateChange=function(e){if(e.data===YT.PlayerState.ENDED)return o.playNext()},o.onError=function(e){return o.playNext()},o.onPlaybackQualityChange=function(){},o.yt=new YT.Player("video",{playerVars:{rel:0,controls:0,showinfo:0,autoplay:1,disablekb:1,iv_load_policy:3,playsinline:1},events:{onReady:o.onReady,onStateChange:o.onStateChange,onError:o.onError,onPlaybackQualityChange:o.onPlaybackQualityChange}}),window.onresize=function(){return o.yt.setSize(window.innerWidth,window.innerHeight)},o.loadById=function(e){return o.yt.loadVideoById(e)},o.play=function(){return o.yt.playVideo()},o.pause=function(){return o.yt.pauseVideo()},o.loadById=function(e){return o.yt.loadVideoById(e,0,"tiny")},o.playNext=function(){var e,n,t;return e=window.videos,n=window.viewed,t=window.viewedVideos,null!=window.videos[window.viewed]?window.viewedVideos.indexOf(window.videos[window.viewed])===-1?(o.loadById(window.videos[window.viewed]),window.viewedVideos.push(window.videos[window.viewed]),r.set("viewedVideos",window.viewedVideos),window.viewed++):(window.viewed++,o.playNext()):(window.videos.shuffle(),window.viewed=0,window.viewedVideos=[],r.set("viewedVideos",window.viewedVideos),o.playNext())},o.getVolume=function(){return o.yt.getVolume()},o.setVolume=function(e){return o.yt.setVolume(e)},o.mute=function(){return o.yt.isMuted()?o.yt.unMute():o.yt.mute()},n.exports=function(e){return e?(o.yt.addEventListener("onReady",function(){return o.yt.setSize(window.innerWidth,window.innerHeight),o._loaded=!0,e()}),o):o}},{"../utils/array.coffee":13,"../utils/storage.coffee":16}],10:[function(e,n,t){var o,r,i;r=e("./player/controls/gamepad.coffee"),o=e("./ui/ads.coffee"),i=function(){return o.update(),r(),requestAnimationFrame(i)},n.exports=i},{"./player/controls/gamepad.coffee":4,"./ui/ads.coffee":11}],11:[function(e,n,t){var o,r,i,u,l;e("../utils/array.coffee"),l=e("../utils/element.coffee"),i=e("../config.coffee"),r=1,u=null,o={init:function(){var e,n;return e="./assets/ads.json",n=new XMLHttpRequest,n.open("GET",e,!0),n.onload=function(){var e;return e=JSON.parse(this.responseText),e.shuffle(),u=l.byId("ads"),u.textContent=e.join(" ")},n.send()},update:function(){var e;return e=u.style.left.slice(0,-2),Math.abs(e)>=u.offsetWidth&&(e=window.innerWidth),u.style.left=e-r+"px"}},n.exports=o},{"../config.coffee":1,"../utils/array.coffee":13,"../utils/element.coffee":14}],12:[function(e,n,t){var o,r;o=e("./ads.coffee"),r=function(){return o.init()},n.exports=r},{"./ads.coffee":11}],13:[function(e,n,t){Array.prototype.shuffle=function(){var e,n,t,o;for(e=this.length,t=[];e;)n=Math.floor(Math.random()*e),e-=1,o=this[e],this[e]=this[n],t.push(this[n]=o);return t}},{}],14:[function(e,n,t){var o;o={byId:function(e){return document.getElementById(e)},byClass:function(e){return document.getElementsByClassName(e)},byTag:function(e){return document.getElementsByTagName(e)}},n.exports=o},{}],15:[function(e,n,t){var o;o={isEnabled:function(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement},enter:function(){return document.body.requestFullscreen?document.body.requestFullscreen():document.body.msRequestFullscreen?document.body.msRequestFullscreen():document.body.mozRequestFullScreen?document.body.mozRequestFullScreen():document.body.webkitRequestFullscreen?document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT):void 0},exit:function(){return document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():void 0},"switch":function(){return o.isEnabled()?o.exit():o.enter()}},n.exports=o},{}],16:[function(e,n,t){var o;o={get:function(e){return JSON.parse(localStorage.getItem(e))},set:function(e,n){return localStorage.setItem(e,JSON.stringify(n))},remove:function(e){return localStorage.removeItem(e)},clear:function(){return localStorage.clear()}},n.exports=o},{}]},{},[2]);
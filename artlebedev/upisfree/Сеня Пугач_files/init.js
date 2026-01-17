(function (d, w, i) {
function addS () {
var n = d.getElementsByTagName("script")[0],
s = d.createElement("script"),
f = function () {
n.parentNode.insertBefore(s, n);
};
s.type = "text/javascript";
s.async = true;
s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//metricus.artlebedev.ru/watch.js?";
if (i && i.width) {
s.src += '&w=' + i.width + '&h=' + i.height;
}
s.src += '&t=' + encodeURIComponent(document.title.toString());
s.src += '&r_u=' + encodeURIComponent(document.location.toString());
if (w.opera == "[object Opera]") {
d.addEventListener("DOMContentLoaded", f, false);
} else { f(); }
}
addS();
var ll = document.location.toString();
setInterval(function () {
var cll = document.location.toString();
if (cll != ll){
ll = cll;
setTimeout(function () {
addS();
}, 1000);
}
}, 1000);
})(document, window, screen);
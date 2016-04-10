// ripple.js

function insertRipple(evt_) {
  var r = document.createElement("UI-RIPPLE");
  var g = evt_.currentTarget.getBoundingClientRect();
  r.style.left = evt_.clientX - g.left - 100 + "px";
  r.style.top = evt_.clientY - g.top - 100 + "px";
  evt_.currentTarget.appendChild(r);
  setTimeout(function(){
    r.parentNode.removeChild(r);
  },500);
}

function insertRelativeRipple(evt_) {
  var r = document.createElement("UI-RIPPLE");
  evt_.currentTarget.insertBefore(r, evt_.currentTarget.getElementsByClassName("ui-ripples")[0]);
  setTimeout(function(){
    r.parentNode.removeChild(r);
  },500);

}

(function(){
  /*var els = [].concat(uis("ui-raised-button"),uis("ui-floating-button"),uis("ui-flat-button"));
  for (var i = 0; i < els.length; ++i) {
    els[i].addEventListener("click", insertRipple);
  }*/
  ael("ui-raised-button", "click", insertRipple);
  ael("ui-floating-button", "click", insertRipple);
  ael("ui-flat-button", "click", insertRipple);
  ael("ui-icon-button", "click", insertRelativeRipple);
  ael("ui-item", "click", insertRipple);
})();

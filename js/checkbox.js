// checkbox.js {

function checkboxClick(evt_) {
  if (evt_.currentTarget.className.indexOf("ui-radio-switch") !== -1
  || evt_.currentTarget.tagName.toLowerCase() === "ui-radio-switch") {
    var nodes = evt_.currentTarget.parentNode.children;
    var j = 0;
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i].className.indexOf("ui-radio-switch") !== -1 || nodes[i].tagName.toLowerCase() === "ui-radio-switch") {
        remClass(nodes[i], "ui-selected");
        if (nodes[i] == evt_.currentTarget) {
          evt_.currentTarget.parentNode.setAttribute("value", j);
          addClass(nodes[i], "ui-selected");
        }
        ++j;
      }
    }
  } else if (evt_.currentTarget.className.indexOf("ui-toggle-switch") !== -1
         || evt_.currentTarget.tagName.toLowerCase() === "ui-toggle-switch"
         || evt_.currentTarget.className.indexOf("ui-checkbox-switch") !== -1
         || evt_.currentTarget.tagName.toLowerCase() === "ui-checkbox-switch") {
    toggleAttribute(evt_.currentTarget, "value", "true", "false");
    insertRelativeRipple(evt_);
  }
  UIcurrSelection = evt_.currentTarget; 
}

function labelClick(evt_) {
  var g = document.getElementById(evt_.currentTarget.getAttribute("for"));
  if (g) {
    checkboxClick({currentTarget: g});
  }
}

(function(){
  var tg_sw_tg = "ui-toggle-switch"
  var tg_frag = document.createElement(tg_sw_tg.toUpperCase());
  var tg_frag_bar = document.createElement("DIV");
  var tg_frag_ball = document.createElement("DIV");
  tg_frag_bar.className = "ui-toggle-switch-bar";
  tg_frag_ball.className = "ui-toggle-switch-ball ui-ripples";
  tg_frag.appendChild(tg_frag_bar);
  tg_frag.appendChild(tg_frag_ball);
  replaceUI(tg_sw_tg, tg_frag, function(tg_) {ael(tg_, "click", checkboxClick);});


  var cb_sw_tg = "ui-checkbox-switch"
  var cb_frag = document.createElement(cb_sw_tg.toUpperCase());
  var cb_frag_box = document.createElement("DIV");
  var cb_frag_c = document.createElement("DIV");
  var cb_frag_x = document.createElement("DIV");
  cb_frag_box.className = "ui-checkbox-switch-box ui-ripples";
  cb_frag_c.className = "ui-checkbox-switch-c";
  cb_frag_x.className = "ui-checkbox-switch-x";
  cb_frag_box.appendChild(cb_frag_c);
  cb_frag_box.appendChild(cb_frag_x);
  cb_frag.appendChild(cb_frag_box);
  replaceUI(cb_sw_tg, cb_frag, function(tg_) {ael(tg_, "click", checkboxClick);});
  
  ael("ui-radio-switch", "click", checkboxClick);
  ael("ui-label", "click", labelClick);
})();

// generic.js

function id(id_) {
  return document.getElementById(id_);
}

function cls(cl_) {
  return [].slice.call(document.getElementsByClassName(cl_));
}

function tgs(tg_) {
  return [].slice.call(document.getElementsByTagName(tg_));
}

function uis(tg_) {
  return tgs(tg_).concat(cls(tg_));
}

function ael(tg_, et_, cb_, eb_) {
  var els = uis(tg_);
  for (var i = 0; i < els.length; ++i) {
    els[i].addEventListener(et_, cb_, eb_ | false);
  }
}

function remClass(el_, cl_) {
  el_.className = el_.className.replace((new RegExp(cl_, "g")), " ");
}

function addClass(el_, cl_) {
  if(el_.className.indexOf(cl_) === -1) {
    el_.className += " " + cl_;
  }
}

function replaceNode(old_, new_) {
  old_.parentNode.replaceChild(new_, old_);
}

function replaceUI(tg_, new_, cb_) {
  var els = uis(tg_);
  for (var i = 0; i < els.length; ++i) {
    var clone = new_.cloneNode(true);
    clone.className += " " + els[i].className.replace("ui-toggle-switch", "");
    for (var j = 0; j < els[i].attributes.length; ++j) {
      clone.setAttribute(els[i].attributes[j].name, els[i].attributes[j].value);
    }
    clone.value = els[i].value;
    replaceNode(els[i], clone);
  }
  if (cb_) {cb_(tg_)};
}

function toggleAttribute(el_, at_, v1_, v2_) {
  if (el_.getAttribute(at_) == v1_) {
    el_.setAttribute(at_, v2_);
  } else {
    el_.setAttribute(at_, v1_);
  }
  return el_;
}
var UIcurrSelection = null;
(function(){
  var flist = ["ui-input","ui-toggle-switch","ui-checkbox-switch","ui-radio-switch","ui-flat-button","ui-raised-button","ui-icon-button","ui-floating-button"];
  {
    var els = document.querySelectorAll(flist.join(", ") + ", ." + flist.join(", ."));
    for (var i = 0; i < els.length; ++i) {
      addClass(els[i], "ui-accessible");
    }
  }
  
  function focusOn(el_) {
    var els = document.querySelectorAll(flist + ", input, textarea, button, submit");
    for(var i = 0; i < els.length; ++i) {
      remClass(els[i], "ui-hasfocus");
    }
    addClass(el_, "ui-hasfocus");
    if (el_.tagName === "UI-INPUT") {
      el_.querySelector("[contenteditable]").focus();
    }
    el_.scrollIntoView();
    try {el_.focus();}catch(er_) { };
  }
  
  function tabWasPressed(evt_) {
    if (!UIcurrSelection && ["input","textarea","button","submit"].indexOf(document.activeElement.tagName.toLowerCase()) !== -1) {
      UIcurrSelection = document.activeElement;
    }
    try {
      document.activeElement.blur();
    } catch (er_) { }
    
    var els = document.querySelectorAll(flist.join(":not([as=disabled]), ") + ":not([as=disabled]), ." + flist.join(":not([as=disabled]), .") + ":not([as=disabled]), input, textarea, button, submit");
    var j = -1;
    for(var i = 0; i < els.length; ++i) {
      if (els[i] === UIcurrSelection) {
        j = i;
        break;
      }
    }
    
    var d = 1;
    if (j === -1 || (!evt_.shiftKey && j === els.length - 1)) {
      j = 0;
    } else if (!evt_.shiftKey) {
      ++j;
    } else if (evt_.shiftKey && j === 0) {
      j = els.length - 1;
      d = -1;
    } else if (evt_.shiftKey) {
      --j;
      d = -1;
    }
    
    while (els[j].tagName.toLowerCase() === "ui-radio-switch" && els[j].parentNode.getAttribute("as") === "disabled") {
      j = (j + d) % els.length; 
    }
    
    UIcurrSelection = els[j];
    
    focusOn(UIcurrSelection);
  }
  
  function spaceWasPressed(evt_) {
    if (UIcurrSelection && document.activeElement.tagName === "BODY") {
      var evObj = document.createEvent("Events");
      evObj.initEvent("click", true, false);
      UIcurrSelection.dispatchEvent(evObj);
      evt_.preventDefault();
      evt_.stopPropagation();
      return false;
    }
    return true;
  }
  
  function keyWasPressed(evt_) {
    if (evt_.keyCode === 9) {
      tabWasPressed(evt_);
      evt_.preventDefault();
      evt_.stopPropagation();
      return false;
    } else if (evt_.keyCode === 32) {
      return spaceWasPressed(evt_);
    }
  }

  var body = document.querySelector("body");
  body.addEventListener("keydown", keyWasPressed);
})();

setTimeout(function(){
  (
      new MutationObserver(function(mutationEventList){
          // for now, just re-run setup aels
          //console.log("going...");
          ael("ui-radio-switch", "click", checkboxClick);
          ael("ui-label", "click", labelClick);
          ael("ui-icon-button", "click", insertRelativeRipple);
          ael("ui-item", "click", insertRipple);
          ael("ui-checkbox-switch", "click", checkboxClick);ael("ui-raised-button", "click", insertRipple);
          ael("ui-floating-button", "click", insertRipple);
          ael("ui-flat-button", "click", insertRipple);
          /*for(var i = 0; i < mutationEventList.length; ++i) {
            var addedList = mutationEventList[i].addedNodes;
            for(var j = 0; j < addedList.length; ++j) {
              console.log(addedList[j]);
            }
          }*/
      })
  )
  .observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      characterData: true
  });
},500);


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
// input.js

function inputClick(evt_) {
  UIcurrSelection = evt_.currentTarget;
}

function inputKeyup(evt_) {
  evt_.currentTarget.parentNode.setAttribute(
    "value",
    evt_.currentTarget.innerText
  );
}

function inputBlur(evt_) {
  if (evt_.currentTarget.parentNode.getAttribute("validate")) {
    if ((new RegExp(evt_.currentTarget.parentNode.getAttribute("validate"))).test(evt_.currentTarget.innerText)) {
      remClass(evt_.currentTarget.parentNode, "ui-haserror");
    } else {
      addClass(evt_.currentTarget.parentNode, "ui-haserror");
    }
  }
}

(function(){
  var in_tg = "ui-input";
  var els = uis(in_tg);
  for (var i = 0; i < els.length; ++i) {
    var in_frag = document.createElement(in_tg.toUpperCase());
    var in_title = document.createElement("DIV");
    for (var j = 0; j < els[i].attributes.length; ++j) {
      in_frag.setAttribute(els[i].attributes[j].name, els[i].attributes[j].value);
    }
    in_title.className = "ui-input-title";
    if (els[i].getAttribute("title")) {
      in_title.appendChild(document.createTextNode(els[i].getAttribute("title")));
    }
    var in_error = document.createElement("DIV");
    in_error.className = "ui-input-error";
    if (els[i].getAttribute("error")) {
      in_error.appendChild(document.createTextNode(els[i].getAttribute("error")));
    }
    var in_txt = document.createElement("DIV");
    in_txt.className = "ui-input-text";
    if (els[i].getAttribute("value")) {
      in_txt.appendChild(document.createTextNode(els[i].getAttribute("value")));
    }
    if (els[i].getAttribute("placeholder")) {
      in_txt.setAttribute("placeholder", els[i].getAttribute("placeholder"));
    }
    in_txt.setAttribute("contenteditable","true");
    in_frag.appendChild(in_error);
    in_frag.appendChild(in_txt);
    in_frag.appendChild(in_title);
    in_frag.addEventListener("click", inputClick);
    in_txt.addEventListener("keyup", inputKeyup);
    in_txt.addEventListener("blur", inputBlur);
    replaceNode(els[i], in_frag);
  }
})();
// list.js


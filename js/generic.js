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



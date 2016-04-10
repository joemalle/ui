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

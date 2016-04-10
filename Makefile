#Makefile

SCSSSWITCHES := scss/switch_checkbox.scss scss/switch_radiobutton.scss scss/switch_toggle.scss
SCSSBUTTONS := scss/button_flat.scss scss/button_floating.scss scss/button_icon.scss scss/button_raised.scss
SCSSFILES := scss/generic.scss scss/styles.scss scss/paper.scss scss/appbar.scss scss/autocomplete.scss scss/avatar.scss scss/badge.scss scss/buttons.scss scss/card.scss scss/datepicker.scss scss/dialog.scss scss/divider.scss scss/gridlist.scss scss/list.scss scss/popover.scss scss/progress.scss scss/selectfield.scss scss/slider.scss scss/snackbar.scss  scss/switches.scss scss/table.scss scss/tabs.scss scss/input.scss

JSFILES := js/generic.js js/ripple.js js/checkbox.js js/input.js js/list.js

all: css js

css: preparecss runsass

js: preparejs

preparecss:
	cat $(SCSSBUTTONS) > scss/buttons.scss
	cat $(SCSSSWITCHES) > scss/switches.scss
	cat $(SCSSFILES) > scss/ui.scss

runsass:
	sass scss/ui.scss css/ui.css --style compressed

preparejs:
	cat $(JSFILES) > js/ui.js

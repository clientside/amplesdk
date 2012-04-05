/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_sound	= function(){};
cAUIElement_sound.prototype	= new cAUIElement("sound");

// Class Events Handlers
cAUIElement_sound.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "src":
					this.$getContainer().FileName	= oEvent.newValue;
					break;

				case "autostart":
					this.$getContainer().AutoStart	= oEvent.newValue == "true";
					break;
			}
		}
	}
};

// Public Methods
cAUIElement_sound.prototype.play	= function() {
	this.$getContainer().CurrentPosition	= 0;
	if (this.$getContainer().OpenState == 6)
		this.$getContainer().Play();
};

cAUIElement_sound.prototype.stop	= function() {
	if (this.$getContainer().OpenState == 6)
		this.$getContainer().Stop();
};

// Class Event Handlers
cAUIElement_sound.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("src")) {
			var oSelf	= this;
			window.setTimeout(function() {
				oSelf.setAttribute("src", oSelf.getAttribute("src"));
			}, 0);
		}
//		;ample.$instance(this).setAttribute("' + "autostart" + '", "' + this.getAttribute("autostart") + '");', 0);
	}
};

// Element Render: open
cAUIElement_sound.prototype.$getTagOpen	= function() {
	return '<object classid="' + "clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" + '" style="' + "display:none" + '"><param name="' + "AutoStart" + '" value="false"/></object>';
};

// Register Element
ample.extend(cAUIElement_sound);

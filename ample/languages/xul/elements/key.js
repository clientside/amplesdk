/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_key	= function(){};
cXULElement_key.prototype	= new cXULElement("key");
cXULElement_key.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Static Methods
cXULElement_key._handleKeyDown	= function(oEvent, oElement) {
	// filter out by modifier
	if (oElement.hasAttribute("modifiers")) {
		var aModifiers	= oElement.getAttribute("modifiers").replace(/,/g, " ").split(" ");
		for (var nIndex = 0; nIndex < aModifiers.length; nIndex++) {
			switch (aModifiers[nIndex]) {
				case "shift":	if (!oEvent.shiftKey)	return;	break;
				case "alt":		if (!oEvent.altKey)		return;	break;
				case "meta":	if (!oEvent.metaKey)	return;	break;
				case "control":	if (!oEvent.ctrlKey)	return;	break;
			}
		}
	}

	// filter out by key
	if (oElement.hasAttribute("key")) {
		var sIdentifier	= oEvent.key,
			sKey	= oElement.getAttribute("key");
		if (sIdentifier.match(/^U\+(\d+)/)) {
			if (String.fromCharCode(parseInt(RegExp.$1, 16)).toLowerCase() != sKey.toLowerCase())
				return;
		}
		else
		if (sIdentifier != sKey)
			return;
	}

	// filter out by keycode
	// TODO: KeyEvent changed to KeboardEvent, so no keyCode property is available!
	if (oElement.hasAttribute("keycode"))
		if (oElement.getAttribute("keycode") != oEvent.keyCode)
			return;

	// do command if validation did not fail
	oElement.doCommand();
};

// Class Event Handlers
cXULElement_key.handlers	= {
	"DOMAttrModified" : function (oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "keytext":
					var aElements	= this.ownerDocument.querySelectorAll("[key='" + this.getAttribute("id") + "']");
					for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
						if (aElements[nIndex].namespaceURI == this.namespaceURI)
							aElements[nIndex].setAttribute("acceltext", oEvent.newValue || '');
					break;
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oElement	= oEvent.target;
		this.ownerDocument.addEventListener("keydown", function(oEvent){cXULElement_key._handleKeyDown(oEvent, oElement)}, false);
	}
};

// Register Element
ample.extend(cXULElement_key);

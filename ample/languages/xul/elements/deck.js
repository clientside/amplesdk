/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_deck	= function(){};
cXULElement_deck.prototype	= new cXULElement("deck");
//cXULElement_deck.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Public Properties
cXULElement_deck.prototype.selectedIndex	=-1;
cXULElement_deck.prototype.selectedPanel	= null;

// Attributes Defaults
cXULElement_deck.attributes	= {};
cXULElement_deck.attributes.selectedIndex	= "-1";
//cXULElement_deck.attributes.orient	= "vertical";

// Class event handlers
cXULElement_deck.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "selectedIndex") {
				if (this.childNodes.length > 0) {
					var nValue	= oEvent.newValue * 1;
					if (isNaN(nValue) || this.childNodes.length < nValue || nValue < 0)
						nValue	= 0;

					this.selectedIndex	= nValue;
					this.selectedPanel	= this.childNodes[this.selectedIndex];

					for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
						this.childNodes[nIndex].setAttribute("hidden", this.selectedIndex == nIndex ? "false" : "true");
				}

				// send event
				var oEvent	= this.ownerDocument.createEvent("Event");
				oEvent.initEvent("select", true, true);
				this.dispatchEvent(oEvent);
			}
		}
	}
};

cXULElement_deck.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "selectedIndex") {
		if (this.selectedPanel)
			oXULReflowManager.schedule(this.selectedPanel);
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXULElement_deck.prototype.reflow	= function() {
	// Temp fix
	var sValue	= this.attributes["selectedIndex"];
	if (sValue) {
		delete this.attributes["selectedIndex"];
		this.setAttribute("selectedIndex", sValue);
	}
	//
	cXULElement.prototype.reflow.call(this);
};

// Element Render: open
cXULElement_deck.prototype.$getTagOpen	= function() {
	return '<div class="xul-deck' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

// Element Render: close
cXULElement_deck.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_deck);

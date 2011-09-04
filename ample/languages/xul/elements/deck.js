/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
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
			switch (oEvent.attrName) {
				case "selectedIndex":
			        if (this.childNodes.length > 0) {
			        	var sValue	= oEvent.newValue;
			            if (isNaN(sValue) || this.childNodes.length < sValue * 1)
			                sValue  = "0";

			            this.selectedIndex  = sValue * 1;
			            this.selectedPanel  = this.childNodes[this.selectedIndex];

			            for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
			                this.childNodes[nIndex].setAttribute("hidden", this.selectedIndex == nIndex ? "false" : "true");

			            //
			            oXULReflowManager.schedule(this.selectedPanel);

			            // send event
			            var oEvent  = this.ownerDocument.createEvent("Event");
			            oEvent.initEvent("select", true, true);
			            this.dispatchEvent(oEvent);
			        }
			        break;

				default:
			        this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

cXULElement_deck.prototype.reflow	= function() {
	if (!isNaN(this.attributes["selectedIndex"]))
		this.setAttribute("selectedIndex", this.attributes["selectedIndex"] == "-1" ? "0" : this.attributes["selectedIndex"]);
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

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_select	= function() {
		this.validity	= new cXHTMLValidityState;
	//
	this.options	= new ample.classes.NodeList;

	var oSelf	= this;
	this.options.add	= function (oElement, nIndex) {oSelf.add(oElement, nIndex)};
	this.options.remove	= function (nIndex) {oSelf.remove(nIndex)};
};
cXHTMLElement_select.prototype	= new cXHTMLInputElement("select");

// Public Properties
cXHTMLElement_select.prototype.options	= null;
cXHTMLElement_select.prototype.selectedIndex	=-1;

// Public Methods
cXHTMLElement_select.prototype.add		= function(oElement, nIndex) {
	return this.appendChild(oElement);
};

cXHTMLElement_select.prototype.remove	= function(nIndex) {
	return this.removeChild(this.options[nIndex]);
};

// Class Events Handlers
cXHTMLElement_select.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("value").focus();
	},
	"blur":		function(oEvent) {
		// Hide popup if open
		if (!this.attributes.multiple)
			cXHTMLElement_select.toggle(this, false);
		this.$getContainer("value").blur();
	},
	"mousedown":function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("button"))
			cXHTMLElement_select.toggle(this);
	},
	"keydown":	function(oEvent) {
		if (oEvent.keyIdentifier == "Up") {
			// Deselect previously selected item
			if (this.selectedIndex !=-1)
				this.options[this.selectedIndex].removeAttribute("selected");
			// Find new item
			if (this.selectedIndex > 0)
				this.selectedIndex--;
			else
			if (this.options.length)
				this.selectedIndex	= this.options.length - 1;
			// Select new item
			if (this.selectedIndex >-1) {
				this.options[this.selectedIndex].setAttribute("selected", "true");
				cXHTMLElement_option.ensureRowIsVisible(this.options[this.selectedIndex]);
			}
			// Prevent scrolling
			oEvent.preventDefault();
		}
		else
		if (oEvent.keyIdentifier == "Down") {
			// Deselect previously selected item
			if (this.selectedIndex !=-1)
				this.options[this.selectedIndex].removeAttribute("selected");
			// Find new item
			if (this.selectedIndex < this.options.length - 1)
				this.selectedIndex++;
			else
			if (this.options.length)
				this.selectedIndex	= 0;
			// Select new item
			if (this.selectedIndex >-1) {
				this.options[this.selectedIndex].setAttribute("selected", "true");
				cXHTMLElement_option.ensureRowIsVisible(this.options[this.selectedIndex]);
			}
			// Prevent scrolling
			oEvent.preventDefault();
		}
	},
	"click":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.$pseudoTarget == this.$getContainer("button"))
				cXHTMLElement_select.toggle(this);
		}
	},
	"mousedown":	function(oEvent) {
		if (oEvent.target instanceof cXHTMLElement_option) {
			if (this.options[this.selectedIndex] != oEvent.target) {
				if (this.selectedIndex >-1)
					this.options[this.selectedIndex].removeAttribute("selected");
				this.options[this.selectedIndex = this.options.$indexOf(oEvent.target)].setAttribute("selected", "true");
				cXHTMLElement_option.ensureRowIsVisible(this.options[this.selectedIndex]);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		cXHTMLInputElement.register(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		//
		cXHTMLInputElement.unregister(this);
	}
};

// Static Members
cXHTMLElement_select.toggle	= function(oInstance, bForce) {
	var oPopup	= oInstance.$getContainer("popup");
	if ((arguments.length > 1 && bForce == true) || !(arguments.length > 1 || oPopup.style.display != "none")) {
		oInstance.$setPseudoClass("active", true);
		oPopup.style.display	= "";
	}
	else {
		oInstance.$setPseudoClass("active", false);
		oPopup.style.display	= "none";
	}
};

// Renderers
cXHTMLElement_select.prototype.$getTagOpen	= function() {
	var sClassName	= (this.prefix ? this.prefix + '-' : '') + this.localName,
		bMultiple	= "multiple" in this.attributes || this.attributes.multiple == "true",
		bPopupMode	= bMultiple;
	return '<span class="' + sClassName + ' ' + (bMultiple ? sClassName + '-multiple-' : '') +
					("class" in this.attributes ? ' ' + this.attributes["class"] : '')+
					(this.attributes["required"] ? ' ' + sClassName + '_required' : '')+
					(this.attributes["disabled"] ? ' ' + sClassName + '_disabled' : '')+
			'">\
				<div style="position:absolute;margin-top:-2px;white-space:nowrap" class="' + sClassName + '--placeholder">' +(this.attributes["placeholder"] ? ample.$encodeXMLCharacters(this.attributes["placeholder"]) : '')+ '</div>\
					<div class="' + sClassName + '--field" style="position:relative;' + (bPopupMode ? 'display:none' : '') + '">\
					<div class="' + sClassName + '--button" style="right:0"></div>\
					<input class="' + sClassName + '--value" type="text" />\
					<div class="' + sClassName + '--label" />\
					</div>\
					<div class="' + sClassName + '--popup' + (bMultiple ? ' ' + sClassName + '-multiple---popup' : '') +'" style="' +(bPopupMode ? '' : 'position:absolute;display:none;')+ '">\
					<div class="' + sClassName + '--gateway" style="margin:1px">';
};

cXHTMLElement_select.prototype.$getTagClose	= function() {
	return 			'</div>\
				</div>\
			</span>';
};

// Register Element
ample.extend(cXHTMLElement_select);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menulist	= function() {
	// Collections
	this.items			= new ample.classes.NodeList;
};
cXULElement_menulist.prototype	= new cXULInputElement("menulist");

// Default Attributes
cXULElement_menulist.attributes	= {
	"value":	""
};

// Public Properties
cXULElement_menulist.prototype.items	= null;
cXULElement_menulist.prototype.menupopup	= null;

cXULElement_menulist.prototype.selectedIndex	=-1;
cXULElement_menulist.prototype.selectedText		= null;
cXULElement_menulist.prototype.selectedItem		= null;	// TODO

// Public Methods
cXULElement_menulist.prototype.select	= function() {
	this.$getContainer("input").select();
};

cXULElement_menulist.prototype.appendItem	= function(sLabel, sValue) {
	return this.insertItemAt(this.items.length, sLabel, sValue);
};

cXULElement_menulist.prototype.insertItemAt	= function(nIndex, sLabel, sValue) {
	if (nIndex <= this.items.length) {
		// create XUL element
		var oElement	= this.ownerDocument.createElementNS(this.namespaceURI, "xul:menuitem");
		if (nIndex < this.items.length - 1)
			this.menupopup.insertBefore(oElement, this.items[nIndex]);
		else
			this.menupopup.appendChild(oElement);
		//
		oElement.setAttribute("label", sLabel);
		oElement.setAttribute("value", sValue);

		return oElement;
	}
	else
		throw new ample.classes.DOMException(DOMException.NOT_FOUND_ERR);
};

cXULElement_menulist.prototype.removeItemAt	= function(nIndex) {
	if (this.items[nIndex])
		return this.menupopup.removeChild(this.items[nIndex]);
	else
		throw new ample.classes.DOMException(DOMException.NOT_FOUND_ERR);
};

cXULElement_menulist.prototype.select	= function() {
	this.$getContainer("input").select();
};

cXULElement_menulist.prototype.toggle	= function(bState) {
	if (!this.menupopup)
		return;
	var bHidden	= this.menupopup.getAttribute("hidden") == "true";
	if (bState === true || (!arguments.length && bHidden)) {
		// show pane
		this.menupopup.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	}
	else
	if (!bHidden) {
		this.menupopup.hidePopup();
	}
};

// Private Events Handlers
cXULElement_menulist.prototype._onChange = function(oEvent) {
	var oInput	= this.$getContainer("input");

//	if (this.items[this.selectedIndex] && this.items[this.selectedIndex].attributes["label"].substring(0, oInput.value.length) == oInput.value)
//		oInput.value	= this.items[this.selectedIndex].attributes["label"];
};

// Class event handlers
cXULElement_menulist.handlers	= {
	"mousedown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		// click on ::button
		if (oEvent.target == this && oEvent.button == 0 && oEvent.$pseudoTarget == this.$getContainer("button"))
			this.toggle();
	},
	"mouseenter":	function(oEvent) {
		// for now..
		this.$setPseudoClass("hover", true, "button");
	},
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("hover", false, "button");
	},
	"keydown":	function(oEvent) {
		if (!this.menupopup)
			return;
		switch (oEvent.keyIdentifier) {
			case "Up":
				if (this.menupopup.getAttribute("hidden") == "true")
					this.toggle(true);
				else {
					var nIndex	= this.selectedIndex;
					while (nIndex--> 0) {
						if (this.items[nIndex].$getContainer().style.display != "none") {
							if (this.items[this.selectedIndex])
								this.items[this.selectedIndex].setAttribute("selected", "false");
							this.items[nIndex].setAttribute("selected", "true");
							this.items[nIndex].scrollIntoView();
							this.selectedIndex	= nIndex;
							break;
						}
					}
				}
				oEvent.preventDefault();
				break;

			case "Down":
				if (this.menupopup.getAttribute("hidden") == "true")
					this.toggle(true);
				else {
					var nIndex	= this.selectedIndex;
					while (++nIndex < this.items.length) {
						if (this.items[nIndex].$getContainer().style.display != "none") {
							if (this.items[this.selectedIndex])
								this.items[this.selectedIndex].setAttribute("selected", "false");
							this.items[nIndex].setAttribute("selected", "true");
							this.items[nIndex].scrollIntoView();
							this.selectedIndex	= nIndex;
							break;
						}
					}
				}
				oEvent.preventDefault();
				break;

			case "U+001B":	// Esc
				this.toggle(false);
				break;

			case "Enter":	// enter
				if (this.menupopup.getAttribute("hidden") != "true") {
					if (this.items[this.selectedIndex]) {
						this.selectedText	= this.items[this.selectedIndex].getAttribute("label");
						this.setAttribute("value", this.selectedText);
					}
					this.toggle(false);
				}

				// Fire Event
				cXULInputElement.dispatchChange(this);

				// Prevent submit
				oEvent.preventDefault();
		}
	},
	"keyup":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "U+001B":	// Esc
			case "Enter":
			case "U+0009":	// Tab
				return;

			case "Up":
			case "Down":
			case "Left":
			case "Right":
				return;
		}

		var sSelectedText	= this.$getContainer("input").value;
		if (this.selectedText == sSelectedText)
			return;

		//
		var nOptions	= 0,
			bFound;
		for (var nIndex = 0; nIndex < this.items.length; nIndex++) {
			bFound	= this.items[nIndex].getAttribute("label").substring(0, sSelectedText.length) == sSelectedText;
			if (this.attributes["filter"] == "true")
				this.items[nIndex].$getContainer().style.display	= bFound ? "block" : "none";

			if (this.items[nIndex].$getContainer().style.display != "none" && bFound) {
				if (!nOptions) {
					if (this.items[this.selectedIndex])
						this.items[this.selectedIndex].setAttribute("selected", "false");
					this.items[nIndex].setAttribute("selected", "true");
					this.items[nIndex].scrollIntoView();
	//				this.attributes["value"]	= this.items[nIndex].attributes["value"];
					this.selectedIndex	= nIndex;
				}
				nOptions++;
			}
		}

		if (nOptions)
			this.toggle(true);
		else
			this.toggle(false);

		this.selectedText	= sSelectedText;
	},
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		if (this.menupopup && this.menupopup.getAttribute("hidden") != "true")
			this.toggle(false);
		this.$getContainer("input").blur();
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_menuitem) {
			var sValue	= this.$getContainer("input").value;
			this.setAttribute("value", oEvent.target.getAttribute("label"));
			this.selectedIndex	= this.items.$indexOf(oEvent.target);
			this.toggle(false);

			if (sValue != this.$getContainer("input").value) {
				// Fire Event
				cXULInputElement.dispatchChange(this);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oElement	= this.querySelector(">xul|menupopup>xul|menuitem[checked=true]", function() {
			return oEvent.target.namespaceURI;
		});
		if (oElement)
			this.$getContainer("input").value	= oElement.getAttribute("label");
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
			if (oEvent.target instanceof cXULElement_menupopup)
				this.menupopup	= oEvent.target;
		}
		else
		if (oEvent.target instanceof cXULElement_menuitem)
			this.items.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
			if (oEvent.target instanceof cXULElement_menupopup)
				this.menupopup	= null;
		}
		else
		if (oEvent.target instanceof cXULElement_menuitem)
			this.items.$remove(oEvent.target);
	}
};

cXULElement_menulist.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value")
		this.$getContainer("input").value	= sValue || '';
	else
	if (sName == "disabled") {
		this.$setPseudoClass("disabled", sValue == "true");
		this.$getContainer("input").disabled	= sValue == "true";
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_menulist.prototype.$getTagOpen		= function() {
	return	'<div class="xul-menulist' +(!this.$isAccessible() ? " xul-menulist_disabled" : '') + (this.attributes["class"] ? ' ' + this.attributes["class"] : '') + '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') +'>\
				<div class="xul-menulist--field">\
					<div class="xul-menulist--button" onmouseout="ample.$instance(this).$setPseudoClass(\'active\', false, \'button\');" onmousedown="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'active\', true, \'button\');" onmouseup="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'active\', false, \'button\');" oncontextmenu="return false;"><br /></div>\
					<input class="xul-menulist--input" type="text" autocomplete="off" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" onchange="ample.$instance(this)._onChange(event)" value="' + this.attributes["value"] + '"' + (!this.$isAccessible() ? ' disabled="disabled"' : '') + (this.attributes["editable"] != "true" || this.attributes["readonly"] ? ' readonly="true"' : '') + (this.attributes["name"] ? ' name="' + this.attributes["name"] + '"' : '') + '/>\
				</div>\
				<div class="xul-menulist--gateway">';
};

// Element Render: close
cXULElement_menulist.prototype.$getTagClose	= function() {
	return		'</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_menulist);

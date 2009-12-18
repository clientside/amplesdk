/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menulist	= function()
{
	// Collections
	this.items	  	= new AMLNodeList;
};
cXULElement_menulist.prototype   = new cXULElement;
cXULElement_menulist.prototype.tabIndex	= 0;

// Default Attributes
cXULElement_menulist.attributes	= {
	"value":	""
};

// Public Properties
//cXULElement_menulist.prototype.form	= null;

cXULElement_menulist.prototype.menupopup	= null;

cXULElement_menulist.prototype.selectedIndex	=-1;
cXULElement_menulist.prototype.selectedText		= null;
cXULElement_menulist.prototype.selectedItem		= null;	// TODO

// Private Properties
cXULElement_menulist.hidden	= true;

// Public Methods
cXULElement_menulist.prototype.$getValue	= function()
{
	return this.$getContainer("input").value;
};

cXULElement_menulist.prototype.$setValue	= function(sValue)
{
	this.$getContainer("input").value	= sValue;
};

// Public Methods
cXULElement_menulist.prototype.setAttribute  = function(sName, sValue)
{
	if (sName == "value")
	{
		this.$setValue(sValue);
	}
	else
	if (sName == "disabled")
	{
		this.$setPseudoClass("disabled", sValue != '');
		this.$getContainer("input").disabled = sValue != '';
	}

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_menulist.prototype.select	= function()
{
	this.$getContainer("input").select();
};

cXULElement_menulist.prototype.appendItem	= function(sLabel, sValue)
{
	return this.insertItemAt(this.items.length, sLabel, sValue);
};

cXULElement_menulist.prototype.insertItemAt  = function(nIndex, sLabel, sValue)
{
	if (nIndex <= this.items.length)
	{
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
		throw new AMLException(AMLException.NOT_FOUND_ERR);
};

cXULElement_menulist.prototype.removeItemAt  = function(nIndex)
{
	if (this.items[nIndex])
		return this.menupopup.removeChild(this.items[nIndex]);
	else
		throw new AMLException(AMLException.NOT_FOUND_ERR);
};

cXULElement_menulist.prototype.select	= function()
{
	this.$getContainer("input").select();
};

cXULElement_menulist.prototype.toggle	= function(bState) {
	var oPane	= this.menupopup;
	if (bState === true || (!arguments.length && cXULElement_menulist.hidden)) {
		// show pane
		oPane.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
		oPane.opener		= this;
		cXULElement_menulist.hidden	= false;
	}
	else {
		oPane.hidePopup();
		oPane.opener		= null;
		cXULElement_menulist.hidden	= true;
	}
};

// Private Events Handlers
cXULElement_menulist.prototype._onChange = function(oEvent)
{
	var oInput  = this.$getContainer("input");

//	if (this.items[this.selectedIndex] && this.items[this.selectedIndex].attributes["label"].substring(0, oInput.value.length) == oInput.value)
//	   oInput.value	= this.items[this.selectedIndex].attributes["label"];
};

// Class event handlers
cXULElement_menulist.handlers	= {
	"mousedown":	function(oEvent) {
		if (this.getAttribute("disabled") == "true")
			return;

		// click on ::button
		if (oEvent.target == this && oEvent.button == 0 && oEvent.$pseudoTarget == this.$getContainer("button")) {
			this.toggle();
		}
	},
	"mouseenter":	function(oEvent) {
		// for now..
		this.$setPseudoClass("hover", true, "button");
	},
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("hover", false, "button");
	},
	"keydown":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "Up":
				if (cXULElement_menulist.hidden)
					this.toggle(true);
				else {
					var nIndex  = this.selectedIndex;
					while (nIndex--> 0) {
						if (this.items[nIndex].$getContainer().style.display != "none") {
							if (this.items[this.selectedIndex])
								this.items[this.selectedIndex].setAttribute("selected", "false");
							this.items[nIndex].setAttribute("selected", "true");
							this.items[nIndex].scrollIntoView();
							this.selectedIndex = nIndex;
							break;
						}
					}
				}
				oEvent.preventDefault();
				break;

			case "Down":
				if (cXULElement_menulist.hidden)
					this.toggle(true);
				else
				{
					var nIndex  = this.selectedIndex;
					while (++nIndex < this.items.length) {
						if (this.items[nIndex].$getContainer().style.display != "none") {
							if (this.items[this.selectedIndex])
								this.items[this.selectedIndex].setAttribute("selected", "false");
							this.items[nIndex].setAttribute("selected", "true");
							this.items[nIndex].scrollIntoView();
							this.selectedIndex = nIndex;
							break;
						}
					}
				}
				oEvent.preventDefault();
				break;

			case "Esc":
				this.toggle(false);
				break;

			case "Enter":   // enter
				if (!cXULElement_menulist.hidden) {
					if (this.items[this.selectedIndex]) {
						this.selectedText	= this.items[this.selectedIndex].getAttribute("label");
						this.$setValue(this.selectedText);
					}
					this.toggle(false);
				}

				// Fire Event
				var oEvent2  = this.ownerDocument.createEvent("Events");
				oEvent2.initEvent("change", true, false);
				this.dispatchEvent(oEvent2);

				// Prevent submit
				oEvent.preventDefault();
		}
	},
	"keyup":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "Esc":
			case "Enter":
			case "Tab":
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
		for (var nIndex = 0; nIndex < this.items.length; nIndex++)
		{
			bFound	= this.items[nIndex].getAttribute("label").substring(0, sSelectedText.length) == sSelectedText;
			if (this.attributes["filter"] == "true")
				this.items[nIndex].$getContainer().style.display	= bFound ? "block" : "none";

			if (this.items[nIndex].$getContainer().style.display != "none" && bFound)
			{
				if (!nOptions)
				{
					if (this.items[this.selectedIndex])
						this.items[this.selectedIndex].setAttribute("selected", "false");
					this.items[nIndex].setAttribute("selected", "true");
					this.items[nIndex].scrollIntoView();
	//				this.attributes["value"]   = this.items[nIndex].attributes["value"];
					this.selectedIndex = nIndex;
				}
		   		nOptions++;
			}
		}

		if (nOptions)
			this.toggle(true);
		else
		{
			this.toggle(false);
		}

		this.selectedText   = sSelectedText;
	},
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
		this.toggle(false);
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_menuitem) {
			var sValue	= this.$getValue();
			this.$setValue(oEvent.target.getAttribute("label"));
		    this.toggle(false);

			if (sValue != this.$getValue())
			{
			    // Fire Event
			    var oEvent2  = this.ownerDocument.createEvent("Events");
			    oEvent2.initEvent("change", true, false);
			    this.dispatchEvent(oEvent2);
			}
		}
	}/*,
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		for (var oElementTemp = this; oElementTemp; oElementTemp = oElementTemp.parentNode)
			if (oElementTemp instanceof cXHTMLElement_form)
				break;

		if (oElementTemp)
		{
			// Set reference to the form element
			this.form	= oElementTemp;

			// Add to collection of elements
			oElementTemp.elements.$add(this);
	//		oElementTemp.elements[this.attributes["name"]]	= this;
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.form)
			this.form.elements.$remove(this);
	}*/
};

// Element Render: open
cXULElement_menulist.prototype.$getTagOpen		= function() {
	return	'<table cellpadding="0" cellspacing="0" border="0" class="xul-menulist' +(this.attributes["disabled"] ? " xul-menulist_disabled" : '') + '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') +'>\
				<tbody>\
					<tr>\
						<td width="100%"><input class="xul-menulist--input" type="text" autocomplete="off" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" onchange="ample.$instance(this)._onChange(event)" value="' + this.attributes["value"] + '"' + (this.attributes["disabled"] ? ' disabled="disabled"' : '') + (this.attributes["readonly"] ? ' readonly="readonly"' : '') + (this.attributes["name"] ? ' name="' + this.attributes["name"] + '"' : '') + '/></td>\
						<td valign="top"><div class="xul-menulist--button" onmouseout="ample.$instance(this).$setPseudoClass(\'active\', false, \'button\');" onmousedown="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'active\', true, \'button\'); return false;" onmouseup="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'active\', false, \'button\');" oncontextmenu="return false;"/></td>\
					</tr>\
					<tr>\
						<td colspan="2" class="xul-menulist--gateway">';
};

// Element Render: close
cXULElement_menulist.prototype.$getTagClose	= function() {
	return				'</td>\
					</tr>\
				</tbody>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("menulist", cXULElement_menulist);

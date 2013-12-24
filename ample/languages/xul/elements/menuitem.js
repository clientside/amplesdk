/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menuitem	= function(){};
cXULElement_menuitem.prototype	= new cXULElement("menuitem");

cXULElement_menuitem.prototype.$hoverable	= true;

// Class Events Handlers
cXULElement_menuitem.handlers	= {
	"mouseenter":	function(oEvent) {
		this.parentNode.selectItem(this);
	},
	"mouseleave":	function(oEvent) {
		// ???
		this.parentNode.selectItem(null);
	},
	"click":	function(oEvent) {
		// If disabled, return
		if (!this.$isAccessible())
			return;

		if (oEvent.target instanceof cXULInputElement)
			return;

		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "checked") {
				// uncheck all the sibling items with the same name attribute
				var oElement	= this.parentNode;
				if (oElement && this.getAttribute("type") == "radio" && oEvent.newValue == "true") {
					for (var nIndex = 0, oItem; nIndex < oElement.items.length; nIndex++) {
						oItem	= oElement.items[nIndex];
						if (oItem instanceof cXULElement_menuitem && oItem.getAttribute("type") == "radio")
							if (oItem != this && oItem.getAttribute("name") == this.getAttribute("name"))
								oItem.setAttribute("checked", "false");
					}
				}
			}
		}
	},
	"DOMActivate":	function(oEvent) {
		if (this.getAttribute("type") == "checkbox")
			this.setAttribute("checked", this.getAttribute("checked") == "true" ? "false" : "true");
		else
		if (this.getAttribute("type") == "radio")
			this.setAttribute("checked", "true");

		// Execute commands
		this.doCommand();
	}
};

cXULElement_menuitem.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "selected")
		this.$setPseudoClass("selected", sValue == "true");
	else
	if (sName == "label") {
		var oCell	= this.$getContainer().cells[1];
		// Strange IE problem, it doesn't allow setting innerHTML here..
		if (document.namespaces)
			oCell.innerText	= sValue || '';
		else
			oCell.innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	}
	else
	if (sName == "image")
		this.$getContainer("image").style.backgroundImage	= sValue ? "url(" + sValue + ")" : '';
	else
	if (sName == "type") {
		// TODO
	}
	else
	if (sName == "checked")
		this.$setPseudoClass("checked", sValue == "true");
	else
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXULElement_menuitem.prototype.scrollIntoView	= function() {
	var oElementDOM	= this.$getContainer(),
		oParentDOM	= oElementDOM.parentNode;

	if (oParentDOM.scrollTop > oElementDOM.offsetTop)
		oParentDOM.scrollTop	= oElementDOM.offsetTop - 1;
	if (oParentDOM.scrollTop < oElementDOM.offsetTop - oParentDOM.offsetHeight + oElementDOM.offsetHeight)
		oParentDOM.scrollTop	= oElementDOM.offsetTop - oParentDOM.offsetHeight + oElementDOM.offsetHeight + 3;
};

// Element Render: open
cXULElement_menuitem.prototype.$getTagOpen		= function() {
	var bDisabled	= !this.$isAccessible(),
		bChecked	= this.getAttribute("checked") == "true";
	return '<tr class="xul-menuitem' + (bDisabled ? " disabled" : "") + (bChecked ? ' checked' : '') + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<td width="18"><div class="xul-menuitem--image xul-menuitem-type---image' + (this.hasAttribute("type") ? ' xul-menuitem-type-' + this.getAttribute("type") + '--image' : '') + '"' +(this.hasAttribute("image") ? ' style="background-image:url('+ ample.$encodeXMLCharacters(this.getAttribute("image")) + ')"' : '')+ '></div></td>\
				<td nowrap="nowrap" class="xul-menuitem--label" style="white-space:nowrap;">' +(this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : ' ');
};

// Element Render: open
cXULElement_menuitem.prototype.$getTagClose		= function() {
	return		'</td>\
				<td width="2"></td>\
				<td width="16"><div style="width:16px;"><br /></div></td>\
			</tr>';
};

// Register Element
ample.extend(cXULElement_menuitem);

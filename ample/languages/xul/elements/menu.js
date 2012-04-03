/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menu	= function(){};
cXULElement_menu.prototype	= new cXULElement("menu");

cXULElement_menu.prototype.$hoverable	= true;

// Public Properties
cXULElement_menu.prototype.menupopup	= null;	// Reference link to a menupopup element

// Class Events Handlers
cXULElement_menu.handlers	= {
	"mouseenter":	function(oEvent) {
		if (this.parentNode.selectedItem || this.parentNode instanceof cXULElement_menupopup)
	   		this.parentNode.selectItem(this);
	},
	"mousedown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (oEvent.target == this && oEvent.button == 0)
			this.$activate();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$remove(this);
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target.parentNode instanceof cXULElement_menubar)
   			this.parentNode.selectItem(this.parentNode.selectedItem == this ? null : this);
	}
};

cXULElement_menu.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "open") {
		// TODO
	}
	else
	if (sName == "selected") {
		this.$setPseudoClass("selected", sValue == "true");
		if (this.parentNode instanceof cXULElement_menupopup)
			this.$setPseudoClass("selected", sValue == "true", "arrow");
	}
	else
	if (sName == "label")
		this.$getContainer("label").innerHTML	= sValue;
	else
	if (sName == "image") {
		if (this.parentNode instanceof cXULElement_menupopup)
			this.$getContainer("control").style.backgroundImage	= sValue ? "url(" + sValue + ")" : '';
	}
	else
	if (sName == "disabled") {
		this.$setPseudoClass("disabled", sValue == "true");
		if (this.parentNode instanceof cXULElement_menupopup)
			this.$setPseudoClass("disabled", sValue == "true", "arrow");
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_menu.prototype.$getTagOpen	= function() {
    if (this.parentNode instanceof cXULElement_menupopup)
        return '<tr class="xul-menu' + (!this.$isAccessible() ? " xul-menu_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
        			<td width="18"><div class="xul-menu--control"' +(this.attributes["image"] ? ' style="background-image:url('+ ample.$encodeXMLCharacters(this.attributes["image"]) + ')"' : '')+ '></div></td>\
        			<td nowrap="nowrap" class="xul-menu--label">' + (this.attributes["label"] ? ample.$encodeXMLCharacters(this.attributes["label"]) : ' ')+ '</td>\
        			<td valign="top" class="xul-menupopup--gateway">';
    else
        return '	<td nowrap="nowrap" valign="center" class="xul-menu' + (!this.$isAccessible() ? " xul-menu_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
        				<div class="xul-menu--label">' + (this.attributes["label"] ? ample.$encodeXMLCharacters(this.attributes["label"]) : ' ') + '</div>\
        				<div class="xul-menu--gateway">';
};

// Element Render: close
cXULElement_menu.prototype.$getTagClose	= function() {
    if (this.parentNode instanceof cXULElement_menupopup)
        return 		'</td>\
        			<td width="16"><div class="xul-menu--arrow' + (!this.$isAccessible() ? ' xul-menu--arrow_disabled' : '')+ '"><br /></div></td>\
        		</tr>';
    else
        return '		</div>\
        			</td>';
};

// Register Element
ample.extend(cXULElement_menu);

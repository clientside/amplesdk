/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tab	= function(){};
cXULElement_tab.prototype	= new cXULElement("tab");
cXULElement_tab.prototype.$hoverable	= true;

// Events handlers
cXULElement_tab.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMActivate":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.parentNode.goTo(this.parentNode.items.$indexOf(this));
		this.doCommand();
	}
};

cXULElement_tab.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
	if (sName == "selected")
		this.$setPseudoClass("selected", sValue == "true");
	else
	if (sName == "label")
		this.$getContainer("gateway").innerHTML	=(this.hasAttribute("image") ? '<img src="' + this.getAttribute("image") + '" align="absmiddle" /> ' :'') + (sValue || '');
	else
	if (sName == "image")
		this.$getContainer("gateway").innerHTML	=(sValue ? '<img src="' + sValue + '" align="absmiddle" /> ' :'') + (this.getAttribute("label") || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_tab.prototype.$getTagOpen	= function() {
	return '<div class="xul-tab' + (!this.$isAccessible() ? " xul-tab_disabled" : "") +(this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">\
				<div class="xul-tab--before" style="float:left;height:100%"></div>\
				<div class="xul-tab--after" style="float:right;height:100%"></div>\
				<div class="xul-tab--gateway">'+
					(this.hasAttribute("image") ? '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("image")) + '" border="0" align="absmiddle"/> ' : '')+
					(this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : '');
};

// Element Render: close
cXULElement_tab.prototype.$getTagClose	= function() {
	return '	</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_tab);

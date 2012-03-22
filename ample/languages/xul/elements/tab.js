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
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;

				case "selected":
					this.$setPseudoClass("selected", oEvent.newValue == "true");
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabs)
			this.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabs)
			this.parentNode.items.$remove(this);
	}
};

// Element Render: open
cXULElement_tab.prototype.$getTagOpen	= function() {
    return '<div class="xul-tab' + (!this.$isAccessible() ? " xul-tab_disabled" : "") +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
    			<div class="xul-tab--before" style="float:left;height:100%"></div>\
				<div class="xul-tab--after" style="float:right;height:100%"></div>\
    			<div class="xul-tab--gateway">'+
    				(this.attributes["image"] ? '<img src="' + this.attributes["image"] + '" border="0" align="absmiddle"/> ' : '')+
    				(this.attributes["label"] ? this.attributes["label"] : '');
};

// Element Render: close
cXULElement_tab.prototype.$getTagClose	= function() {
    return '	</div>\
    		</div>';
};

// Register Element
ample.extend(cXULElement_tab);

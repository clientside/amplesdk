/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_filepicker	= function(){};
cAUIElement_filepicker.prototype	= new cAUIElement("filepicker");
//
cAUIElement_filepicker.prototype.tabIndex	= 0;

cAUIElement_filepicker.prototype.$isAccessible	= function() {
	return !this.getAttribute("disabled");
};

// Public Methods

// Events Handlers
cAUIElement_filepicker.prototype._onChange	= function(oEvent) {
	this.setAttribute("value", this.$getContainer("input").value);

	// Fire Event
	var oEvent	= this.ownerDocument.createEvent("Event");
	oEvent.initEvent("change", true, false);
	this.dispatchEvent(oEvent);
};

// Class Events Handlers
cAUIElement_filepicker.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "disabled":
					var oElementDOM	= this.$getContainer();
					oElementDOM.className	= oElementDOM.className.replace(oEvent.newValue == "true" ? "normal" : "disabled", oEvent.newValue == "true" ? "disabled" : "normal");
					this.$getContainer("input").disabled	=(oEvent.newValue == "true");
					break;
			}
		}
	}
};

// Element Render: open
cAUIElement_filepicker.prototype.$getTagOpen	= function() {
	return '<span class="aui-filepicker"><input type="file" class="aui-filepicker--input"' +(this.hasAttribute("disabled") ? ' disabled="true"' : '')+ ' style="padding-left:3px;" onselectstart="event.cancelBubble=true;" />';
};

// Element Render: close
cAUIElement_filepicker.prototype.$getTagClose	= function() {
	return '</span>';
};

// Register Element
ample.extend(cAUIElement_filepicker);

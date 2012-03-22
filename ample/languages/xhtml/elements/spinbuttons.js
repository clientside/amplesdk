/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_spinbuttons	= function(){};
cXHTMLElement_spinbuttons.prototype	= new cXHTMLElement("spinbuttons");

// Private property
cXHTMLElement_spinbuttons.captured	= false;
cXHTMLElement_spinbuttons.interval	= null;
cXHTMLElement_spinbuttons.timeout		= null;

// Class event handlers
cXHTMLElement_spinbuttons.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.$pseudoTarget == this.$getContainer("button-up")) {
			this.spin(true);
			var that	= this;
			cXHTMLElement_spinbuttons.timeout	= setTimeout(function() {
				cXHTMLElement_spinbuttons.interval	= setInterval(function() {
					that.spin(true);
				}, 100);
			}, 500);
			this.$setPseudoClass("active", true, "button-up");
			this._captured	= true;
			this.setCapture(true);
		}
		else
		if (oEvent.$pseudoTarget == this.$getContainer("button-down")) {
			this.spin(false);
			var that	= this;
			cXHTMLElement_spinbuttons.timeout	= setTimeout(function() {
				cXHTMLElement_spinbuttons.interval	= setInterval(function() {
					that.spin(false);
				}, 100);
			}, 500);
			this.$setPseudoClass("active", true, "button-down");
			this._captured	= true;
			this.setCapture(true);
		}
	},
	"mouseup":	function(oEvent) {
		if (this._captured) {
			this._captured	= false;
			clearTimeout(cXHTMLElement_spinbuttons.timeout);
			clearInterval(cXHTMLElement_spinbuttons.interval);
			this.$setPseudoClass("active", false, "button-up");
			this.$setPseudoClass("active", false, "button-down");
			this.releaseCapture();
		}
	},
	"DOMAttrModifed":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;
			}
		}
	}
};

//
cXHTMLElement_spinbuttons.prototype.spin	= function(bForward) {
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("spin", false, false, bForward);
	this.dispatchEvent(oEvent);
};

// Element Render: open
cXHTMLElement_spinbuttons.prototype.$getTagOpen	= function() {
	return '<div class="spinbuttons' + (!this.$isAccessible() ? ' spinbuttons_disabled' : '')+ '" onmousedown="return false" onselectstart="return false">\
				<div class="spinbuttons--button-up" onmouseover="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')"><br/></div>\
				<div class="spinbuttons--button-down" onmouseover="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')"><br/></div>\
			</div>';
};
cXHTMLElement_spinbuttons.prototype.$getTagClose	= function() {
	return '';
};

// Register Element
ample.extend(cXHTMLElement_spinbuttons);

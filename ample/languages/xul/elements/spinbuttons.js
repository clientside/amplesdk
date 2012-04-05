/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_spinbuttons	= function(){};
cXULElement_spinbuttons.prototype	= new cXULElement("spinbuttons");

// Private property
cXULElement_spinbuttons.interval	= null;
cXULElement_spinbuttons.timeout		= null;

// Class event handlers
cXULElement_spinbuttons.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.$pseudoTarget == this.$getContainer("button-up")) {
			this.spin(true);
			var that	= this;
			cXULElement_spinbuttons.timeout	= setTimeout(function() {
				cXULElement_spinbuttons.interval	= setInterval(function() {
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
			cXULElement_spinbuttons.timeout	= setTimeout(function() {
				cXULElement_spinbuttons.interval	= setInterval(function() {
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
			clearTimeout(cXULElement_spinbuttons.timeout);
			clearInterval(cXULElement_spinbuttons.interval);
			this.$setPseudoClass("active", false, "button-up");
			this.$setPseudoClass("active", false, "button-down");
			this.releaseCapture();
		}
	}
};

cXULElement_spinbuttons.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

//
cXULElement_spinbuttons.prototype.spin	= function(bForward) {
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("spin", false, false, bForward);
	this.dispatchEvent(oEvent);
};

// Element Render: open
cXULElement_spinbuttons.prototype.$getTagOpen	= function() {
	return '<div class="xul-spinbuttons' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + (!this.$isAccessible() ? ' xul-spinbuttons_disabled' : '')+ '" onmousedown="return false" onselectstart="return false">\
				<div class="xul-spinbuttons--button-up" onmouseover="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')"><br/></div>\
				<div class="xul-spinbuttons--button-down" onmouseover="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (ample.$instance(this).$isAccessible()) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')"><br/></div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_spinbuttons);

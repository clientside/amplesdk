/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_progressmeter	= function(){};
cXULElement_progressmeter.prototype	= new cXULElement("progressmeter");

// Private Properties
cXULElement_progressmeter.prototype._interval	= null;
cXULElement_progressmeter.prototype._left		= 0;

// Attributes Defaults
cXULElement_progressmeter.attributes	= {};
cXULElement_progressmeter.attributes.value	= "100";

// Private Methods
cXULElement_progressmeter.prototype._onInterval	= function() {
	this._left	= this._left + 1 > 100 + 30 ? 0 : this._left + 1;

	this.$getContainer("value").style.left	=(this._left > 30 ? this._left - 30 : 0)+ '%';
	this.$getContainer("value").style.width	=(this._left < 30 ? this._left : 100 + 30 - this._left < 30 ? 100 + 30 - this._left : 30)+ '%';
};

// Class handlers
cXULElement_progressmeter.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("mode") == "undetermined") {
			var oSelf	= this;
			this._interval	= setInterval(function() {
				oSelf._onInterval();
			}, 40);
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this._interval)
			clearInterval(this._interval);
	}
};

cXULElement_progressmeter.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value") {
		if (this.getAttribute("mode") != "undetermined")
			this.$getContainer("value").style.width	= sValue + '%';
	}
	else
	if (sName == "mode") {
		if (sValue == "undetermined") {
			if (!this._interval) {
				var oElementDOM	= this.$getContainer("value");
				oElementDOM.style.width	= '0%';
				oElementDOM.style.left	= '0%';

				this._left	= 0;
				var oSelf	= this;
				this._interval	= setInterval(function() {
					oSelf._onInterval();
				}, 40);
			}
		}
		else {
			if (this._interval) {
				clearInterval(this._interval);
				this._interval	= null;
			}
			var oElementDOM	= this.$getContainer("value");
			oElementDOM.style.width	= this.getAttribute("value") + '%';
			oElementDOM.style.left	= '0%';
		}
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_progressmeter.prototype.$getTagOpen	= function() {
	return '<div class="xul-progressmeter' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="'+
				'width:' + (this.hasAttribute("width") ? this.getAttribute("width") : "100%") + ';' +
				(this.getAttribute("hidden") == "true" ? 'display:none;' : "") + '">\
				<div class="xul-progressmeter--before" style="float:left"></div>\
				<div class="xul-progressmeter--after" style="float:right"></div>\
				<div class="xul-progressmeter--bar">\
					<div class="xul-progressmeter--value" style="position:relative;font-size:1px;width:' + this.getAttribute("value") + '%"></div>\
				</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_progressmeter);

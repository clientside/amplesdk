/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_map	= function(){};
cAUIElement_map.prototype	= new cAUIElement("map");

// Public Properties

// Public Methods


// Class event handlers
cAUIElement_map.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "longitude":
					var oCenter	= new GLatLng(oEvent.newValue * 1, this.getAttribute("latitude") * 1);
					this.object.panTo(oCenter);
					break;

				case "latitude":
					var oCenter	= new GLatLng(this.getAttribute("longitude") * 1, oEvent.newValue * 1);
					this.object.panTo(oCenter);
					break;

				case "altitude":
					this.object.setZoom(oEvent.newValue * 1);
					break;
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (window.GMap) {
			this.object	= new GMap(this.$getContainer());
			var oCenter	= new GLatLng(this.getAttribute("longitude") * 1, this.getAttribute("latitude") * 1);
			this.object.setCenter(oCenter, this.getAttribute("altitude") * 1);
		}
		else {
			this.$getContainer().innerHTML	= "Google Maps API was not loaded";
		}
	}
};

// Element Render: open
cAUIElement_map.prototype.$getTagOpen	= function() {
	return '<div' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>';
};

// Element Render: close
cAUIElement_map.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cAUIElement_map);

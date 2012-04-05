/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_marker	= function(){};
cAUIElement_marker.prototype	= new cAUIElement("marker");

// Class event handlers
cAUIElement_marker.handlers	= {
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

				case "image":
					this.object.setImage(oEvent.newValue);
					break;
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (window.GMap) {
			if (this.parentNode instanceof cAUIElement_map) {
				var oPoint	= new GLatLng(this.getAttribute("longitude") * 1, this.getAttribute("latitude") * 1);
				this.object	= new GMarker(oPoint);
				this.parentNode.object.addOverlay(this.object);
				var sImage	= this.getAttribute("image");
				if (sImage)
					this.object.setImage(sImage);
			}
		}
	}
};

// Register Element
ample.extend(cAUIElement_marker);

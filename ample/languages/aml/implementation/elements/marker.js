/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_marker	= function(){};
cAMLElement_marker.prototype	= new cAMLElement;

// Public Properties
cAMLElement_marker.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "longitude")
    {
		var oPoint	= new GLatLng(sValue * 1, this.getAttribute("latitude") * 1);
		this.object.setPoint(oPoint);
    }
    else
    if (sName == "latitude")
    {
		var oPoint	= new GLatLng(this.getAttribute("longitude") * 1, sValue * 1);
		this.object.setPoint(oPoint);
    }
    else
    if (sName == "image")
    {
		this.object.setImage(sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class event handlers
cAMLElement_marker.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (window.GMap) {
			if (this.parentNode instanceof cAMLElement_map) {
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

// Register Element with language
oAMLNamespace.setElement("marker", cAMLElement_marker);

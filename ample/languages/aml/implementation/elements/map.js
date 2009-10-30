/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_map	= function(){};
cAMLElement_map.prototype	= new cAMLElement;

// Public Properties

// Public Methods
cAMLElement_map.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "longitude")
    {
		var oCenter	= new GLatLng(sValue * 1, this.getAttribute("latitude") * 1);
		this.object.panTo(oCenter);
    }
    else
    if (sName == "latitude")
    {
		var oCenter	= new GLatLng(this.getAttribute("longitude") * 1, sValue * 1);
		this.object.panTo(oCenter);
    }
    else
    if (sName == "altitude")
    {
		this.object.setZoom(sValue * 1);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class event handlers
cAMLElement_map.handlers	= {
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
cAMLElement_map.prototype.$getTagOpen	= function()
{
	return '<div' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') + '>';
};

// Element Render: close
cAMLElement_map.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oAMLNamespace.setElement("map", cAMLElement_map);

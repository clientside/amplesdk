/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAttr_values	= function(){};
cAttr_values.prototype	= new cAMLAttr("values");

// Class Events Handlers
cAttr_values.handlers	= {};
cAttr_values.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	var oElement	= this.ownerElement,
		aValues		= this.value.trim().split(/\s*;\s*/),
		oElementDOM	= oElement.$getContainer("gateway") || oElement.$getContainer();
	for (var nIndex = 0, nLength = aValues.length, aName, aValue, sKey; nIndex < nLength; nIndex++) {
		aValue	= aValues[nIndex].split(/\s*:\s*/);
		aName	= aValue[0].split('.');
		sKey	= aValue[1];
		if (aName[0] == '') {
			// Property
			switch (aName[1]) {
				case "style":
					if (oElementDOM)
						oElementDOM.style[aName[2]]	= sKey;
					break;

				case "innerHTML":
					if (oElementDOM)
						oElementDOM.innerHTML	= sKey;
					break;

				default:
					throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
			}
		}
		else {
			// Attribute
			oElement.setAttribute(aName[0], sKey);
		}
	}
};
cAttr_content.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	// TODO
};

// Register Attribute
fAmple_extend(cAttr_values);

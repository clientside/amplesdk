/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_values	= function(){};
cAMLAttr_values.prototype	= new cAMLAttr("values");

// Class Events Handlers
cAMLAttr_values.handlers	= {};
cAMLAttr_values.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	fAMLAttr_values_map(this.ownerElement, this.value);
};
cAMLAttr_content.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	fAMLAttr_values_map(this.ownerElement, '');
};

function fAMLAttr_values_map(oElement, sValue) {
	var aValues		= sValue.trim().split(/\s*;\s*/),
		oElementDOM	= oElement.$getContainer("gateway") || oElement.$getContainer();
	for (var nIndex = 0, nLength = aValues.length, aName, aValue, sValue; nIndex < nLength; nIndex++) {
		aValue	= aValues[nIndex].split(/\s*:\s*/);
		aName	= aValue[0].split('.');
		sValue	= oAmple.locale.localize(aValue[1]) || '';
		if (aName[0] == '') {
			// Property
			switch (aName[1]) {
				case "style":
					if (oElementDOM)
						oElementDOM.style[aName[2]]	= sValue;
					break;

				case "innerHTML":
					if (oElementDOM)
						oElementDOM.innerHTML	= sValue;
					break;

				default:
					throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
			}
		}
		else {
			// Attribute
			oElement.setAttribute(aName[0], sValue);
		}
	}
};

// Register Attribute
fAmple_extend(cAMLAttr_values);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_repeater	= function(){};
cAMLElement_repeater.prototype	= new cAMLElement("repeater");

// Public properties
cAMLElement_repeater.prototype.data	= null;

// Private Properties
cAMLElement_repeater.prototype._timeout	= null;

// Class Event Handlers
cAMLElement_repeater.handlers	= {};
cAMLElement_repeater.handlers["DOMAttrModified"]	= function(oEvent) {
	if (oEvent.target == this)
		switch (oEvent.newValue) {
			case "data":
				this.bind(oEvent.newValue);
				break;
/*
			case "select":
				this.refresh();
				break;
*/
		}
};
cAMLElement_repeater.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	var oElement	= oDocument_ids[fElement_getAttribute(this, "data")];
	if (oElement) {
		this.bind(oElement);
		//
		this.refresh();
	}
};
cAMLElement_repeater.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.unbind();
};

// Public Methods
cAMLElement_repeater.prototype.bind	= function(oElement) {
	if (this.data && this.data != oElement)
		this.unbind();
	else {
		this.data	= oElement;
		this.data.register(this);
	}
};

cAMLElement_repeater.prototype.unbind	= function() {
	if (this.data) {
		this.data.unregister(this);
		this.data	= null;
	}
};

cAMLElement_repeater.prototype.refresh	= function() {
	// skip refresh (if scheduled)
	if (this._timeout)
		return;

	// schedule refresh
	var oElement	= this;
	this._timeout	= fSetTimeout(function() {
		// execute refresh
		oElement._timeout	= null;
		oElement.repeat();
	}, 0);
};

cAMLElement_repeater.prototype.repeat	= function() {
	if (this.data) {
		var aElements, nIndex, oElement;

		// Clean up previously created elements
		aElements	= this.parentNode.childNodes;
		for (nIndex = 0; oElement = aElements[nIndex]; nIndex++)
			if (oElement.dataIndex)
				oElement.parentNode.removeChild(oElement) && nIndex--;

		// Generate new content
		var oContext	= this,
			oCache	= {},
			fResolver	= function (sPrefix) {
				return sPrefix in oCache ? oCache[sPrefix] : oCache[sPrefix] = fNode_lookupNamespaceURI(oContext, sPrefix);
			};
		aElements	= fNodeSelector_query([this.data], fElement_getAttribute(this, "select") || '', fResolver);
		for (nIndex = 0; oElement = aElements[nIndex]; nIndex++)
			this.parentNode.insertBefore(
				fAMLElement_repeater_processNode(
					this.firstChild.cloneNode(true),
					oElement,
					fResolver),
				this.nextSibling).dataIndex	= nIndex + 1;
	}
};

var rAMLElement_repeater_regexp	= /(\{([^\}]+)\})/g;

// 'Static' Methods
function fAMLElement_repeater_processNode(oElement, oData, fResolver) {
	var oNode,
		aMatch;
	for (var nIndex = 0; oNode	= oElement.childNodes[nIndex]; nIndex++)	{
		switch (oNode.nodeType) {
			case 1:	// cNode.ELEMENT_NODE
				for (var nAttribute = 0, nLengthAttribute = oNode.attributes.length, oAttribute; nIndex < nLengthAttribute; nIndex++)
					if (aMatch = (oAttribute = oNode.attributes[nAttribute]).value.match(rAMLElement_repeater_regexp))
						fElement_setAttributeNS(oNode, oAttribute.namespaceURI, oAttribute.name, oAttribute.value.replace(aMatch[1], fAMLElement_repeater_resolveValue(aMatch[2], oData, fResolver)));
				fAMLElement_repeater_processNode(oNode, oData, fResolver);
				break;

			case 3:	// cNode.TEXT_NODE
			case 4:	// cNode.CDATA_SECTION_NODE
				if (aMatch = oNode.data.match(rAMLElement_repeater_regexp)) {
					oNode.data	= oNode.data.replace(aMatch[1], fAMLElement_repeater_resolveValue(aMatch[2], oData, fResolver));
					oNode.nodeValue	= oNode.data;
					oNode.length= oNode.data.length;
				}
		}
	}
	return oElement;
};

function fAMLElement_repeater_resolveValue(sQuery, oData, fResolver) {
	var oElement	= fNodeSelector_query([oData], sQuery, fResolver, true)[0];
	return oElement && oElement.firstChild ? oElement.firstChild.data : '';
};

// Register Element
fAmple_extend(cAMLElement_repeater);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
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
	var oElement	= oDocument_ids[this.attributes["data"]];
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
				fElement_removeChild(oElement.parentNode, oElement) && nIndex--;

		// Generate new content
		var oContext	= this,
			oContextCache	= {},
			fResolver	= function (sPrefix) {
				return sPrefix in oContextCache ? oContextCache[sPrefix] : oContextCache[sPrefix] = fNode_lookupNamespaceURI(oContext, sPrefix);
			};
		aElements	= fNodeSelector_query([this.data], this.attributes["select"] || '', fResolver);
		for (nIndex = 0; nIndex < aElements.length; nIndex++)
			fElement_insertBefore(this.parentNode,
				fAMLElement_repeater_processNode(
					fNode_cloneNode(this.firstChild, true),
					aElements[nIndex],
					fResolver),
				this).dataIndex	= nIndex + 1;
	}
};

var rAMLElement_repeater_regexp	= /(\{([^\}]+)\})/g;

// 'Static' Methods
function fAMLElement_repeater_processNode(oElement, oData, fResolver) {
	var oNode, sName;
	for (var nIndex = 0; nIndex < oElement.childNodes.length; nIndex++)	{
		oNode	= oElement.childNodes[nIndex];
		switch (oNode.nodeType) {
			case 1:	// cNode.ELEMENT_NODE
				for (sName in oNode.attributes)
					if (oNode.attributes.hasOwnProperty(sName) && oNode.attributes[sName].match(rAMLElement_repeater_regexp))
						oNode.attributes[sName]	= oNode.attributes[sName].replace(cRegExp.$1, fAMLElement_repeater_resolveValue(cRegExp.$2, oData, fResolver));
				fAMLElement_repeater_processNode(oNode, oData, fResolver);
				break;

			case 3:	// cNode.TEXT_NODE
			case 4:	// cNode.CDATA_SECTION_NODE
				if (oNode.data.match(rAMLElement_repeater_regexp)) {
					oNode.data	= oNode.data.replace(cRegExp.$1, fAMLElement_repeater_resolveValue(cRegExp.$2, oData, fResolver));
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

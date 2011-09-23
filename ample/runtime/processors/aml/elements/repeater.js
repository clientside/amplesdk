/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cElement_repeater	= function(){};
cElement_repeater.prototype	= new cAMLElement("repeater");

// Public properties
cElement_repeater.prototype.data	= null;

// Private Properties
cElement_repeater.prototype._timeout	= null;

// Class Event Handlers
cElement_repeater.handlers	= {};
cElement_repeater.handlers["DOMAttrModified"]	= function(oEvent) {
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
cElement_repeater.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	var oElement	= oDocument_ids[this.attributes["data"]];
	if (oElement) {
		this.bind(oElement);
		//
		this.refresh();
	}
};
cElement_repeater.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	this.unbind();
};

// Public Methods
cElement_repeater.prototype.bind	= function(oElement) {
	if (this.data && this.data != oElement)
		this.unbind();
	else {
		this.data	= oElement;
		this.data.register(this);
	}
};

cElement_repeater.prototype.unbind	= function() {
	if (this.data) {
		this.data.unregister(this);
		this.data	= null;
	}
};

cElement_repeater.prototype.refresh	= function() {
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

cElement_repeater.prototype.repeat	= function() {
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
				fElement_repeater_processNode(
					fNode_cloneNode(this.firstChild, true),
					aElements[nIndex],
					fResolver),
				this).dataIndex	= nIndex + 1;
	}
};

var rElement_repeater_regexp	= /(\{([^\}]+)\})/g;

// 'Static' Methods
function fElement_repeater_processNode(oElement, oData, fResolver) {
	var oNode, sName;
	for (var nIndex = 0; nIndex < oElement.childNodes.length; nIndex++)	{
		oNode	= oElement.childNodes[nIndex];
		switch (oNode.nodeType) {
			case 1:	// cNode.ELEMENT_NODE
				for (sName in oNode.attributes)
					if (oNode.attributes.hasOwnProperty(sName) && oNode.attributes[sName].match(rElement_repeater_regexp))
						oNode.attributes[sName]	= oNode.attributes[sName].replace(cRegExp.$1, fElement_repeater_resolveValue(cRegExp.$2, oData, fResolver));
				fElement_repeater_processNode(oNode, oData, fResolver);
				break;

			case 3:	// cNode.TEXT_NODE
			case 4:	// cNode.CDATA_SECTION_NODE
				if (oNode.data.match(rElement_repeater_regexp)) {
					oNode.data	= oNode.data.replace(cRegExp.$1, fElement_repeater_resolveValue(cRegExp.$2, oData, fResolver));
					oNode.nodeValue	= oNode.data;
					oNode.length= oNode.data.length;
				}
		}
	}
	return oElement;
};

function fElement_repeater_resolveValue(sQuery, oData, fResolver) {
	var oElement	= fNodeSelector_query([oData], sQuery, fResolver, true)[0];
	return oElement && oElement.firstChild ? oElement.firstChild.data : '';
};

// Register Element
fAmple_extend(cElement_repeater);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement	= function(){};

cAMLElement.prototype	= new cAMLNode;
cAMLElement.prototype.nodeType	= cAMLNode.ELEMENT_NODE;

// nsIDOMElement
cAMLElement.prototype.tagName	= null;
cAMLElement.prototype.uniqueID	= null;

// HTMLElement
cAMLElement.prototype.style	= null;

//
cAMLElement.prototype.$childNodesAnonymous	= null;

// Private Variables
var nAMLElement_prefix	= 0;

// Public Methods
function fAMLElement_appendChild(oParent, oNode)
{
	if (oNode instanceof cAMLDocumentFragment) {
		while (oNode.firstChild)
			fAMLElement_appendChild(oParent, oNode.firstChild);
	}
	else {
		// Call parent class method
		fAMLNode_appendChild(oParent, oNode);

		// Append DOM
		var oGateway, oElement;
		if (oParent.nodeType == cAMLNode.ELEMENT_NODE)
			if (oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer()))
				if (oElement = (oNode.$getContainer() || fAML_render(oNode)))
			   		oGateway.appendChild(oElement);

		// Register Instance
		if (oAML_all[oParent.uniqueID])
			fAML_register(oNode);
	}

	//
    return oNode;
};

cAMLElement.prototype.appendChild	= function(oNode)
{
	// Invoke actual implementation
	return fAMLElement_appendChild(this, oNode);
};

cAMLElement.prototype.$appendChildAnonymous	= function(oNode)
{
	// Set parent
    oNode.parentNode	= this;

    // Pseudo DOM
    var nLength	= this.$childNodesAnonymous.length;
    if (nLength)
    {
        oNode.previousSibling	= this.$childNodesAnonymous[nLength - 1];
        oNode.previousSibling.nextSibling	= oNode;
    }

    // Add to collection of anonymous child nodes
    this.$childNodesAnonymous.$add(oNode);

	// Fire Mutation event
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	// Register Instance
	if (oAML_all[this.uniqueID])
		fAML_register(oNode);

	return oNode;
};

cAMLElement.prototype.insertBefore	= function(oNode, oBefore)
{
	if (oNode instanceof cAMLDocumentFragment) {
		while (oNode.firstChild)
			this.insertBefore(oNode.firstChild, oBefore);
	}
	else {
		// Call parent class method
		cAMLNode.prototype.insertBefore.call(this, oNode, oBefore);

		// Insert DOM
		var oGateway, oChild;
		if (this.nodeType == cAMLNode.ELEMENT_NODE)
			if ((oGateway =(this.$getContainer("gateway") || this.$getContainer())))
				if (oChild = (oNode.$getContainer() || fAML_render(oNode)))
		    		oGateway.insertBefore(oChild, function() {
		    			for (var oElement; oBefore; oBefore = oBefore.nextSibling)
		    				if (oElement = oBefore.$getContainer())
		    					return oElement;
		    			return null;
		    		}());

		// Register Instance
		if (oAML_all[this.uniqueID])
			fAML_register(oNode);
	}

	//
    return oNode;
};

cAMLElement.prototype.removeChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "removeChild");

	// Fire Mutation event
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	// Unregister Instance
	if (oAML_all[this.uniqueID])
		fAML_unregister(oNode);

	// Call parent class method
	fAMLNode_removeChild(this, oNode);

	// Remove from DOM
	var oChild, oGateway;
	if (this.nodeType == cAMLNode.ELEMENT_NODE)
		if ((oChild = oNode.$getContainer()) && oChild.parentNode)
			oChild.parentNode.removeChild(oChild);

	return oNode;
};

cAMLElement.prototype.$removeChildAnonymous	= function(oNode)
{
	// Fire Mutation event
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	if (oNode.nextSibling)
		oNode.nextSibling.previousSibling	= oNode.previousSibling;

	if (oNode.previousSibling)
		oNode.previousSibling.nextSibling	= oNode.nextSibling;

	// Reset DOM properties
    oNode.parentNode  		= null;
	oNode.previousSibling	= null;
	oNode.nextSibling		= null;

    // Add to collection of anonymous child nodes
    this.$childNodesAnonymous.$remove(oNode);

	// Register Instance
	if (oAML_all[this.uniqueID])
		fAML_unregister(oNode);

	return oNode;
};

cAMLElement.prototype.replaceChild	= function(oNode, oOld)
{
	if (oNode instanceof cAMLDocumentFragment) {
		while (oNode.firstChild)
			this.insertBefore(oNode.firstChild, oOld);
		// remove child if passed
		if (oOld)
			this.removeChild(oOld);
	}
	else {
		// Call parent class method
		cAMLNode.prototype.replaceChild.call(this, oNode, oOld);

		// Unregister Instance
		fAML_unregister(oOld);

		// Replace in from DOM
		var oElement, oGateway, oChild;
		if (this.nodeType == cAMLNode.ELEMENT_NODE)
			if ((oGateway =(this.$getContainer("gateway") || this.$getContainer())) && (oChild = oOld.$getContainer()))
				if (oElement = (oNode.$getContainer() || fAML_render(oNode)))
			    	oGateway.replaceChild(oElement, oChild);

		// Register Instance
		if (oAML_all[this.uniqueID])
			fAML_register(oNode);
	}

	return oOld;
};

cAMLElement.prototype.cloneNode	= function(bDeep)
{
	// Create Element
	var oElement	= fAMLDocument_createElementNS(this.ownerDocument, this.namespaceURI, this.nodeName);

	// Copy Attributes
	for (var sName in this.attributes)
		if (this.attributes.hasOwnProperty(sName))
			oElement.attributes[sName]	= this.attributes[sName];

	// Append Children
	if (bDeep)
		for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
			fAMLNode_appendChild(oElement, this.childNodes[nIndex].cloneNode(bDeep));
	return oElement;
};

function fAMLElement_hasAttribute(oElement, sName)
{
	return oElement.attributes.hasOwnProperty(sName);
};

cAMLElement.prototype.hasAttribute	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",		cString]
	], "hasAttribute");

	return fAMLElement_hasAttribute(this, sName)
};

function fAMLElement_hasAttributeNS(oElement, sNameSpaceURI, sLocalName)
{
	if (sNameSpaceURI == null)
		return fAMLElement_hasAttribute(oElement, sLocalName);

	var sPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI);
	return sPrefix ? fAMLElement_hasAttribute(oElement, sPrefix + ':' + sLocalName) : false;
};

cAMLElement.prototype.hasAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true]
		["localName",		cString]
	], "hasAttributeNS");

	return fAMLElement_hasAttributeNS(this, sNameSpaceURI, sLocalName);
};

function fAMLElement_setAttribute(oElement, sName, sValue)
{
	// convert value to string
	sValue	= cString(sValue);
	var sValueOld	= oElement.attributes[sName],
		bValue	= sName in oElement.attributes;

    if (sValueOld != sValue) {
    	// Only operate on shadow if element is in the DOM
    	if (oAML_all[oElement.uniqueID] && (sName == "id" || sName == "class" || sName == "style")) {
    		// Find shadow content first
    		var oElementDOM	= oElement.$getContainer();
    		if (sName == "id") {
	    		if (sValue)
	    			oAML_ids[sValue]	= oElement;
    			delete oAML_ids[sValueOld];
	    	}
    		// Update view
    		if (oElementDOM) {
		    	if (sName == "class") {
		    		var sValueClass	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName + (sValue ? ' ' + sValue : '');
		    		if (bTrident)
		    			oElementDOM.className	= sValueClass;
		    		else
		    			oElementDOM.setAttribute("class", sValueClass);
		    	}
		    	else
		    	if (sName == "style")
	    			oElementDOM.style.cssText	= sValue;
		    	else
	    			oElementDOM.id	= sValue ? sValue : oElement.uniqueID;
    		}
    	}

    	//
    	oElement.attributes[sName]	= sValue;

    	// Fire Mutation event
    	if (oAML_all[oElement.uniqueID]) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMAttrModified", true, false, null, bValue ? sValueOld : null, sValue, sName, bValue ? cAMLMutationEvent.MODIFICATION : cAMLMutationEvent.ADDITION);
		    fAMLNode_dispatchEvent(oElement, oEvent);
    	}
    }
};

cAMLElement.prototype.setAttribute	= function(sName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",		cString],
		["value",		cObject]
	], "setAttribute");

	fAMLElement_setAttribute(this, sName, sValue);
};

function fAMLElement_setAttributeNS(oElement, sNameSpaceURI, sQName, sValue)
{
	if (sNameSpaceURI != null) {
		// convert value to string
		sValue	= cString(sValue);

		var sElementPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI),
			aQName		= sQName.split(':'),
			sLocalName	= aQName.length > 1 ? aQName[1] : aQName[0],
			sPrefix		= aQName.length > 1 ? aQName[0] : null;

		if (sPrefix)
		{
			if (!sElementPrefix || (sPrefix != sElementPrefix))
				// Put namespace declaration
				oElement.attributes["xmlns" + ':' + sPrefix]	= sNameSpaceURI;
		}
		else
		{
			if (sElementPrefix)
				sPrefix	= sElementPrefix;
			else
			{
				// Create fake prefix
				sPrefix	= '_' + 'p' + nAMLElement_prefix++;

				// Put namespace declaration
				oElement.attributes["xmlns" + ':' + sPrefix]	= sNameSpaceURI;
			}
			//
			sQName	= sPrefix + ':' + sLocalName;
		}

		// Global attributes module
		if (!(sQName in oElement.attributes) && !(sQName == "xmlns" || sNameSpaceURI == "http://www.w3.org/2000/xmlns/" || sNameSpaceURI == "http://www.w3.org/XML/1998/namespace"))
		{
			var oNamespace	= oAML_namespaces[sNameSpaceURI],
				cAttribute	= oNamespace ? oNamespace.attributes[sLocalName] : null,
				oAttribute,
				oEvent;

			if (cAttribute)
			{
				// oAttribute used to create fake object
				oAttribute	= new cAttribute;
				oAttribute.ownerDocument= oElement.ownerDocument;
				oAttribute.ownerElement	= oElement;
				oAttribute.nodeValue	= sValue;
				oAttribute.nodeName		= sQName;
				oAttribute.localName	= sLocalName;
				oAttribute.prefix		= sPrefix;
				oAttribute.namespaceURI	= sNameSpaceURI;
				oAttribute.name		= sQName;
				oAttribute.value	= sValue;

				// Fire Mutation event (pseudo)
				oEvent = new cAMLMutationEvent;
				oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
				oEvent.target	=
				oEvent.currentTarget	= oAttribute;
				oEvent.eventPhase		= cAMLEvent.AT_TARGET;
				fAMLNode_handleEvent(oAttribute, oEvent);
			}
		}
	}

	// Set attribute
	fAMLElement_setAttribute(oElement, sQName, sValue);
};

cAMLElement.prototype.setAttributeNS	= function(sNameSpaceURI, sQName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["qualifiedName",	cString],
		["value",			cObject]
	], "setAttributeNS");

	fAMLElement_setAttributeNS(this, sNameSpaceURI, sQName, sValue);
};

cAMLElement.prototype.setAttributeNode	= function(oAttribute)
{
	this.setAttributeNodeNS(oAttribute);
};

cAMLElement.prototype.setAttributeNodeNS	= function(oAttribute)
{
//->Source
/*
	// Validate arguments
	fAML_validate(arguments, [
		["node",		cAMLAttr]
	], "setAttributeNodeNS");

	//
	oAttribute.ownerElement	= this;
	this.setAttributeNS(oAttribute.namespaceURI, oAttribute.nodeName, oAttribute.nodeValue);
*/
//<-Source
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

function fAMLElement_getAttribute(oElement, sName)
{
    return oElement.attributes.hasOwnProperty(sName) ? oElement.attributes[sName] : '';
};

cAMLElement.prototype.getAttribute	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",			cString]
	], "getAttribute");

	return fAMLElement_getAttribute(this, sName);
};

function fAMLElement_getAttributeNS(oElement, sNameSpaceURI, sLocalName)
{
	if (sNameSpaceURI == null)
		return fAMLElement_getAttribute(oElement, sLocalName);

	var sPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI);
    return sPrefix ? fAMLElement_getAttribute(oElement, sPrefix + ':' + sLocalName) : '';
};

cAMLElement.prototype.getAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], "getAttributeNS");

	return fAMLElement_getAttributeNS(this, sNameSpaceURI, sLocalName);
};

cAMLElement.prototype.getAttributeNode	= function(sName)
{
	return this.getAttributeNodeNS(null, sName);
};

cAMLElement.prototype.getAttributeNodeNS	= function(sNameSpaceURI, sLocalName)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

function fAMLElement_removeAttribute(oElement, sName)
{
	if (sName in oElement.attributes) {
		var sValueOld	= oElement.attributes[sName];
		// Only operate on shadow if element is in the DOM
    	if (oAML_all[oElement.uniqueID] && (sName == "id" || sName == "class" || sName == "style")) {
    		// Find shadow content
    		var oElementDOM	= oElement.$getContainer();
    		if (sName == "id") {
		    	delete oAML_ids[sValueOld];
		    }
		    // Update view
		    if (oElementDOM) {
			    if (sName == "class") {
			    	var sValueClass	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName;
			    	if (bTrident)
			    		oElementDOM.className	= sValueClass;
			    	else
			    		oElementDOM.setAttribute("class", sValueClass);
			    }
			    else
			    if (sName == "style")
			    	oElementDOM.style.cssText	= '';
			    else
			    	oElementDOM.id	= oElement.uniqueID;
		    }
    	}
	    //
	    delete oElement.attributes[sName];

		// Fire Mutation event
	    if (oAML_all[oElement.uniqueID]) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMAttrModified", true, false, null, sValueOld, null, sName, cAMLMutationEvent.REMOVAL);
		    fAMLNode_dispatchEvent(oElement, oEvent);
	    }
	}
};

cAMLElement.prototype.removeAttribute	= function(sName)
{
	fAML_validate(arguments, [
		["name",	cString]
	], "removeAttribute");

	fAMLElement_removeAttribute(this, sName);
};

function fAMLElement_removeAttributeNS(oElement, sNameSpaceURI, sLocalName)
{
	if (sNameSpaceURI != null) {
		var sPrefix	= fAMLNode_lookupPrefix(oElement, sNameSpaceURI),
			sQName	= sPrefix + ':' + sLocalName;

		if (!sPrefix)
			return;

		// Global attributes module
		if (sQName in oElement.attributes && !(sLocalName == "xmlns" || sNameSpaceURI == "http://www.w3.org/2000/xmlns/" || sNameSpaceURI == "http://www.w3.org/XML/1998/namespace"))
		{
			var oNamespace	= oAML_namespaces[sNameSpaceURI],
				cAttribute	= oNamespace ? oNamespace.attributes[sLocalName] : null,
				sValue		= oElement.attributes[sQName],
				oAttribute,
				oEvent;

			if (cAttribute)
			{
				// oAttribute used to create fake object
				oAttribute	= new cAttribute;
				oAttribute.ownerDocument= oElement.ownerDocument;
				oAttribute.ownerElement	= oElement;
				oAttribute.nodeValue	= sValue;
				oAttribute.nodeName		= sQName;
				oAttribute.localName	= sLocalName;
				oAttribute.prefix		= sPrefix;
				oAttribute.namespaceURI	= sNameSpaceURI;
				oAttribute.name		= sQName;
				oAttribute.value	= sValue;

				// Fire Mutation event (pseudo)
				oEvent = new cAMLMutationEvent;
				oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
				oEvent.target	=
				oEvent.currentTarget	= oAttribute;
				oEvent.eventPhase		= cAMLEvent.AT_TARGET;
				fAMLNode_handleEvent(oAttribute, oEvent);
			}
		}

		//
		sLocalName	= sQName;
	}

	fAMLElement_removeAttribute(oElement, sLocalName);
};

cAMLElement.prototype.removeAttributeNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], "removeAttributeNS");

	fAMLElement_removeAttributeNS(this, sNameSpaceURI, sLocalName);
};

cAMLElement.prototype.removeAttributeNode	= function(oAttribute)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLElement.prototype.hasChildNodes	= function()
{
	return this.childNodes.length > 0;
};

function fAMLElement_getElementsByTagName(oElement, sTagName)
{
	var aElements	= new cAMLNodeList,
		bTagName	= '*' == sTagName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == cAMLNode.ELEMENT_NODE) {
				if (bTagName || sTagName == oNode.tagName)
					aElements.$add(oNode);
				if (oNode.childNodes.length)
					arguments.callee(oNode);
			}
		}
	})(oElement);
	return aElements;
};

cAMLElement.prototype.getElementsByTagName	= function(sTagName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	], "getElementsByTagName");

	return fAMLElement_getElementsByTagName(this, sTagName);
};

function fAMLElement_getElementsByTagNameNS(oElement, sNameSpaceURI, sLocalName)
{
	var aElements	= new cAMLNodeList,
		bNameSpaceURI	= '*' == sNameSpaceURI,
		bLocalName		= '*' == sLocalName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == cAMLNode.ELEMENT_NODE) {
				if ((bLocalName || sLocalName == oNode.localName) && (bNameSpaceURI || sNameSpaceURI == oNode.namespaceURI))
					aElements.$add(oNode);
				if (oNode.childNodes.length)
					arguments.callee(oNode);
			}
		}
	})(oElement);
	return aElements;
};

cAMLElement.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString],
		["localName",		cString]
	], "getElementsByTagNameNS");

	return fAMLElement_getElementsByTagNameNS(this, sNameSpaceURI, sLocalName);
};
/*
cAMLElement.prototype.focus	= function()
{

};

cAMLElement.prototype.blur	= function()
{

};
*/

cAMLElement.prototype.$activate	= function()
{
	var oEvent	= new cAMLUIEvent;
	oEvent.initUIEvent("DOMActivate", true, true, window, null);
	fAMLNode_dispatchEvent(this, oEvent);
};

cAMLElement.prototype.$getTag		= function()
{
	var aHtml	= [this.$getTagOpen().replace(/^(\s*<[\w:]+)/, '$1 id="' +(this.attributes.id || this.uniqueID)+ '"')];
	for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
		aHtml[aHtml.length]	= this.childNodes[nIndex].$getTag();
	return aHtml.join('') + this.$getTagClose();
};

cAMLElement.prototype.$getTagOpen	= function()
{
	return '';
};

cAMLElement.prototype.$getTagClose	= function()
{
	return '';
};

/*
cAMLElement.prototype.$getContainer	= function(sName) {
	var sId	= this.uniqueID + (sName ? '_' + sName : '');
    if (!this.$cache)
    	this.$cache	= {};
    return this.$cache[sId] ||(this.$cache[sId] = oUADocument.getElementById(sId));
};
*/
/*
cAMLElement.prototype.$getContainer	= function(sName)
{
   	return oUADocument.getElementById(this.uniqueID + (sName ? '_' + sName : ''));
};
*/

cAMLElement.prototype.getBoundingClientRect	= function(sPseudo)
{
    var oElementDOM	= this.$getContainer(sPseudo),
		oClientRect	= oElementDOM.getBoundingClientRect ? oElementDOM.getBoundingClientRect() : null,
		oRectangle	= {};

	// if 'getBoundingClientRect' is supported in the given browser
	if (oClientRect) {
		oRectangle.right	= oClientRect.right;
		oRectangle.bottom	= oClientRect.bottom;
		oRectangle.left		= oClientRect.left;
		oRectangle.top		= oClientRect.top;
	}
	else {
		var nWidth	= oElementDOM.offsetWidth,
			nHeight	= oElementDOM.offsetHeight;
		// Calculate offsets
		oRectangle.left		= 0;
		oRectangle.top		= 0;
		for (; oElementDOM; oElementDOM = oElementDOM.offsetParent) {
			oRectangle.left	+= oElementDOM.offsetLeft;
			oRectangle.top 	+= oElementDOM.offsetTop;
		}
		oRectangle.right	= oRectangle.left + nWidth;
		oRectangle.bottom	= oRectangle.top + nHeight;
	}

	return oRectangle;
};
/*
cAMLElement.prototype.$getContainer	= function(sName)
{
	var sShadow	= '#' +(sName || ''),
		oCache	= oAML_shadow[this.uniqueID] ||(oAML_shadow[this.uniqueID] = {});

	if (sShadow in oCache)
		return oCache[sShadow];
	else {
		var oNode	= oUADocument.getElementById(this.attributes.id || this.uniqueID);
		if (sName && oNode) {
			var rClass	= new cRegExp('--' + sName + '(\\s|$)');
			oNode	= (function (oContext, oNode) {
				for (var nIndex = 0, aNodes = oNode.childNodes, oElement, sClass; oNode = aNodes[nIndex]; nIndex++)
					if (oNode.nodeType == 1 && !oNode.id) {
						// If pseudo-element
						if ((sClass = oNode.className) && sClass.match(rClass))
							return oNode;
						// Check children
						if (oElement = arguments.callee(oContext, oNode))
							return oElement;
					}
				return null;
			})(this, oNode);
		}
		return oCache[sShadow]	= oNode;
	}
};
*/
cAMLElement.prototype.$getContainer	= function(sName)
{
	var oNode	= oUADocument.getElementById(this.attributes.id || this.uniqueID);
	if (sName && oNode) {
		var rClass	= new cRegExp('--' + sName + '(\\s|$)');
		return (function (oNode) {
			for (var nIndex = 0, aNodes = oNode.childNodes, oElement, sClass; oNode = aNodes[nIndex]; nIndex++)
				if (oNode.nodeType == 1) {
					// If pseudo-element
					if ((sClass = (bTrident && nVersion < 8 ? oNode.className : oNode.getAttribute("class"))) && sClass.match(rClass))
						return oNode;
					// Check children
					if (!oNode.id &&(oElement = arguments.callee(oNode)))
						return oElement;
				}
			return null;
		})(oNode);
	}
	return oNode;
};

/*
function fAMLElement_setPseudoClass(oElement, sName, bValue, sContainer)
{
	var oElementDOM	= oElement.$getContainer(sContainer);
    oElementDOM.className	= oElementDOM.className.replace(/(\w+-[a-z\-]+)?_(\w+)?/ig, '$1_' + (bValue ? sName : ''));
};
*/
/*
function fAMLElement_addClass(oElement, sClass) {
	if (!fAMLElement_hasClass(oElement, sClass))
		oElement.className += ' ' + sClass;
};

function fAMLElement_hasClass(oElement, sClass) {
	return oElement.className.match(fAMLElement_getRegExp(sClass));
};

function fAMLElement_removeClass(oElement, sClass) {
	if (fAMLElement_hasClass(oElement, sClass))
		oElement.className	= oElement.className.replace(fAMLElement_getRegExp(sClass), ' ');
};
*/

var oAMLElement_cache	= {};
function fAMLElement_getRegExp(sName, sContainer) {
	return	oAMLElement_cache[sName + sContainer]
		?	oAMLElement_cache[sName + sContainer]
		:	oAMLElement_cache[sName + sContainer] = new cRegExp('(^|\\s)[-\\w]*' + sContainer + '(_\\w+)?' + '_' + sName + '(_\\w+)?' + '(|$)', 'g');
};

function fAMLElement_setPseudoClass(oElement, sName, bValue, sContainer)
{
	var oElementDOM	= oElement.$getContainer(sContainer),
		sClass		= oElement.getAttribute("class"),
		sPseudoName	= sContainer ? '--' + sContainer : '',
		sTagName	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName;

//->Source
//console.warn("processing: " + oElement.tagName + ' ' + sName + '(' + (bValue ? 'true' : 'false') + ')');
//console.log("before: ", oElementDOM.className);
//<-Source

	if (oElementDOM) {
		var sOldName= bTrident && nVersion < 8 ? oElementDOM.className : oElementDOM.getAttribute("class") || '',
			bMatch	= sOldName.match(fAMLElement_getRegExp(sName, sPseudoName)),
			sNewName;
		if (bValue) {
			// Add class
			if (!bMatch) {
				var aMatch	= sOldName.replace(/_\w+_\w+/g, '').match(/_\w+/g),
					aNewName= [];
				// create pair combinations :hover:focus, :focus:hover
				if (aMatch)
					for (var nIndex = 0, nLength = aMatch.length, oCache = {}; nIndex < nLength; nIndex++)
						if (!oCache[aMatch[nIndex]]) {
							if (sClass)
								aNewName.push(	// ns|element.class(::pseudo-element)?:pseudo-class:pseudo-class2
												' ' + sTagName + '-' + sClass + sPseudoName + '_' + sName + aMatch[nIndex] +
												// ns|element.class(::pseudo-element)?:pseudo-class2:pseudo-class
												' ' + sTagName + '-' + sClass + sPseudoName + aMatch[nIndex] + '_' + sName +
												// .class(::pseudo-element)?:pseudo-class:pseudo-class2
												' ' + sClass + sPseudoName + '_' + sName + aMatch[nIndex] +
												// .class(::pseudo-element)?:pseudo-class2:pseudo-class
												' ' + sClass + sPseudoName + aMatch[nIndex] + '_' + sName);
							// ns|element(::pseudo-element)?:pseudo-class:pseudo-class2
							aNewName.push(	' ' + sTagName + sPseudoName + '_' + sName + aMatch[nIndex]);
							// ns|element(::pseudo-element)?:pseudo-class2:pseudo-class
							aNewName.push(	' ' + sTagName + sPseudoName + aMatch[nIndex] + '_' + sName);
							// indicate class name processed
							oCache[aMatch[nIndex]]	= true;
						}
				if (sClass)
					aNewName.push(	// ns|element.class(::pseudo-element)?:pseudo-class
									' ' + sTagName + '-' + sClass + sPseudoName + '_' + sName +
									// .class(::pseudo-element)?:pseudo-class
								  	' ' + sClass + sPseudoName + '_' + sName);
				// ns|element(::pseudo-element)?:pseudo-class
				aNewName.push(	' ' + sTagName + sPseudoName + '_' + sName + aNewName.join(''));
				sNewName	= aNewName.join('');
				if (bTrident && nVersion < 8)
					oElementDOM.className += sNewName;
				else
					oElementDOM.setAttribute("class", sOldName + sNewName);
			}
		}
		else {
			// Remove class
			if (bMatch) {
				// remove all classes having :pseudo-class
				sNewName	= sOldName.replace(fAMLElement_getRegExp(sName, sPseudoName), '');	// TODO: Remove space?
				if (bTrident && nVersion < 8)
					oElementDOM.className	= sNewName;
				else
					oElementDOM.setAttribute("class", sNewName);
			}
		}
	}
//->Debug
	else
		fAML_warn(nAML_NOT_FOUND_SHADOW_WRN, [oElement.tagName, sContainer || '']);
//<-Debug

//->Source
//console.log("after: ", oElementDOM.className);
//<-Source
};

// Attaching to impementation
cAMLElement.prototype.$setPseudoClass	= function(sName, bState, sContainer)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString],
		["state",	cBoolean],
		["pseudoElement",	cString, true]
	], "$setPseudoClass");

	fAMLElement_setPseudoClass(this, sName, bState, sContainer);
};

// Content Loader
function fAMLElement_load(oElement, sUrl, sMethod, oHeaders, sData)
{
	if (oElement._timeout)
		fClearTimeout(oElement._timeout);
	if (oElement._request)
		oElement._request["on" + "readystatechange"]	= new cFunction;

	// Dispatch unload event
	var oEvent	= new cAMLEvent;
	oEvent.initEvent("unload", false, false);
	fAMLNode_dispatchEvent(oElement, oEvent);

	// Remove nodes
	while (oElement.firstChild)
		oElement.removeChild(oElement.firstChild);

	// Do timeout before loading
	oElement._timeout	= fSetTimeout(function(){fAMLElement_onTimeOut(oElement, sUrl, oHeaders, sMethod, sData)}, 1);
	oElement._request	= null;
};

function fAMLElement_onTimeOut(oElement, sUrl, oHeaders, sMethod, sData)
{
	// Create request
	var oRequest	= new cXMLHttpRequest;
	oRequest["on" + "readystatechange"]	= function(){fAMLElement_onReadyStateChange(oRequest, oElement)};
	oRequest.open(sMethod, sUrl, true);
	oHeaders["X-Requested-With"]	= "XMLHttpRequest";
	oHeaders["X-User-Agent"]		= oAMLConfiguration_values["ample-user-agent"];
	for (var sHeader in oHeaders)
		if (oHeaders.hasOwnProperty(sHeader))
			oRequest.setRequestHeader(sHeader, oHeaders[sHeader]);
	oRequest.send(sData);

	// Save in order to be able to cancel
	oElement._timeout	= null;
	oElement._request	= oRequest;
};

function fAMLElement_onReadyStateChange(oRequest, oElement)
{
	if (oRequest.readyState == 4)
	{
		// Remove memory leak in IE
		oRequest["on" + "readystatechange"]	= new cFunction;
	    delete oElement._timeout;
	    delete oElement._request;

	    var oDocument	= fAML_getResponseDocument(oRequest);
	    if (oDocument)
	    {
			// Render Content
	    	fAMLElement_appendChild(oElement, fAML_import(oDocument.documentElement, null));

			// Dispatch load event
			var oEvent	= new cAMLEvent;
			oEvent.initEvent("load", false, false);
			fAMLNode_dispatchEvent(oElement, oEvent);
	    }
	    else
	    {
//->Debug
			fAML_warn(nAML_NOT_WELLFORMED_WRN);
//<-Debug

			// Dispatch load event
			var oEvent	= new cAMLEvent;
			oEvent.initEvent("error", true, false);
			fAMLNode_dispatchEvent(oElement, oEvent);
	    }
	}
};

cAMLElement.prototype.$load	= function(sUrl, sMethod, oHeaders, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["url",		cString],
		["method",	cString, true, true],
		["headers",	cObject, true, true],
		["data",	cString, true, true]
	], "$load");

	fAMLElement_load(this, sUrl, sMethod || "GET", oHeaders || {}, sData || null);
};


cAMLElement.prototype.scrollIntoView	= function(bTop) {
	// Validate arguments
	fAML_validate(arguments, [
		["top",	cBoolean, true, false]	// Optional, null is not allowed
	], "scrollIntoView");

	var oElementDOM	= this.$getContainer();
	if (oElementDOM) {
		if (oElementDOM.scrollIntoView)
			oElementDOM.scrollIntoView(bTop || false);
		else {
			// TODO: Implement. FF for example doesn't support it on SVG elements
		}
	}
};

/*
cAMLElement.prototype.$getPseudoElement	= function(sName)
{
   	return this.$getContainer(sName);
};
*/

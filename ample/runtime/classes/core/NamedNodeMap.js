/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cNamedNodeMap	= function() {

};

cNamedNodeMap.prototype.length	= 0;

cNamedNodeMap.prototype.item	= function(nIndex) {
//->Guard
	fGuard(arguments, [
		["index",	cNumber]
	]);
//<-Guard

	return this.length > nIndex ? this[nIndex] : null;
};

function fNamedNodeMap_getNamedItem(oMap, sName) {
	// Slow lookup for names which are members of NamedNodeMap object
	if (sName in cNamedNodeMap.prototype) {
		for (var nIndex = 0; nIndex < oMap.length; nIndex++)
			if (oMap[nIndex].nodeName == sName)
				return oMap[nIndex];
		return null;
	}
	//
	return oMap[sName] || null;
};

cNamedNodeMap.prototype.getNamedItem	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard

	return fNamedNodeMap_getNamedItem(this, sName);
};

cNamedNodeMap.prototype.setNamedItem	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	var oOldNode	= fNamedNodeMap_removeItemNS(this, null, oNode.name);
	fNamedNodeMap_addItem(this, oNode);
	return oOldNode;
};

cNamedNodeMap.prototype.removeNamedItem	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard

	return fNamedNodeMap_removeItemNS(this, null, sName);
};

// DOM Level 2
cNamedNodeMap.prototype.getNamedItemNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	]);
//<-Guard

	// Slow lookup for names which are members of NamedNodeMap object
	if (sNameSpaceURI == null)
		return fNamedNodeMap_getNamedItem(this, sLocalName);
	//
	for (var nIndex = 0; nIndex < this.length; nIndex++)
		if (this[nIndex].localName == sLocalName && this[nIndex].namespaceURI == sNameSpaceURI)
			return this[nIndex];
	return null;
};

cNamedNodeMap.prototype.setNamedItemNS	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	var oOldNode	= fNamedNodeMap_removeItemNS(this, oNode.namespaceURI, oNode.localName);
	fNamedNodeMap_addItem(this, oNode);
	return oOldNode;
};

cNamedNodeMap.prototype.removeNamedItemNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	]);
//<-Guard

	return fNamedNodeMap_removeItemNS(this, sNameSpaceURI, sLocalName);
};

function fNamedNodeMap_addItem(oMap, oNode) {
	oMap[oMap.length++]	= oNode;
	if (!(oNode.nodeName in cNamedNodeMap.prototype))
		oMap[oNode.nodeName]	= oNode;
};

function fNamedNodeMap_removeItemNS(oMap, sNameSpaceURI, sLocalName) {
	var oNode	= null;
	for (var nIndex = 0, oItem; nIndex < oMap.length; nIndex++) {
		oItem	= oMap[nIndex];
		if (oNode)
			oMap[nIndex - 1]	= oItem;
		else
		if (sNameSpaceURI ? oItem.namespaceURI == sNameSpaceURI && oItem.localName == sLocalName : oItem.nodeName == sLocalName)
			oNode	= oItem;
	}
	// Remove if found
	if (oNode) {
		delete oMap[--oMap.length];
		if (!(oNode.nodeName in cNamedNodeMap.prototype))
			delete oMap[oNode.nodeName];
	}
	//
	return oNode;
};


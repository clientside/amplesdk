/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cNamedNodeMap	= function() {};

cNamedNodeMap.prototype.length	= 0;

cNamedNodeMap.prototype.item	= function(nIndex) {
	return this.length > nIndex ? this.$all[nIndex] : null;
};

cNamedNodeMap.prototype.getNamedItem	= function(sName) {
	return this.$map[sName] || null;
};

cNamedNodeMap.prototype.setNamedItem	= function(oNode) {
	var oOldNode	= this.removeNamedItem(oNode.name);
	fNamedNodeMap_addItemByKey(this, oNode.name, oNode);
	return oOldNode;
};

cNamedNodeMap.prototype.removeNamedItem	= function(sName) {
	return fNamedNodeMap_removeItemByKey(this, sName);
};

// DOM Level 2
cNamedNodeMap.prototype.getNamedItemNS	= function(sNameSpaceURI, sLocalName) {
	return this.$map[sNameSpaceURI + '#' + sLocalName] || null;
};

cNamedNodeMap.prototype.setNamedItemNS	= function(oNode) {
	var oOldNode	= fNamedNodeMap_remove(oMap, oNode.namespaceURI, oNode.localName);
	fNamedNodeMap_addItemByKey(this, oNode.namespaceURI + '#' + oNode.localName, oNode);
	return oOldNode;
};

cNamedNodeMap.prototype.removeNamedItemNS	= function(sNameSpaceURI, sLocalName) {
	return fNamedNodeMap_removeItemByKey(this, sNameSpaceURI + '#' + sLocalName);
};

function fNamedNodeMap_addItemByKey(oMap, sKey, oNode) {
	oMap.length++;
	oMap.$all.push(oNode);
	oMap.$map[sKey]	= oNode;
};

function fNamedNodeMap_removeItemByKey(oMap, sKey) {
	// Remove from $all collection
	var oNode	= oMap.$map[sKey] || null;
	if (oNode) {
		for (var nIndex = 0, bFound	= false; nIndex < oMap.length; nIndex++)
			if (bFound)
				oMap.$all[nIndex - 1]	= oMap.$all[nIndex];
			else
			if (oMap.$all[nIndex] == oNode)
				bFound	= true;
		//
		delete oMap.$all[--oMap.length];
		// Remove from $map collection
		delete oMap.$map[sKey];
	}
	return oNode;
};


/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cEntityReference	= function(){};

cEntityReference.prototype	= new cNode;
cEntityReference.prototype.nodeType	= 5;	// cNode.ENTITY_REFERENCE_NODE

/*
cEntityReference.prototype.$getTag	= function() {
	return this.nodeValue;
};
*/

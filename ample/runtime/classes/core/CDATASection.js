/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cCDATASection	= function(){};

cCDATASection.prototype	= new cText;
cCDATASection.prototype.nodeType	= 4;	// cNode.CDATA_SECTION_NODE
cCDATASection.prototype.nodeName	= "#cdata-section";

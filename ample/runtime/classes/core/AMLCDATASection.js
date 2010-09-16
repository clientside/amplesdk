/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLCDATASection(){};

cAMLCDATASection.prototype	= new cAMLText;
cAMLCDATASection.prototype.nodeType	= cAMLNode.CDATA_SECTION_NODE;
cAMLCDATASection.prototype.nodeName	= "#cdata-section";

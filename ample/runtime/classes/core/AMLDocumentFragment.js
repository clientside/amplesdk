/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLDocumentFragment	= function(){};

cAMLDocumentFragment.prototype	= new cAMLNode;
cAMLDocumentFragment.prototype.nodeType	= cAMLNode.DOCUMENT_FRAGMENT_NODE;
cAMLDocumentFragment.prototype.nodeName	= "#document-fragment";

// nsIDOMDocumentFragment

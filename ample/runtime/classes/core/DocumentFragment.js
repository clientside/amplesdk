/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDocumentFragment	= function(){};

cDocumentFragment.prototype	= new cNode;
cDocumentFragment.prototype.nodeType	= 11;	// cNode.DOCUMENT_FRAGMENT_NODE
cDocumentFragment.prototype.nodeName	= "#document-fragment";

// nsIDOMDocumentFragment

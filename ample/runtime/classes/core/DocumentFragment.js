/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDocumentFragment	= function(){};

cDocumentFragment.prototype	= new cNode;
cDocumentFragment.prototype.nodeType	= cNode.DOCUMENT_FRAGMENT_NODE;
cDocumentFragment.prototype.nodeName	= "#document-fragment";

// nsIDOMDocumentFragment

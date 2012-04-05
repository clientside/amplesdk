/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_keygen	= function(){
		this.validity	= new cXHTMLValidityState;
};
cXHTMLElement_keygen.prototype	= new cXHTMLInputElement("keygen");

// Register Element
ample.extend(cXHTMLElement_keygen);

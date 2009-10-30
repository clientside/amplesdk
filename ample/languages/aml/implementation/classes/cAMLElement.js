/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement	= function(){};
cAMLElement.prototype	= new AMLElement;
cAMLElement.prototype.AMLElement	= new AMLElement;

// Register Element with language
oAMLNamespace.setElement("#element", cAMLElement);

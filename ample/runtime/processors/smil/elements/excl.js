/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement_excl	= function(){};
cSMILElement_excl.prototype	= new cSMILTimeElement("excl");

// Class Event Handlers
cSMILElement_excl.handlers	= {};
cSMILElement_excl.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	fSMILTimeElement_init(this);
};

// Register Element
fAmple_extend(cSMILElement_excl);

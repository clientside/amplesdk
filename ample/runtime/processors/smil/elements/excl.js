/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement_excl	= function(){};
cSMILElement_excl.prototype	= new cSMILTimeElement("excl");

// Class Event Handlers
cSMILElement_excl.handlers	= {};
cSMILElement_excl.handlers["DOMNodeInsertedIntoDocument"]	= fSMILTimeElement_init;

// Register Element
fAmple_extend(cSMILElement_excl);

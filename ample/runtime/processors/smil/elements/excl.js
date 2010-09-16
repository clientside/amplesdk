/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSMILElement_excl(){};
cSMILElement_excl.prototype	= new cSMILTimeElement("excl");

// Class Event Handlers
cSMILElement_excl.handlers	= {};
cSMILElement_excl.handlers["DOMNodeInsertedIntoDocument"]	= fSMILTimeElement_init;

// Register Element
fAmple_extend(cSMILElement_excl);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement_par	= function(){};
cSMILElement_par.prototype	= new cSMILTimeElement("par");

// Class Event Handlers
cSMILElement_par.handlers	= {};
cSMILElement_par.handlers["DOMNodeInsertedIntoDocument"]	= fSMILTimeElement_init;

// Register Element
fAmple_extend(cSMILElement_par);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement_seq	= function(){};
cSMILElement_seq.prototype	= new cSMILTimeElement("seq");

// Class Event Handlers
cSMILElement_seq.handlers	= {};
cSMILElement_seq.handlers["DOMNodeInsertedIntoDocument"]	= fSMILTimeElement_init;

// Register Element
fAmple_extend(cSMILElement_seq);

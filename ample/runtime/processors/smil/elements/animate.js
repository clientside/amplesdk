/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSMILElement_animate(){};
cSMILElement_animate.prototype	= new cSMILAnimationElement("animate");

// Class Event Handlers
cSMILElement_animate.handlers	= {};
cSMILElement_animate.handlers["DOMNodeInsertedIntoDocument"]	= fSMILAnimationElement_init;

// Register Element
fAmple_extend(cSMILElement_animate);

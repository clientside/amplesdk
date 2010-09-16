/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSMILElement_animateColor(){};
cSMILElement_animateColor.prototype	= new cSMILAnimationElement("animateColor");

// Class Event Handlers
cSMILElement_animateColor.handlers	= {};
cSMILElement_animateColor.handlers["DOMNodeInsertedIntoDocument"]	= fSMILAnimationElement_init;

// Register Element
fAmple_extend(cSMILElement_animateColor);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSMILElement_animateMotion(){};
cSMILElement_animateMotion.prototype	= new cSMILAnimationElement("animateMotion");

// Class Event Handlers
cSMILElement_animateMotion.handlers	= {};
cSMILElement_animateMotion.handlers["DOMNodeInsertedIntoDocument"]	= fSMILAnimationElement_init;

// Register Element
fAmple_extend(cSMILElement_animateMotion);

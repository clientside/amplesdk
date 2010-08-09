/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement_animateColor	= function(){};
cSMILElement_animateColor.prototype	= new cSMILAnimationElement("animateColor");

// Class Event Handlers
cSMILElement_animateColor.handlers	= {};
cSMILElement_animateColor.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	fSMILTimeElement_init(this);
	fSMILAnimationElement_init(this);
};

// Register Element
fAmple_extend(cSMILElement_animateColor);

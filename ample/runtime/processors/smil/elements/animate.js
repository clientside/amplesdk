/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement_animate	= function(){};
cSMILElement_animate.prototype	= new cSMILAnimationElement("animate");

// Class Event Handlers
cSMILElement_animate.handlers	= {};
cSMILElement_animate.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	fSMILAnimationElement_init(this);
};

// Register Element
fAmple_extend(cSMILElement_animate);

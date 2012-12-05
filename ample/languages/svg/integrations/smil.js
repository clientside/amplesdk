/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function copyElements(sSourceNS, sTargetNS, aElements) {
	for (var nIndex = 0, fSource, fTarget; nIndex < aElements.length; nIndex++) {
		fSource	= ample.classes[sSourceNS + '#' + aElements[nIndex]];
		fTarget	= function() {
			fSource.call(this);
		};
		fTarget.prototype	= new fSource;
		fTarget.prototype.localName		= aElements[nIndex];
		fTarget.prototype.namespaceURI	= sTargetNS;
		// Statics Object Members
		fTarget.handlers	= fSource.handlers;
		//
		ample.extend(fTarget);
	}
};

// Map SMIL
copyElements("http://www.w3.org/2008/SMIL30/", "http://www.w3.org/2000/svg",
	["set", "animate", "animateColor", "animateMotion", "animateTransform", "par", "seq", "excl"]
);


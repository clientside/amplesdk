/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function copyElement(sTarget, sSource) {
	var aTarget	= sTarget.split('#'),
		fSource	= ample.$element(sSource),
		oSource	= new fSource;
	//
	oSource.namespaceURI= aTarget[0];
	oSource.localName	= aTarget[1];
	var fTarget	= function() {
		fSource.call(this);
	};
	fTarget.prototype	= oSource;
	// Statics Object Members
	fTarget.handlers	= fSource.handlers;
	fTarget.attributes	= fSource.attributes;
	//
	ample.extend(fTarget);
};

// Map SMIL
copyElement("http://www.w3.org/2000/svg#set", "http://www.w3.org/2008/SMIL30/#set");
copyElement("http://www.w3.org/2000/svg#animate", "http://www.w3.org/2008/SMIL30/#animate");
copyElement("http://www.w3.org/2000/svg#animateColor", "http://www.w3.org/2008/SMIL30/#animateColor");
copyElement("http://www.w3.org/2000/svg#animateMotion", "http://www.w3.org/2008/SMIL30/#animateMotion");
copyElement("http://www.w3.org/2000/svg#animateTransform", "http://www.w3.org/2008/SMIL30/#animateTransform");

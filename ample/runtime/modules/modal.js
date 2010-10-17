/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

oAmple.modal		= function(oElement) {
	// Validate arguments
	fGuard(arguments, [
		["element",	cAMLElement, true, true]
	]);
	//
	if (oElement == null)
		oBrowser_modalNode	= oAmple.activeElement	= null;
	else
		oBrowser_modalNode	= oAmple.activeElement	= oElement;
};

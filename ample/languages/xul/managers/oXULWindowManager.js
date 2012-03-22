/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULWindowManager	= (function () {

	// Local variables
	var nWindowIndex	= 1;

	// Attaching manager to document
	ample.bind("mousedown",	function(oEvent) {
		// manage windows stack
		for (var oElement = oEvent.target, oStyle; oElement; oElement = oElement.parentNode)
			if (oElement instanceof cXULWindowElement)
				if ((oStyle = oElement.$getContainer().style) && (oStyle.zIndex < nWindowIndex))
					oStyle.zIndex	= ++nWindowIndex;
	}, true);

	// Public Object
	return {

	};
})();
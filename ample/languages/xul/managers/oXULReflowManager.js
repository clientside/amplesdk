/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULReflowManager	= (function () {
	// Private Variables
	var nTimeout	= null,
		aReflowStack	= [];

	// Private Functions
	function fOnTimeout() {
		nTimeout	= null;
		while (aReflowStack.length)
			aReflowStack.shift().reflow();
	};

	function fSchedule(oElement) {
		// Return if an ascendant is scheduled
		for (var oNode = oElement, nIndex, nLength = aReflowStack.length; oNode; oNode = oNode.parentNode)
			for (nIndex = 0, nLength; nIndex < nLength; nIndex++)
				if (aReflowStack[nIndex] == oNode)
					return;
		// Schedule reflow otherwise (asynch)
		aReflowStack.push(oElement);
		if (!nTimeout)
			nTimeout	= setTimeout(fOnTimeout, 0);
	};

	// Add handlers
	// Elements added at build-time
	ample.bind("DOMNodeInsertedIntoDocument", function(oEvent) {
		if (oEvent.target.parentNode instanceof cXULElement && oEvent.target.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
			fSchedule(oEvent.target.parentNode);
	}, true);

	// on browser window resize reflow page
	ample.bind("resize", function(oEvent) {
		if (!(oEvent instanceof ample.classes.ResizeEvent)) {
			var oElement	= this.querySelector("xul|page", function(){return cXULElement.prototype.namespaceURI});
			if (oElement)
				fSchedule(oElement);
		}
	});

	// on windowed element resize reflow it
	ample.bind("resizeend", function(oEvent) {
		var oElement	= oEvent.target;
		if (oElement instanceof cXULWindowElement) {
			oElement.setAttribute("width", parseInt(oElement.$getContainer().style.width));
			oElement.setAttribute("height", parseInt(oElement.$getContainer().style.height));
			//
			fSchedule(oElement);
		}
	});

	// Public Object
	return {
		"schedule":	function(oElement) {
			fSchedule(oElement);
		}
	};
})();
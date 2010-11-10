/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
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
		if (aReflowStack.indexOf(oElement) ==-1)
			aReflowStack.push(oElement);
		if (!nTimeout)
			nTimeout	= setTimeout(fOnTimeout, 0);
	};

	// Add handlers
	ample.bind("DOMNodeInsertedIntoDocument", function(oEvent) {
		// Add to the stack for reflow
		if (oEvent.target instanceof cXULElement && oEvent.target.viewType == cXULElement.VIEW_TYPE_BOXED)
			fSchedule(oEvent.target);
		else
		if (oEvent.target.parentNode instanceof cXULElement && oEvent.target.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
			fSchedule(oEvent.target.parentNode);
/*
		if (oEvent.target instanceof cXULWindowElement || oEvent.target instanceof cXULElement_page)
			fSchedule(oEvent.target);
*/
	}, true);
/*
	ample.bind("resize", function(oEvent) {
		var aElements = this.querySelectorAll("xul|page, xul|dialog, xul|window, xul|wizard", function(){return cXULElement.prototype.namespaceURI});
		for (var nIndex = 0, aElements; nIndex < aElements.length; nIndex++)
			fSchedule(aElements[nIndex]);
	});
*/
	// Public Object
	return {
		"schedule":	function(oElement) {
			fSchedule(oElement);
		}
	};
})();
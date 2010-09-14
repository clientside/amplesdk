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
		for (var oElement; oElement = aReflowStack.pop();)
			oElement.reflow();
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
		if (oEvent.target instanceof cXULElement &&(oEvent.target.viewType == cXULElement.VIEW_TYPE_BOXED || oEvent.target instanceof cXULElement_row))
			fSchedule(oEvent.target);
	}, true);

	// Public Object
	return {
		"schedule":	function(oElement) {
			fSchedule(oElement);
		}
	};
})();
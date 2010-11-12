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
	// Elements added at build-time
	ample.bind("DOMNodeInsertedIntoDocument", function(oEvent) {
		// Add to the stack for reflow
		if (oEvent.target instanceof cXULElement_page)
			fSchedule(oEvent.target);
	}, true);

	// Elements added at runtime
	ample.bind("DOMNodeInserted", function(oEvent) {
		if (oEvent.target.parentNode instanceof cXULElement && oEvent.target.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
			fSchedule(oEvent.target.parentNode);
/*		else
		if (oEvent.target instanceof cXULElement && oEvent.target.viewType == cXULElement.VIEW_TYPE_BOXED)
			fSchedule(oEvent.target);*/
	});

	ample.bind("resize", function(oEvent) {
		var oElement	= oEvent.target;
		if (oEvent instanceof AMLResizeEvent) {
			if (oElement instanceof cXULWindowElement)
				fSchedule(oElement);
		}
		else {
			oElement	= this.querySelector("xul|page", function(){return cXULElement.prototype.namespaceURI});
			if (oElement)
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
/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// nsIDOMEventTarget
var cEventTarget	= function(){};

cEventTarget.prototype.$listeners	= null;

function fEventTarget_routeEvent(oTarget, oEvent) {
	var aTargets	= [],
		nLength		= 0,
		nCurrent	= 0,
		nDisabled	=-1,
		bUIEvent		= oEvent instanceof cUIEvent,
		bMutationEvent	= oEvent instanceof cMutationEvent;

	// Populate stack targets (...document-fragment, document, #document)
	for (var oNode = oTarget, oContext = oTarget; oNode; oNode = oNode.parentNode) {
		if (oNode.nodeType == 11 /* cNode.DOCUMENT_FRAGMENT_NODE */) {
			if (bMutationEvent)
				break;	// do not propagate Mutation Events higher than owner
		}
		else
		if (bUIEvent && oNode.nodeType == 1 /* cNode.ELEMENT_NODE */ && !oNode.$isAccessible())
			nDisabled	= nLength;
		aTargets[nLength++]	= [oNode, oContext];
		//
		if (oNode.nodeType == 11 /* cNode.DOCUMENT_FRAGMENT_NODE */)
			oContext	= oNode.parentNode;
	}

	// Propagate event
	while (!oEvent._stopped) {
		switch (oEvent.eventPhase) {
			case 1 /* cEvent.CAPTURING_PHASE */:
				if (--nCurrent > 0) {
					oEvent.currentTarget	= aTargets[nCurrent][0];
					oEvent.target			= aTargets[nCurrent][1];
				}
				else {
					oEvent.eventPhase		= 2 /* cEvent.AT_TARGET */;
					oEvent.currentTarget	=
					oEvent.target			= aTargets[nCurrent][1];
					// Special case: handling capture-phase events on target
					fEventTarget_handleCaptureOnTargetEvent(oTarget, oEvent);
					// Do not handle target if there is disabled element
					if (nDisabled >-1)
						continue;
				}
				break;

			case 2 /* cEvent.AT_TARGET */:
				// if event does not bubble, return
				if (!oEvent.bubbles)
					return;
				// if event current target doesn't have a parent
				if (nCurrent < 0)
					return;
				oEvent.eventPhase	= 3 /* cEvent.BUBBLING_PHASE */;
				// Do not handle bubbling between target and disabled element
				if (nDisabled >-1)
					nCurrent	= nDisabled;
				// No break left intentionally
			case 3 /* cEvent.BUBBLING_PHASE */:
				if (++nCurrent < nLength) {
					oEvent.currentTarget	= aTargets[nCurrent][0];
					oEvent.target			= aTargets[nCurrent][1];
				}
				else
					return;
				break;

			default:
				// Set current target
				if (nLength > 1) {
					nCurrent	= nLength - 1;
					oEvent.eventPhase		= 1 /* cEvent.CAPTURING_PHASE */;
					oEvent.currentTarget	= aTargets[nCurrent][0];
					oEvent.target			= aTargets[nCurrent][1];
				}
				else {
					nCurrent	= 0;
					oEvent.eventPhase		= 2 /* cEvent.AT_TARGET */;
					oEvent.currentTarget	=
					oEvent.target			= oTarget;
					// Special case: handling capture-phase events on target
					fEventTarget_handleCaptureOnTargetEvent(oTarget, oEvent);
				}
		}

//->Source
//console.log(oEvent.currentTarget);
//<-Source

//->Source
//		if (oEvent.type == "keydown")
//			console.log(oEvent.eventPhase, oEvent.target.tagName, oEvent.currentTarget.tagName);
//<-Source

		// Handle event
		fEventTarget_handleEvent(oEvent.currentTarget, oEvent);
	}
};

function fEventTarget_handleEvent(oNode, oEvent) {
	var sType	= oEvent.type,
		hListeners	= oNode.$listeners;

	// Process inline handler
	if (oEvent.eventPhase != 1 /* cEvent.CAPTURING_PHASE */ && oNode['on' + sType])
		fEventTarget_executeHandler(oNode, oNode['on' + sType], oEvent);

	// Notify listeners
	if (hListeners && hListeners[sType])
		for (var nIndex = 0, aListeners = hListeners[sType]; nIndex < aListeners.length && !oEvent._stoppedImmediately; nIndex++)
			if (aListeners[nIndex][1] == (oEvent.eventPhase == 1 /* cEvent.CAPTURING_PHASE */))
				fEventTarget_executeHandler(oNode, aListeners[nIndex][0], oEvent);

	// Event default actions implementation
	if (oEvent.eventPhase != 1 /* cEvent.CAPTURING_PHASE */ && !oEvent.defaultPrevented)
		if (oNode.nodeType == 1 || oNode.nodeType == 2 || oNode.nodeType == 7) {
			var fConstructor	= hClasses[oNode.nodeType != 7 ? (oNode.namespaceURI + '#' + (oNode.nodeType == 1 ? '' : '@') + oNode.localName): '?' + oNode.nodeName];
			if (fConstructor && fConstructor.handlers && fConstructor.handlers[sType])
				fConstructor.handlers[sType].call(oNode, oEvent);
		}
};

function fEventTarget_handleCaptureOnTargetEvent(oNode, oEvent) {
	var sType	= oEvent.type,
		hListeners	= oNode.$listeners;
	//
	if (hListeners && hListeners[sType])
		for (var nIndex = 0, aListeners = hListeners[sType]; nIndex < aListeners.length && !oEvent._stoppedImmediately; nIndex++)
			if (aListeners[nIndex][1] == true)
				fEventTarget_executeHandler(oNode, aListeners[nIndex][0], oEvent);
};

function fEventTarget_executeHandler(oNode, fHandler, oEvent) {
	try {
		var bValue	= true;
		if (typeof fHandler == "function")
			bValue	= fHandler.call(oNode, oEvent);
		else
		if (typeof fHandler.handleEvent == "function")
			bValue	= fHandler.handleEvent(oEvent);
//->Guard
		else
			throw new cAmpleException(cAmpleException.MEMBER_MISSING_ERR
	//->Debug
					, null
					, ["handleEvent"]
	//<-Debug
			);
//<-Guard
		// Emulate preventDefault call if handler returned false
		if (bValue === false)
			oEvent.preventDefault();
	}
	catch (oException) {
		if ((oException instanceof cDOMException) || (oException instanceof cAmpleException)) {
			var fErrorHandler	= oDOMConfiguration_values["error-handler"];
			if (fErrorHandler) {
				var oError	= new cDOMError(oException.message, cDOMError.SEVERITY_ERROR, oException);
				if (typeof fErrorHandler == "function")
					fErrorHandler(oError);
				else
				if (typeof fErrorHandler.handleError == "function")
					fErrorHandler.handleError(oError);
//->Guard
				else
					throw new cAmpleException(cAmpleException.MEMBER_MISSING_ERR
	//->Debug
							, null
							, ["handleError"]
	//<-Debug
					);
//<-Guard
			}
		}
		throw oException;
	}
};

//
function fEventTarget_addEventListener(oNode, sType, fHandler, bUseCapture) {
	var hListeners	= oNode.$listeners;
	if (!hListeners)
		hListeners	= oNode.$listeners	= {};
	if (!hListeners[sType])
		hListeners[sType]	= [];
	for (var nIndex = 0, aListeners = hListeners[sType], bCapture = bUseCapture == true; nIndex < aListeners.length; nIndex++)
		if (aListeners[nIndex][0] == fHandler && aListeners[nIndex][1] == bCapture)
			return;
	hListeners[sType].push([fHandler, bCapture]);
};

cEventTarget.prototype.addEventListener	= function(sType, fHandler, bUseCapture) {
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["listener",	cObject],
		["useCapture",	cBoolean,	true]
	], this);
//<-Guard

	fEventTarget_addEventListener(this, sType, fHandler, bUseCapture);
};

function fEventTarget_removeEventListener(oNode, sType, fHandler, bUseCapture) {
	var hListeners	= oNode.$listeners;
	if (hListeners && hListeners[sType])
		for (var nIndex = 0, aListeners = hListeners[sType], bCapture = bUseCapture == true; nIndex < aListeners.length; nIndex++)
			if (aListeners[nIndex][0] == fHandler && aListeners[nIndex][1] == bCapture) {
				hListeners[sType]	= aListeners.slice(0, nIndex).concat(aListeners.slice(nIndex + 1));
				if (!hListeners[sType].length)
					delete hListeners[sType];
				return;
			}
};

cEventTarget.prototype.removeEventListener	= function(sType, fHandler, bUseCapture) {
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["listener",	cObject],
		["useCapture",	cBoolean,	true]
	], this);
//<-Guard

	fEventTarget_removeEventListener(this, sType, fHandler, bUseCapture);
};

function fEventTarget_dispatchEvent(oTarget, oEvent) {
	// Start event flow
	fEventTarget_routeEvent(oTarget, oEvent);
	// Release event
	oEvent.currentTarget	= null;
	oEvent.eventPhase		= 0 /* cEvent.NONE */;

	return !oEvent.defaultPrevented;
};

cEventTarget.prototype.dispatchEvent	= function(oEvent) {
//->Guard
	fGuard(arguments, [
		["event",	cEvent]
	], this);
//<-Guard
	//
	if (oEvent.eventPhase != 0)
		throw new cDOMException(cDOMException.INVALID_STATE_ERR);

	return fEventTarget_dispatchEvent(this, oEvent);
};

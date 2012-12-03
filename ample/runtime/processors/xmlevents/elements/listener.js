/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXMLEventsElement_listener	= function(){};
cXMLEventsElement_listener.prototype	= new cXMLEventsElement("listener");

// Class Event Handlers
cXMLEventsElement_listener.handlers	= {};
cXMLEventsElement_listener.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	var sValue	= fElement_getAttribute(this, "handler") || '';
	fEventTarget_addEventListener(this.parentNode,
		fElement_getAttribute(this, "event"),
		cFunction("event",	(fElement_getAttribute(this, "propagate") == "stop" ? "event" + '.' + "stopPropagation" + '();' : '') +
							(fElement_getAttribute(this, "defaultAction") == "cancel" ? "event" + '.' + "preventDefault" + '();' : '') +
							(sValue.indexOf("javascript" + ':') == 0 ? sValue.substr(cString("javascript" + ':').length) : '')
					),
		fElement_getAttribute(this, "phase") == "capture"
	);
};

// Register Element
fAmple_extend(cXMLEventsElement_listener);
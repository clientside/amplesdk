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
	var sValue	= this.attributes["handler"] || '';
	fEventTarget_addEventListener(this.parentNode,
		this.attributes["event"],
		cFunction("event",	(this.attributes["propagate"] == "stop" ? "event" + '.' + "stopPropagation" + '();' : '') +
							(this.attributes["defaultAction"] == "cancel" ? "event" + '.' + "preventDefault" + '();' : '') +
							(sValue.indexOf("javascript" + ':') == 0 ? sValue.substr(cString("javascript" + ':').length) : '')
					),
		this.attributes["phase"] == "capture"
	);
};

// Register Element
fAmple_extend(cXMLEventsElement_listener);
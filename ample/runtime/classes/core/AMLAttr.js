/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLAttr	= function(){};

cAMLAttr.prototype	= new cAMLNode;
cAMLAttr.prototype.nodeType	= cAMLNode.ATTRIBUTE_NODE;

// nsIDOMAttribute
cAMLAttr.prototype.name			= null;
cAMLAttr.prototype.specified	= null;
cAMLAttr.prototype.value		= null;

cAMLAttr.prototype.ownerElement	= null;	// Introduced in DOM-Level-2

// Ample methods
cAMLAttr.prototype.$handleEvent	= function(oEvent)
{
//	cAMLNode.prototype.$handleEvent.call(this, oEvent);

	// Notify element event handlers
	var oNamespace,
		cAttribute;

	// Event default actions implementation
	if (oEvent.eventPhase != cAMLEvent.CAPTURING_PHASE && !oEvent.defaultPrevented)
		if ((oNamespace = oAML_namespaces[this.namespaceURI]) && (cAttribute = oNamespace.attributes[this.localName]))
			if (cAttribute.handlers && cAttribute.handlers[oEvent.type])
				cAttribute.handlers[oEvent.type].call(this, oEvent);
};

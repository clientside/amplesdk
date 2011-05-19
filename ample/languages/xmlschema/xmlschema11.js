/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXMLSchema11_implementation	= {},
	sXMLSchema11_namespaceURI	= "http://www.w3.org/2001/XMLSchema",
	oXMLSchema11_model			= new cXSModel,
	oXMLSchema11_processors		= {};

//sGUARD_MISSING_ATTRIBUTE_WRN		= 'Required attribute "%0" is missing from "%1" element. Element processing skipped',
//sGUARD_UNKNOWN_SIMPLE_TYPE_WRN	= 'Simple type definition "%0" not found',

oXMLSchema11_implementation.traverse	= function(oElementDOM, oNode) {
	if ((oElementDOM.localName || oElementDOM.baseName) == "schema") {
		var sNameSpaceURI	= oElementDOM.getAttribute("targetNamespace");
		if (sNameSpaceURI) {
			// Create new namespace item
			var oNamespaceItem	= new cXSNamespaceItem;
			oNamespaceItem.schemaNamespace	= sNameSpaceURI;
			// Register new namespace item
			oXMLSchema11_model.namespaces.$add(sNameSpaceURI);
			oXMLSchema11_model.namespaceItems.$add(oNamespaceItem);

			// traverse children
			fXMLSchema11_traverseChildren(oElementDOM, oXMLSchema11_processors["schema"], oNamespaceItem);
		}
//->Debug
		else
			fUtilities_warn(sGUARD_MISSING_ATTRIBUTE_WRN, ["targetNamespace", oElementDOM.tagName]);
//<-Debug
	}
//->Debug
	else
		fUtilities_warn(sGUARD_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.tagName, oElementDOM.namespaceURI]);
//<-Debug
};

oXMLSchema11_processors["schema"]	= {};
function fXMLSchema11_traverseChildren(oElementDOM, hProcessors, oParam) {
	for (var nIndex = 0, fProcessor, oElement; oElement = oElementDOM.childNodes[nIndex]; nIndex++)
		if (oElement.nodeType == 1 && oElement.namespaceURI == sXMLSchema11_namespaceURI)
			if (fProcessor = hProcessors[oElement.localName || oElement.baseName])
				fProcessor(oElement, oParam);
//->Debug
			else
				fUtilities_warn(sGUARD_UNKNOWN_ELEMENT_NS_WRN, [oElement.tagName, oElement.namespaceURI]);
//<-Debug
};

// Helper functions
function fXMLSchema11_lookupNamespaceURI(oNode, sPrefix) {
	for (; oNode && oNode.nodeType != cNode.DOCUMENT_NODE; oNode = oNode.parentNode)
		if (oNode.prefix == sPrefix)
			return oNode.namespaceURI;
		else
		if (oNode.nodeType == cNode.ELEMENT_NODE)
			for (var nIndex = 0, oAttribute; oAttribute = oNode.attributes[nIndex]; nIndex++)
				if (oAttribute.prefix == "xmlns" && oAttribute.name == sPrefix)
					return oAttribute.value;
	return null;
};

cXSTypeDefinition.prototype.$validate	= function(vValue) {
	switch (this.typeCategory) {
		case cXSTypeDefinition.SIMPLE_TYPE:
			// Validate arguments
			ample.guard(arguments, [
				["value",		cString]
			]);

			return fXMLSchema11_simpleType_validate(this, vValue);

		case cXSTypeDefinition.COMPLEX_TYPE:
			// Validate arguments
			ample.guard(arguments, [
				["value",		cNode]
			]);

			throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);

			//return fXMLSchema11_complexType_validate(this, vValue);
	}
	throw new cDOMException(cDOMException.NOT_FOUND_ERR);
};

// Publish
oAmple.$model	= oXMLSchema11_model;

// register processor
oDOMImplementation_processors[sXMLSchema11_namespaceURI]	= oXMLSchema11_implementation;

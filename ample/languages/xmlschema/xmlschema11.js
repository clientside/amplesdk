/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLXMLSchema11_implementation	= {},
	sAMLXMLSchema11_namespaceURI	= "http://www.w3.org/2001/XMLSchema",
	oAMLXMLSchema11_model			= new cXSModel,
	oAMLXMLSchema11_processors		= {};

//sAML_MISSING_ATTRIBUTE_WRN		= 'Required attribute "%0" is missing from "%1" element. Element processing skipped',
//sAML_UNKNOWN_SIMPLE_TYPE_WRN	= 'Simple type definition "%0" not found',

oAMLXMLSchema11_implementation.traverse	= function(oElementDOM, oNode) {
	if ((oElementDOM.localName || oElementDOM.baseName) == "schema") {
		var sNameSpaceURI	= oElementDOM.getAttribute("targetNamespace");
		if (sNameSpaceURI) {
			// Create new namespace item
			var oNamespaceItem	= new cXSNamespaceItem;
			oNamespaceItem.schemaNamespace	= sNameSpaceURI;
			// Register new namespace item
			oAMLXMLSchema11_model.namespaces.$add(sNameSpaceURI);
			oAMLXMLSchema11_model.namespaceItems.$add(oNamespaceItem);

			// traverse children
			fAMLXMLSchema11_traverseChildren(oElementDOM, oAMLXMLSchema11_processors["schema"], oNamespaceItem);
		}
//->Debug
		else
			fUtilities_warn(sAML_MISSING_ATTRIBUTE_WRN, ["targetNamespace", oElementDOM.tagName]);
//<-Debug
	}
//->Debug
	else
		fUtilities_warn(sAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.tagName, oElementDOM.namespaceURI]);
//<-Debug
};

oAMLXMLSchema11_processors["schema"]	= {};
function fAMLXMLSchema11_traverseChildren(oElementDOM, hProcessors, oParam) {
	for (var nIndex = 0, fProcessor, oElement; oElement = oElementDOM.childNodes[nIndex]; nIndex++)
		if (oElement.nodeType == 1 && oElement.namespaceURI == sAMLXMLSchema11_namespaceURI)
			if (fProcessor = hProcessors[oElement.localName || oElement.baseName])
				fProcessor(oElement, oParam);
//->Debug
			else
				fUtilities_warn(sAML_UNKNOWN_ELEMENT_NS_WRN, [oElement.tagName, oElement.namespaceURI]);
//<-Debug
};

// Helper functions
function fAMLXMLSchema11_lookupNamespaceURI(oNode, sPrefix) {
	for (; oNode && oNode.nodeType != cAMLNode.DOCUMENT_NODE; oNode = oNode.parentNode)
		if (oNode.prefix == sPrefix)
			return oNode.namespaceURI;
		else
		if (oNode.nodeType == cAMLNode.ELEMENT_NODE)
			for (var nIndex = 0, oAttribute; oAttribute = oNode.attributes[nIndex]; nIndex++)
				if (oAttribute.prefix == "xmlns" && oAttribute.name == sPrefix)
					return oAttribute.value;
	return null;
};

cXSTypeDefinition.prototype.$validate	= function(vValue) {
	switch (this.typeCategory) {
		case cXSTypeDefinition.SIMPLE_TYPE:
			// Validate arguments
			fGuard(arguments, [
				["value",		cString]
			]);

			return fAMLXMLSchema11_simpleType_validate(this, vValue);

		case cXSTypeDefinition.COMPLEX_TYPE:
			// Validate arguments
			fGuard(arguments, [
				["value",		cAMLNode]
			]);

			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);

			//return fAMLXMLSchema11_complexType_validate(this, vValue);
	}
	throw new cAMLException(cAMLException.NOT_FOUND_ERR);
};

// Publish
oAmple.$model	= oAMLXMLSchema11_model;

// register processor
oAMLImplementation_processors[sAMLXMLSchema11_namespaceURI]	= oAMLXMLSchema11_implementation;

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLSerializer	= function (){};

// Public Methods
cAMLSerializer.prototype.serializeToString	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "serializeToString");

	var aHtml	= [];
//->Source
	var nDepth	= 1;
//<-Source
	(function(oNode) {
		var nIndex = 0, sName, oAttributes;
//->Source
		aHtml.push(new cArray(nDepth).join('\t'));
//<-Source
		switch (oNode.nodeType) {
			case cAMLNode.ELEMENT_NODE:
				aHtml.push('<' + oNode.nodeName);
				oAttributes	= oNode.attributes;
				for (sName in oAttributes)
					if (oAttributes.hasOwnProperty(sName))
						aHtml.push(' ' + sName + '=' + '"' + fAML_encodeEntities(oAttributes[sName]) + '"');
	//			aHtml.push(' ' + '_' + '=' + '"' + oNode.uniqueID + '"');
				if (oNode.hasChildNodes()) {
					aHtml.push('>');
//->Source
					aHtml.push('\n');
					nDepth++;
//<-Source
					while (nIndex < oNode.childNodes.length)
						arguments.callee(oNode.childNodes[nIndex++]);
//->Source
					nDepth--;
					aHtml.push('\n');
					aHtml.push(new cArray(nDepth).join('\t'));
//<-Source
					aHtml.push('</' + oNode.nodeName + '>');
				}
				else
					aHtml.push('/>');
				break;

			case cAMLNode.TEXT_NODE:
				aHtml.push(oNode.nodeValue);
				break;

			case cAMLNode.CDATA_SECTION_NODE:
				aHtml.push('<![CDATA[' + oNode.nodeValue + ']]>');
				break;

			case cAMLNode.PROCESSING_INSTRUCTION_NODE:
				aHtml.push('<?' + oNode.nodeName + ' ' + oNode.nodeValue + '?>');
				break;

			case cAMLNode.COMMENT_NODE:
				aHtml.push('<!--' + oNode.nodeValue + '-->');
				break;

			case cAMLNode.DOCUMENT_FRAGMENT_NODE:
			case cAMLNode.DOCUMENT_NODE:
				while (nIndex < oNode.childNodes.length)
					arguments.callee(oNode.childNodes[nIndex++]);
				break;
/*
			case cAMLNode.NOTATION_NODE:
			case cAMLNode.DOCUMENT_TYPE_NODE:
			case cAMLNode.ENTITY_REFERENCE_NODE:
			case cAMLNode.ENTITY_NODE:
			case cAMLNode.ATTRIBUTE_NODE:
*/
			default:
				throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
		}
//->Source
		if (oNode.nextSibling)
			aHtml.push('\n');
//<-Source
	})(oNode);
	return aHtml.join('');
};

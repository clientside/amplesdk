/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

fEventTarget_addEventListener(oAmple_document, "localechange", function() {
	// Apply content attribute value
	var aElements	= this.querySelectorAll('[' + "aml" + '|' + "content" + ']', function(){return sNS_AML;});
	for (var nIndex = 0, oElement; oElement = aElements[nIndex]; nIndex++)
		fAMLAttr_content_map(oElement, fElement_getAttributeNS(oElement, sNS_AML, "content"));
	// Apply values attribute value
	var aElements	= this.querySelectorAll('[' + "aml" + '|' + "values" + ']', function(){return sNS_AML;});
	for (var nIndex = 0, oElement; oElement = aElements[nIndex]; nIndex++)
		fAMLAttr_values_map(oElement, fElement_getAttributeNS(oElement, sNS_AML, "values"));
}, false);
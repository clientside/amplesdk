/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// CSS Query driver
var nAMLSelector_iterator	= 0,
	rAMLSelector_comma 		= /\s*,\s*/;

function fAMLSelector_query(aFrom, sQuery, fResolver, bMatchOne)
{
    var aMatch	= new cAMLNodeList;
    if (sQuery = fAMLSelector_parseSelector(sQuery)) {
	    // process comma separated selectors
	    var aBase	= aFrom,
	    	aSelectors = sQuery.split(rAMLSelector_comma),
	    	nSelector,
	    	aSelector;
	    for (nSelector = 0; nSelector < aSelectors.length; nSelector++) {
	        // convert the selector to a stream
	        aSelector = fAMLSelector_toStream(aSelectors[nSelector]);
			aFrom = aBase;

	        // process the stream
	        var nIndex = 0, sToken, sFilter, sArguments, bBracketRounded, bBracketSquare;
	        while (nIndex < aSelector.length) {
	            sToken = aSelector[nIndex++];
	            sFilter = aSelector[nIndex++];
	            // some pseudo-classes allow arguments to be passed
	            //  e.g. nth-child(even)
	            sArguments = '';
	            bBracketRounded	= aSelector[nIndex] == '(';
	            bBracketSquare	= aSelector[nIndex-1] == '[';
	            if (bBracketRounded || bBracketSquare) {
	            	if (bBracketSquare)
	            		nIndex--;
	                while (aSelector[nIndex++] != (bBracketRounded ? ')' : ']') && nIndex < aSelector.length)
	                    sArguments += aSelector[nIndex];
	                sArguments = sArguments.slice(0, -1);
	            }
	            // process a token/filter pair use cached results if possible
	            if (sToken != '::')
	            	aFrom	= fAMLSelector_select(aFrom, sToken, sFilter, sArguments, fResolver);
				else {
					aFrom	= [];
//->Debug
					fUtilities_warn(sAML_QUERYING_PSEUDOELEMENT_WRN);
//<-Debug
				}
	        }
	        // Setting _cssIndex enables selection uniqueness
	        for (nIndex = 0; nIndex < aFrom.length; nIndex++) {
	        	if (aFrom[nIndex]._cssIndex != nAMLSelector_iterator) {
	        		aMatch[aMatch.length++]	= aFrom[nIndex];
					if (bMatchOne)
						return aMatch;
					//
	        		aFrom[nIndex]._cssIndex	= nAMLSelector_iterator;
	        	}
	        }
	    }

		// Remove temporarily set _cssIndex
		for (var nIndex = 0; nIndex < aMatch.length; nIndex++)
			delete aMatch[nIndex]._cssIndex;
		nAMLSelector_iterator++;
    }
    return aMatch;
};

var rAMLSelector_stream = /::|[\s#.:>+~()@\[\]]|[^\s#.:>+~()@\[\]]+/g,
	rAMLSelector_standardSelect = /^[^\s>+~]/;

function fAMLSelector_toStream(sSelector) {
    if (rAMLSelector_standardSelect.test(sSelector))
    	sSelector = ' ' + sSelector;
    return sSelector.match(rAMLSelector_stream) || [];
};

function fAMLSelector_select(aFrom, sToken, sFilter, sArguments, fResolver) {
	var aReturn = [];
    if (oAMLSelector_elementSelectors[sToken])
        oAMLSelector_elementSelectors[sToken](aReturn, aFrom, sFilter, sArguments, fResolver);
	else
		throw new cAMLException(cAMLException.AML_SELECTOR_ELEMENT_ERR, fAMLSelector_query.caller.caller
//->Debug
				, [sToken]
//<-Debug
		);
    return aReturn;
};

// -----------------------------------------------------------------------
// parsing
// -----------------------------------------------------------------------
var rAMLSelector_quotes	= /^('[^']*')|("[^"]*")$/;

function fAMLSelector_getText(sString) {
	return rAMLSelector_quotes.test(sString) ? sString.slice(1, -1) : sString;
};

function fAMLSelector_getNextSibling(oElement)
{
	while (oElement = oElement.nextSibling)
		if (oElement.nodeType == cAMLNode.ELEMENT_NODE)
			return oElement;
	return null;
};

function fAMLSelector_getPreviousSibling(oElement)
{
	while (oElement = oElement.previousSibling)
		if (oElement.nodeType == cAMLNode.ELEMENT_NODE)
			return oElement;
	return null;
};

function fAMLSelector_isElementNS(oElement, sQName, fResolver)
{
	if (fResolver) {
		var aQName		= sQName.split('|'),
			sLocalName	= aQName.pop(),
			sPrefix		= aQName.pop() || null;
		return (sLocalName == '*' || oElement.localName == sLocalName)
			&& (sPrefix == null || sPrefix == '*' || oElement.namespaceURI == fResolver(sPrefix));
	}

	return sQName == '*' || oElement.tagName == sQName.replace('|', ':');
};

var oAMLSelector_elementSelectors	= {},
	oAMLSelector_pseudoClasses		= {},
	oAMLSelector_attributeSelectors	= {};

// ----------------------------------------------------------------------------
// CSS1 selectors
// ----------------------------------------------------------------------------

var rAMLSelector_whiteSpace = /\s*([\s>+~(,]|^|$)\s*/g,
	rAMLSelector_impliedAll = /([\s>+~,]|[^(]\+|^)([#.:@])/g,
	rAMLSelector_attribute  = /([^(]|^)(\[[^\]]+)/g;
;

function fAMLSelector_parseSelector(sSelector) {
    return cString(sSelector)
	    // trim whitespace
	    .replace(rAMLSelector_whiteSpace, '$1')
	    // e.g "[a~=asd] --> @[a~=asd]
	    .replace(rAMLSelector_attribute, '$1@$2')
	    // e.g. ".class1" --> "*.class1"
	    .replace(rAMLSelector_impliedAll, '$1*$2');
};

// descendant selector
oAMLSelector_elementSelectors[' '] = function(aReturn, aFrom, sTagName, sArguments, fResolver) {
    // loop through current selection
    var oElement, nIndex, nIndexSubset, aSubset;
	var aQName		= sTagName.split('|'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null;

    for (nIndex = 0; oElement = aFrom[nIndex]; nIndex++) {
        // get descendants
        if (sPrefix == null)
        	aSubset	= fAMLElement_getElementsByTagName(oElement, sLocalName);
        else
        if (sPrefix == '*')
        	aSubset	= fAMLElement_getElementsByTagNameNS(oElement, '*', sLocalName);
        else
        if (fResolver)
        	aSubset = fAMLElement_getElementsByTagNameNS(oElement, fResolver(sPrefix), sLocalName);
        else
        	aSubset	= fAMLElement_getElementsByTagName(oElement, sTagName.replace('|', ':'));
        // loop through descendants and add to results selection
        for (nIndexSubset = 0; oElement = aSubset[nIndexSubset]; nIndexSubset++)
			aReturn.push(oElement);
    }
};

// ID selector
oAMLSelector_elementSelectors['#'] = function(aReturn, aFrom, sId) {
    // loop through current selection and check ID
    for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
    	if (fAMLElement_getAttribute(oElement, 'id') == sId)
    		aReturn.push(oElement);
};

// class selector
oAMLSelector_elementSelectors['.'] = function(aReturn, aFrom, sName) {
    // create a RegExp version of the class
    var rClass	= new cRegExp('(^|\\s)' + sName + '(\\s|$)');
    // loop through current selection and check class
    for (var nIndex = 0, oElement, sValue; oElement = aFrom[nIndex]; nIndex++)
    	if (sValue = fAMLElement_getAttribute(oElement, "class"))
        	if (rClass.test(sValue))
        		aReturn.push(oElement);
};

// pseudo-class selector
oAMLSelector_elementSelectors[':'] = function(aReturn, aFrom, sClass, sArguments) {
    // retrieve the cssQuery pseudo-class function
    // loop through current selection and apply pseudo-class filter
    var fSelector	= oAMLSelector_pseudoClasses[sClass] || cAMLNodeSelector.pseudoClass[sClass];
	if (!(fSelector instanceof cFunction)) {
		fSelector = fAMLSelector_pseudoClass;
		sArguments= sClass;
	}
	for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
    	// if the cssQuery pseudo-class function returns "true" add the element
    	if (fSelector(oElement, sArguments))
    		aReturn.push(oElement);
};

function fAMLSelector_pseudoClass(oElement, sClass) {
	if (oElement.nodeType == cAMLNode.ELEMENT_NODE) {
		var oElementDOM	= oElement.$getContainer();
		if (oElementDOM && (bTrident && nVersion < 8 ? oElementDOM.className : oElementDOM.getAttribute("class") || '').match(fAMLElement_getRegExp(sClass, '')))
			return true;
	}
	return false;
};

// pseudo-element selector
/*
oAMLSelector_elementSelectors['::'] = function(aReturn, aFrom, sPseudoElement) {
    for (var nIndex = 0, oElement, oElementDOM; oElement = aFrom[nIndex]; nIndex++)
    	if (oElementDOM = oElement.$getContainer(sPseudoElement))
    		aReturn.push(oElementDOM);
};
*/
// pseudo-class selectors
oAMLSelector_pseudoClasses["link"]	= function(oElement) {
	return false;
};

// ----------------------------------------------------------------------------
// CSS2 selectors
// ----------------------------------------------------------------------------

// child selector
oAMLSelector_elementSelectors['>'] = function(aReturn, aFrom, sTagName, sArguments, fResolver) {
    for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
        for (var nIndexSubset = 0, aSubset = oElement.childNodes; oElement = aSubset[nIndexSubset]; nIndexSubset++)
            if (fAMLSelector_isElementNS(oElement, sTagName, fResolver))
                aReturn.push(oElement);
};

// sibling selector
oAMLSelector_elementSelectors['+'] = function(aReturn, aFrom, sTagName, sArguments, fResolver) {
    for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
        if ((oElement = fAMLSelector_getNextSibling(oElement))&& fAMLSelector_isElementNS(oElement, sTagName, fResolver))
            aReturn.push(oElement);
};

var rAMLSelector_attributeSelector	= /(([\w-]+)(\|[\w-]+)?)\s*(\W?=)?\s*([^\]]*)/;

oAMLSelector_elementSelectors['@'] = function(aReturn, aFrom, sString, sArguments, fResolver) {
	var aMatch;
	if (aMatch = sArguments.match(rAMLSelector_attributeSelector)) {
		var sAttribute	= aMatch[1],
		sPrefix			= aMatch[3] ? aMatch[2] : null,
		sLocalName		= aMatch[3] ? aMatch[3].substr(1) : sAttribute,
		sNameSpaceURI	= null,
		sCompare		= aMatch[4] || '',
		sValue			= fAMLSelector_getText(aMatch[5]) || '',
		fCompare		= oAMLSelector_attributeSelectors[sCompare];

		if (fCompare) {
			if (sPrefix != null) {
				if (fResolver)
					sNameSpaceURI	= fResolver(sPrefix);
				else
					// Not nice looking... to be corrected later
					sLocalName	= sAttribute.replace('|',  ':');
			}
			for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
				if (fAMLElement_hazAttributeNS(oElement, sNameSpaceURI, sLocalName) && fCompare(fAMLElement_getAttributeNS(oElement, sNameSpaceURI, sLocalName), sValue))
					aReturn.push(oElement);
		}
		else
			throw new cAMLException(cAMLException.AML_SELECTOR_ATTRIBUTE_ERR, fAMLSelector_query.caller.caller
//->Debug
					, [sCompare]
//<-Debug
			);
	}
};

// -----------------------------------------------------------------------
// pseudo-classes
// -----------------------------------------------------------------------

oAMLSelector_pseudoClasses["first-child"] = function(oElement) {
	return fAMLSelector_getPreviousSibling(oElement) ? false : true;
};

oAMLSelector_pseudoClasses["lang"] = function(oElement, sCode) {
    var rValue = new cRegExp('^' + sCode, 'i');
    while (oElement && oElement.parentNode != oElement.ownerDocument && !fAMLElement_getAttribute(oElement, "xml:lang") && !fAMLElement_getAttribute(oElement, "lang"))
    	oElement = oElement.parentNode;
    return oElement && rValue.test(fAMLElement_getAttribute(oElement, "xml:lang") || fAMLElement_getAttribute(oElement, "lang"));
};

// -----------------------------------------------------------------------
//  attribute selectors
// -----------------------------------------------------------------------

var rAMLSelector_escape = /([\/()[\]?{}|*+-])/g;
function fAMLSelector_escape(sValue) {
	return sValue.replace(rAMLSelector_escape, '\\$1');
};

// -----------------------------------------------------------------------
//  attribute selector tests
// -----------------------------------------------------------------------
oAMLSelector_attributeSelectors = {};
oAMLSelector_attributeSelectors[''] = function(sAttribute) {
	return true;
};

oAMLSelector_attributeSelectors['='] = function(sAttribute, sValue) {
	return sAttribute == sValue;
};

oAMLSelector_attributeSelectors['~='] = function(sAttribute, sValue) {
	var rValue	= new cRegExp('(^| )' + fAMLSelector_escape(sValue) + '( |$)');
	return rValue.test(sAttribute);
};

oAMLSelector_attributeSelectors['|='] = function(sAttribute, sValue) {
	var rValue	= new cRegExp('(^|-)' + fAMLSelector_escape(sValue) + '(-|$)');
	return rValue.test(sAttribute);
};

oAMLSelector_attributeSelectors['!='] = function(sAttribute, sValue) {
	return sAttribute != sValue;
};

// ----------------------------------------------------------------------------
// CSS3 selectors
// ----------------------------------------------------------------------------

// -----------------------------------------------------------------------
// selectors
// -----------------------------------------------------------------------

// indirect sibling selector
oAMLSelector_elementSelectors['~'] = function(aReturn, aFrom, sTagName, sArguments, fResolver) {
	for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
		while (oElement = oElement.nextSibling)
			if (oElement.nodeType == cAMLNode.ELEMENT_NODE && fAMLSelector_isElementNS(oElement, sTagName, fResolver))
				aReturn.push(oElement);
};

// -----------------------------------------------------------------------
// pseudo-classes
// -----------------------------------------------------------------------
oAMLSelector_pseudoClasses["contains"] = function(oElement, sText) {
	return fAMLSelector_getText(sText).indexOf(fAMLNode_getTextContent(oElement)) !=-1;
};

oAMLSelector_pseudoClasses["root"] = function(oElement) {
	return oElement == oElement.ownerDocument.documentElement;
};

oAMLSelector_pseudoClasses["empty"] = function(oElement) {
	return !oElement.hasChildNodes();
};

oAMLSelector_pseudoClasses["last-child"] = function(oElement) {
	return fAMLSelector_getNextSibling(oElement) ? false : true;
};

oAMLSelector_pseudoClasses["only-child"] = function(oElement) {
	for (var nIndex = 0, oNode; oNode = oElement.parentNode.childNodes[nIndex]; nIndex++)
		if (oNode.nodeType == cAMLNode.ELEMENT_NODE && oNode != oElement)
			return false;
	return true;
};

oAMLSelector_pseudoClasses["not"] = function(oElement, sSelector) {
	for (var nIndex = 0, aNegated = fAMLSelector_query([oElement.ownerDocument], sSelector); nIndex < aNegated.length; nIndex++)
		if (aNegated[nIndex] == oElement)
			return false;
	return true;
};

oAMLSelector_pseudoClasses["nth-child"] = function(oElement, sArguments) {
	return fAMLSelector_nthChild(oElement, sArguments, true);
};

oAMLSelector_pseudoClasses["nth-last-child"] = function(oElement, sArguments) {
	return fAMLSelector_nthChild(oElement, sArguments);
};

oAMLSelector_pseudoClasses["target"] = function(oElement) {
	return fAMLElement_hazAttribute(oElement, 'id') && fAMLElement_getAttribute(oElement, 'id') == oUALocation.hash.slice(1);
};

// -----------------------------------------------------------------------
//  attribute selector tests
// -----------------------------------------------------------------------
oAMLSelector_attributeSelectors['^='] = function(sAttribute, sValue) {
	return sAttribute.indexOf(sValue) == 0;
};

oAMLSelector_attributeSelectors['$='] = function(sAttribute, sValue) {
	return sAttribute.indexOf(sValue) == sAttribute.length - sValue.length;
};

oAMLSelector_attributeSelectors['*='] = function(sAttribute, sValue) {
	return sAttribute.indexOf(sValue) !=-1;
};

// -----------------------------------------------------------------------
//  nth child support
// -----------------------------------------------------------------------
function fAMLSelector_nthChild(oElement, sArguments, bTraverse) {
	switch (sArguments) {
		case 'n':		return true;
		case "even":	sArguments = '2n'; break;
		case "odd":		sArguments = '2n+1';
	}

	var aElements = oElement.parentNode.childNodes,
		aChildren = [];

	for (var nIndex = 0; nIndex < aElements.length; nIndex++)
		if (aElements[nIndex].nodeType == cAMLNode.ELEMENT_NODE)
			aChildren.push(aElements[nIndex]);

	function fCheckIndex(nIndex) {
		return aChildren[bTraverse ? nIndex - 1 : aChildren.length - nIndex] == oElement;
	};

	//	it was just a number (no "n")
	if (!fIsNaN(sArguments))
		return fCheckIndex(sArguments);

	var aArguments	= sArguments.split('n'),
		nMultiplier	= aArguments[0] * 1,
		nStep		= aArguments[1] * 1;

	if ((fIsNaN(nMultiplier) || nMultiplier == 1) && nStep == 0)
		return true;
	if (nMultiplier == 0 && !fIsNaN(nStep))
		return fCheckIndex(nStep);
	if (fIsNaN(nStep))
		nStep = 0;

	var nCount = 1;
	while (oElement = (bTraverse ? oElement.previousSibling : oElement.nextSibling))
		if (oElement.nodeType == cAMLNode.ELEMENT_NODE)
			nCount++;

	if (fIsNaN(nMultiplier) || nMultiplier == 1)
		return bTraverse ? nStep >= nCount : nCount <= nStep;

	return nCount % nMultiplier == nStep;
};

var cAMLNodeSelector	= function(){};

cAMLNodeSelector.pseudoClass	= {};

// Attaching to implementation
cAMLElement.prototype.querySelector			=
cAMLDocument.prototype.querySelector		=
cAMLNodeSelector.prototype.querySelector	= function(sCSS, fResolver)
{
	// Validate arguments
	fGuard(arguments, [
		["query",		cString],
		["resolver",	cFunction, true]
	], this);

	var aNodeList	= fAMLSelector_query([this], sCSS, fResolver, true);
	return aNodeList.length ? aNodeList[0] : null;
};

cAMLElement.prototype.querySelectorAll		=
cAMLDocument.prototype.querySelectorAll		=
cAMLNodeSelector.prototype.querySelectorAll	= function(sCSS, fResolver)
{
	// Validate arguments
	fGuard(arguments, [
		["query",		cString],
		["resolver",	cFunction, true]
	], this);

	return fAMLSelector_query([this], sCSS, fResolver);
};

// UI element states
cAMLNodeSelector.pseudoClass["checked"]	= function(oElement) {
	return fAMLElement_hazAttribute(oElement, "checked") && fAMLElement_getAttribute(oElement, "checked") == "true";
};

cAMLNodeSelector.pseudoClass["enabled"]	= function(oElement) {
	return !fAMLElement_hazAttribute(oElement, "disabled") || fAMLElement_getAttribute(oElement, "disabled") != "true";
};

cAMLNodeSelector.pseudoClass["disabled"]	= function(oElement) {
	return fAMLElement_hazAttribute(oElement, "disabled") && fAMLElement_getAttribute(oElement, "disabled") == "true";
};

cAMLNodeSelector.pseudoClass["indeterminate"]	= function(oElement) {
	return oElement.indeterminate;
};

// jQuery Visibility Filter
cAMLNodeSelector.pseudoClass["hidden"]	= function(oElement) {
	return !fAMLFocus_isVisible(oElement);
};

cAMLNodeSelector.pseudoClass["visible"]	= function(oElement) {
	return fAMLFocus_isVisible(oElement);
};

// Other Selector
cAMLNodeSelector.pseudoClass["animated"]= function(oElement) {
	return oElement.$animations && oElement.$animations.length;
};

cAMLNodeSelector.pseudoClass["load"]	= function(oElement) {
	return oElement.$requests && oElement.$requests.length;
};
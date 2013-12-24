/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// CSS Query driver
var nNodeSelector_iterator	= 0,
	rNodeSelector_comma		= /\s*,\s*/;

function fNodeSelector_query(aBase, sQuery, fResolver, bMatchOne) {
	// process comma separated selectors
	var aMatch	= new cNodeList,
		aFrom,
		oElement,
		aSelectors	= sQuery.split(rNodeSelector_comma),
		sSelector,
		nSelector,
		aSelector;

	for (nSelector = 0; nSelector < aSelectors.length; nSelector++) {
		if (sSelector = fNodeSelector_parseSelector(aSelectors[nSelector])) {
			// Optimization for #id (if query context is ample document and element is found by id)
			if (sSelector.match(/^\s*\*#([-_a-z0-9]+)$/) && (aBase.length == 1 && aBase[0] == oAmple_document) && (oElement = oDocument_ids[cRegExp.$1]))
				aFrom	= [oElement];
			else {
				aFrom	= aBase;

				// convert the selector to a stream
				aSelector	= fNodeSelector_toStream(sSelector);

				// process the stream
				var nIndex	= 0, sToken, sFilter, sArguments, bBracketRounded, bBracketSquare;
				while ((nIndex < aSelector.length) && aFrom.length) {
					sToken	= aSelector[nIndex++];
					sFilter	= aSelector[nIndex++];
					// some pseudo-classes allow arguments to be passed
					//  e.g. nth-child(even)
					sArguments	= '';
					bBracketRounded	= aSelector[nIndex] == '(';
					bBracketSquare	= aSelector[nIndex-1] == '[';
					if (bBracketRounded || bBracketSquare) {
						if (bBracketSquare)
							nIndex--;
						while (aSelector[nIndex++] != (bBracketRounded ? ')' : ']') && nIndex < aSelector.length)
							sArguments += aSelector[nIndex];
						sArguments	= sArguments.slice(0, -1);
					}
					if (typeof sFilter == "undefined")
						throw new cDOMException(cDOMException.SYNTAX_ERR
//->Debug
								, fNodeSelector_query.caller.caller
								, [sQuery]
//<-Debug
						);
					// process a token/filter pair use cached results if possible
					aFrom	= fNodeSelector_select(aFrom, sToken, sFilter, sArguments, fResolver);
				}
			}
			// Setting _cssIndex enables selection uniqueness
			for (nIndex = 0; nIndex < aFrom.length; nIndex++) {
				if (aFrom[nIndex]._cssIndex != nNodeSelector_iterator) {
					aMatch[aMatch.length++]	= aFrom[nIndex];
					if (bMatchOne)
						return aMatch;
					//
					aFrom[nIndex]._cssIndex	= nNodeSelector_iterator;
				}
			}
		}
		else
			throw new cDOMException(cDOMException.SYNTAX_ERR
//->Debug
					, fNodeSelector_query.caller.caller
					, [sQuery]
//<-Debug
			);
	}

	// Remove temporarily set _cssIndex
	for (var nIndex = 0; nIndex < aMatch.length; nIndex++)
		delete aMatch[nIndex]._cssIndex;

	// Increase iterator value
	nNodeSelector_iterator++;

	return aMatch;
};

var rNodeSelector_stream	= /::|[\s#.:>+~()@\[\]]|[^\s#.:>+~()@\[\]]+/g,
	rNodeSelector_standardSelect	= /^[^\s>+~]/;

function fNodeSelector_toStream(sSelector) {
	if (rNodeSelector_standardSelect.test(sSelector))
		sSelector	= ' ' + sSelector;
	return sSelector.match(rNodeSelector_stream) || [];
};

function fNodeSelector_select(aFrom, sToken, sFilter, sArguments, fResolver) {
	var aReturn	= [];
	if (oNodeSelector_elementSelectors[sToken])
		oNodeSelector_elementSelectors[sToken](aReturn, aFrom, sFilter, sArguments, fResolver);
	else
		throw new cDOMException(cDOMException.SYNTAX_ERR
//->Debug
				, fNodeSelector_query.caller.caller
				, [sToken]
//<-Debug
		);
	return aReturn;
};

// -----------------------------------------------------------------------
// parsing
// -----------------------------------------------------------------------
var rNodeSelector_quotes	= /^('[^']*')|("[^"]*")$/;

function fNodeSelector_getText(sString) {
	return rNodeSelector_quotes.test(sString) ? sString.slice(1, -1) : sString;
};

function fNodeSelector_getNextSibling(oElement) {
	while (oElement = oElement.nextSibling)
		if (oElement.nodeType == 1)	// cNode.ELEMENT_NODE
			return oElement;
	return null;
};

function fNodeSelector_getPreviousSibling(oElement) {
	while (oElement = oElement.previousSibling)
		if (oElement.nodeType == 1)	// cNode.ELEMENT_NODE
			return oElement;
	return null;
};

function fNodeSelector_isElementNS(oElement, sQName, fResolver) {
	if (fResolver) {
		var aQName		= sQName.split('|'),
			sLocalName	= aQName.pop(),
			sPrefix		= aQName.pop() || null;
		return (sLocalName == '*' || oElement.localName == sLocalName)
			&& (sPrefix == null || sPrefix == '*' || oElement.namespaceURI == fResolver(sPrefix));
	}

	return sQName == '*' || oElement.tagName == sQName.replace('|', ':');
};

var oNodeSelector_elementSelectors	= {},
	oNodeSelector_pseudoClasses		= {},
	oNodeSelector_attributeSelectors	= {};

// ----------------------------------------------------------------------------
// CSS1 selectors
// ----------------------------------------------------------------------------

var rNodeSelector_whiteSpace	= /\s*([\s>+~(]|^|$)\s*/g,
	rNodeSelector_impliedAll	= /([\s>+~]|[^(]\+|^)([#.:@])/g,
	rNodeSelector_attribute		= /([^(]|^)(\[[^\]]+)/g;

function fNodeSelector_parseSelector(sSelector) {
	return cString(sSelector)
		// trim whitespace
		.replace(rNodeSelector_whiteSpace, '$1')
		// e.g "[a~=asd] --> @[a~=asd]
		.replace(rNodeSelector_attribute, '$1@$2')
		// e.g. ".class1" --> "*.class1"
		.replace(rNodeSelector_impliedAll, '$1*$2');
};

// descendant selector
oNodeSelector_elementSelectors[' ']	= function(aReturn, aFrom, sTagName, sArguments, fResolver) {
	// loop through current selection
	var oElement, nIndex, nIndexSubset, aSubset;
	var aQName		= sTagName.split('|'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null;

	for (nIndex = 0; oElement = aFrom[nIndex]; nIndex++) {
		// get descendants
		if (sPrefix == null)
			aSubset	= fElement_getElementsByTagName(oElement, sLocalName);
		else
		if (sPrefix == '*')
			aSubset	= fElement_getElementsByTagNameNS(oElement, '*', sLocalName);
		else
		if (fResolver)
			aSubset	= fElement_getElementsByTagNameNS(oElement, fResolver(sPrefix), sLocalName);
		else
			aSubset	= fElement_getElementsByTagName(oElement, sTagName.replace('|', ':'));
		// loop through descendants and add to results selection
		for (nIndexSubset = 0; oElement = aSubset[nIndexSubset]; nIndexSubset++)
			aReturn.push(oElement);
	}
};

// ID selector
oNodeSelector_elementSelectors['#']	= function(aReturn, aFrom, sId) {
	// loop through current selection and check ID
	for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
		if (fElement_getAttribute(oElement, 'id') == sId)
			aReturn.push(oElement);
};

// class selector
oNodeSelector_elementSelectors['.']	= function(aReturn, aFrom, sName) {
	// create a RegExp version of the class
	var rClass	= new cRegExp('(^|\\s)' + sName + '(\\s|$)');
	// loop through current selection and check class
	for (var nIndex = 0, oElement, sValue; oElement = aFrom[nIndex]; nIndex++)
		if (sValue = fElement_getAttribute(oElement, "class"))
			if (rClass.test(sValue))
				aReturn.push(oElement);
};

// pseudo-class selector
oNodeSelector_elementSelectors[':']	= function(aReturn, aFrom, sClass, sArguments) {
	// retrieve the cssQuery pseudo-class function
	// loop through current selection and apply pseudo-class filter
	var fSelector	= oNodeSelector_pseudoClasses[sClass] || cNodeSelector.pseudoClass[sClass];
	if (!(fSelector instanceof cFunction)) {
		fSelector = fNodeSelector_pseudoClass;
		sArguments= sClass;
	}
	for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
		// if the cssQuery pseudo-class function returns "true" add the element
		if (fSelector(oElement, sArguments))
			aReturn.push(oElement);
};

function fNodeSelector_pseudoClass(oElement, sClass) {
	if (oElement.nodeType == 1) {	// cNode.ELEMENT_NODE
		var oElementDOM	= oElement.$getContainer();
		if (oElementDOM && (bTrident && nVersion < 8 ? oElementDOM.className : oElementDOM.getAttribute("class") || '').match(fElement_getRegExp(sClass)))
			return true;
	}
	return false;
};

// pseudo-element selector
oNodeSelector_elementSelectors['::']	= function(aReturn, aFrom, sPseudoElement) {
//->Debug
	fUtilities_warn(sGUARD_QUERYING_PSEUDOELEMENT_WRN);
//<-Debug
/*
	for (var nIndex = 0, oElement, oElementDOM; oElement = aFrom[nIndex]; nIndex++)
		if (oElementDOM = oElement.$getContainer(sPseudoElement))
			aReturn.push(oElementDOM);
*/
};

// pseudo-class selectors
oNodeSelector_pseudoClasses["link"]	= function(oElement) {
	return false;
};

// ----------------------------------------------------------------------------
// CSS2 selectors
// ----------------------------------------------------------------------------

// child selector
oNodeSelector_elementSelectors['>']	= function(aReturn, aFrom, sTagName, sArguments, fResolver) {
	for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
		for (var nIndexSubset = 0, aSubset = oElement.childNodes; oElement = aSubset[nIndexSubset]; nIndexSubset++)
			if (fNodeSelector_isElementNS(oElement, sTagName, fResolver))
				aReturn.push(oElement);
};

// sibling selector
oNodeSelector_elementSelectors['+']	= function(aReturn, aFrom, sTagName, sArguments, fResolver) {
	for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
		if ((oElement = fNodeSelector_getNextSibling(oElement))&& fNodeSelector_isElementNS(oElement, sTagName, fResolver))
			aReturn.push(oElement);
};

var rNodeSelector_attributeSelector	= /(([\w-]+)(\|[\w-]+)?)\s*(\W?=)?\s*([^\]]*)/;

oNodeSelector_elementSelectors['@']	= function(aReturn, aFrom, sString, sArguments, fResolver) {
	var aMatch;
	if (aMatch = sArguments.match(rNodeSelector_attributeSelector)) {
		var sAttribute	= aMatch[1],
		sPrefix			= aMatch[3] ? aMatch[2] : null,
		sLocalName		= aMatch[3] ? aMatch[3].substr(1) : sAttribute,
		sNameSpaceURI	= null,
		sCompare		= aMatch[4] || '',
		sValue			= fNodeSelector_getText(aMatch[5]) || '',
		fCompare		= oNodeSelector_attributeSelectors[sCompare];

		if (fCompare) {
			if (sPrefix != null) {
				if (fResolver)
					sNameSpaceURI	= fResolver(sPrefix);
				else
					// Not nice looking... to be corrected later
					sLocalName	= sAttribute.replace('|', ':');
			}
			for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
				if (fElement_hazAttributeNS(oElement, sNameSpaceURI, sLocalName) && fCompare(fElement_getAttributeNS(oElement, sNameSpaceURI, sLocalName), sValue))
					aReturn.push(oElement);
		}
		else
			throw new cDOMException(cDOMException.SYNTAX_ERR
//->Debug
					, fNodeSelector_query.caller.caller
					, [sCompare]
//<-Debug
			);
	}
};

// -----------------------------------------------------------------------
// pseudo-classes
// -----------------------------------------------------------------------

oNodeSelector_pseudoClasses["first-child"]	= function(oElement) {
	return fNodeSelector_getPreviousSibling(oElement) ? false : true;
};

oNodeSelector_pseudoClasses["lang"]	= function(oElement, sCode) {
	var rValue	= new cRegExp('^' + sCode, 'i');
	while (oElement && oElement.parentNode != oElement.ownerDocument && !fElement_getAttribute(oElement, "xml:lang") && !fElement_getAttribute(oElement, "lang"))
		oElement	= oElement.parentNode;
	return oElement && rValue.test(fElement_getAttribute(oElement, "xml:lang") || fElement_getAttribute(oElement, "lang"));
};

// -----------------------------------------------------------------------
//  attribute selectors
// -----------------------------------------------------------------------

var rNodeSelector_escape	= /([\/()[\]?{}|*+-])/g;
function fNodeSelector_escape(sValue) {
	return sValue.replace(rNodeSelector_escape, '\\$1');
};

// -----------------------------------------------------------------------
//  attribute selector tests
// -----------------------------------------------------------------------
oNodeSelector_attributeSelectors	= {};
oNodeSelector_attributeSelectors['']	= function(sAttribute) {
	return true;
};

oNodeSelector_attributeSelectors['=']	= function(sAttribute, sValue) {
	return sAttribute == sValue;
};

oNodeSelector_attributeSelectors['~=']	= function(sAttribute, sValue) {
	var rValue	= new cRegExp('(^| )' + fNodeSelector_escape(sValue) + '( |$)');
	return rValue.test(sAttribute);
};

oNodeSelector_attributeSelectors['|=']	= function(sAttribute, sValue) {
	var rValue	= new cRegExp('(^|-)' + fNodeSelector_escape(sValue) + '(-|$)');
	return rValue.test(sAttribute);
};

oNodeSelector_attributeSelectors['!=']	= function(sAttribute, sValue) {
	return sAttribute != sValue;
};

// ----------------------------------------------------------------------------
// CSS3 selectors
// ----------------------------------------------------------------------------

// -----------------------------------------------------------------------
// selectors
// -----------------------------------------------------------------------

// indirect sibling selector
oNodeSelector_elementSelectors['~']	= function(aReturn, aFrom, sTagName, sArguments, fResolver) {
	for (var nIndex = 0, oElement; oElement = aFrom[nIndex]; nIndex++)
		while (oElement = oElement.nextSibling)
			if (oElement.nodeType == 1 /* cNode.ELEMENT_NODE */ && fNodeSelector_isElementNS(oElement, sTagName, fResolver))
				aReturn.push(oElement);
};

// -----------------------------------------------------------------------
// pseudo-classes
// -----------------------------------------------------------------------
oNodeSelector_pseudoClasses["contains"]	= function(oElement, sText) {
	return fNodeSelector_getText(sText).indexOf(fNode_getTextContent(oElement)) !=-1;
};

oNodeSelector_pseudoClasses["root"]	= function(oElement) {
	return oElement == oElement.ownerDocument.documentElement;
};

oNodeSelector_pseudoClasses["empty"]	= function(oElement) {
	return !oElement.hasChildNodes();
};

oNodeSelector_pseudoClasses["last-child"]	= function(oElement) {
	return fNodeSelector_getNextSibling(oElement) ? false : true;
};

oNodeSelector_pseudoClasses["only-child"]	= function(oElement) {
	for (var nIndex = 0, oNode; oNode = oElement.parentNode.childNodes[nIndex]; nIndex++)
		if (oNode.nodeType == 1 /* cNode.ELEMENT_NODE */ && oNode != oElement)
			return false;
	return true;
};

oNodeSelector_pseudoClasses["not"]	= function(oElement, sSelector) {
	for (var nIndex = 0, aNegated = fNodeSelector_query([oElement.ownerDocument], sSelector); nIndex < aNegated.length; nIndex++)
		if (aNegated[nIndex] == oElement)
			return false;
	return true;
};

oNodeSelector_pseudoClasses["nth-child"]	= function(oElement, sArguments) {
	return fNodeSelector_nthChild(oElement, sArguments, true);
};

oNodeSelector_pseudoClasses["nth-last-child"]	= function(oElement, sArguments) {
	return fNodeSelector_nthChild(oElement, sArguments);
};

oNodeSelector_pseudoClasses["target"]	= function(oElement) {
	return fElement_hazAttribute(oElement, 'id') && fElement_getAttribute(oElement, 'id') == oUALocation.hash.slice(1);
};

// -----------------------------------------------------------------------
//  attribute selector tests
// -----------------------------------------------------------------------
oNodeSelector_attributeSelectors['^=']	= function(sAttribute, sValue) {
	return sAttribute.indexOf(sValue) == 0;
};

oNodeSelector_attributeSelectors['$=']	= function(sAttribute, sValue) {
	return sAttribute.indexOf(sValue) == sAttribute.length - sValue.length;
};

oNodeSelector_attributeSelectors['*=']	= function(sAttribute, sValue) {
	return sAttribute.indexOf(sValue) !=-1;
};

// -----------------------------------------------------------------------
//  nth child support
// -----------------------------------------------------------------------
function fNodeSelector_nthChild(oElement, sArguments, bTraverse) {
	switch (sArguments) {
		case 'n':		return true;
		case "even":	sArguments	= '2n'; break;
		case "odd":		sArguments	= '2n+1';
	}

	var aElements	= oElement.parentNode.childNodes,
		aChildren	= [];

	for (var nIndex = 0; nIndex < aElements.length; nIndex++)
		if (aElements[nIndex].nodeType == 1)	// cNode.ELEMENT_NODE
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
		nStep	= 0;

	var nCount	= 1;
	while (oElement = (bTraverse ? oElement.previousSibling : oElement.nextSibling))
		if (oElement.nodeType == 1)	// cNode.ELEMENT_NODE
			nCount++;

	if (fIsNaN(nMultiplier) || nMultiplier == 1)
		return bTraverse ? nStep >= nCount : nCount <= nStep;

	return nCount % nMultiplier == nStep;
};

var cNodeSelector	= function(){};

cNodeSelector.pseudoClass	= {};

// Attaching to implementation
cElement.prototype.querySelector			=
cDocument.prototype.querySelector		=
cNodeSelector.prototype.querySelector	= function(sCSS, fResolver) {
//->Guard
	fGuard(arguments, [
		["query",		cString],
		["resolver",	cFunction, true]
	], this);
//<-Guard

	var aNodeList	= fNodeSelector_query([this], sCSS, fResolver, true);
	return aNodeList.length ? aNodeList[0] : null;
};

cElement.prototype.querySelectorAll		=
cDocument.prototype.querySelectorAll		=
cNodeSelector.prototype.querySelectorAll	= function(sCSS, fResolver) {
//->Guard
	fGuard(arguments, [
		["query",		cString],
		["resolver",	cFunction, true]
	], this);
//<-Guard

	return fNodeSelector_query([this], sCSS, fResolver);
};

// UI element states
cNodeSelector.pseudoClass["checked"]	= function(oElement) {
	return fElement_hazAttribute(oElement, "checked") && fElement_getAttribute(oElement, "checked") == "true";
};

cNodeSelector.pseudoClass["enabled"]	= function(oElement) {
	return !fElement_hazAttribute(oElement, "disabled") || fElement_getAttribute(oElement, "disabled") != "true";
};

cNodeSelector.pseudoClass["disabled"]	= function(oElement) {
	return fElement_hazAttribute(oElement, "disabled") && fElement_getAttribute(oElement, "disabled") == "true";
};

cNodeSelector.pseudoClass["indeterminate"]	= function(oElement) {
	return oElement.indeterminate;
};

// jQuery Visibility Filter
cNodeSelector.pseudoClass["hidden"]	= function(oElement) {
	return !fFocusManager_isVisible(oElement);
};

cNodeSelector.pseudoClass["visible"]	= function(oElement) {
	return fFocusManager_isVisible(oElement);
};

// Other Selector
cNodeSelector.pseudoClass["animated"]= function(oElement) {
	return oElement.$animations && oElement.$animations.length;
};

cNodeSelector.pseudoClass["load"]	= function(oElement) {
	return oElement.$requests && oElement.$requests.length;
};
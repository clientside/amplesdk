fXPathExpression_axes["ancestor"]	= function(oNode) {
	var aSequence	= [];
	while (oNode = oNode.parentNode)
		aSequence.unshift(oNode);
	return aSequence;
};

fXPathExpression_axes["ancestor-or-self"]	= function(oNode) {
	var aSequence	= [];
	do {
		aSequence.unshift(oNode);
	} while (oNode = oNode.parentNode);
	return aSequence;
};

fXPathExpression_axes["attribute"]	= function(oNode) {

};

fXPathExpression_axes["child"]	= function(oNode) {
	var aSequence	= [];
	if (oNode = oNode.firstChild)
		do {
			aSequence.push(oNode);
		} while (oNode = oNode.nextSibling);
	return aSequence;
};

fXPathExpression_axes["descendant"]	= function(oNode) {

};

fXPathExpression_axes["descendant-or-self"]	= function(oNode) {

};

fXPathExpression_axes["following"]	= function(oNode) {

};

fXPathExpression_axes["following-sibling"]	= function(oNode) {
	var aSequence	= [];
	while (oNode = oNode.nextSibling)
		aSequence.push(oNode);
	return aSequence;
};

fXPathExpression_axes["namespace"]	= function(oNode) {

};

fXPathExpression_axes["parent"]	= function(oNode) {
	return oNode.parentNode ? [oNode.parentNode] : [];
};

fXPathExpression_axes["preceding"]	= function(oNode) {

};

fXPathExpression_axes["preceding-sibling"]	= function(oNode) {
	var aSequence	= [];
	while (oNode = oNode.previousSibling)
		aSequence.unshift(oNode);
	return aSequence;
};

fXPathExpression_axes["self"]	= function(oNode) {
	return [oNode];
};
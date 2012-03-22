
hXPathResolver_operators	= {};

function fXPathResolver_resolveOperator(nOperator) {
	if (nOperator in hXPathResolver_operators)
		hXPathResolver_operators[nOperator]();
};

hXPathResolver_operators[cXPathOperator.COMPARE]	= function() {

};

hXPathResolver_operators[cXPathOperator.INSTANCE_OF]	= function() {

};

hXPathResolver_operators[cXPathOperator.CASTABLE_AS]	= function() {

};

hXPathResolver_operators[cXPathOperator.TREAT_AS]	= function() {

};
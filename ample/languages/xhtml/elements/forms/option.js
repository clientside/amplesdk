/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_option	= function(){};
cXHTMLElement_option.prototype	= new cXHTMLElement("option");
cXHTMLElement_option.prototype.$selectable	= false;
cXHTMLElement_option.prototype.$hoverable	= true;

// Static Methods
cXHTMLElement_option.ensureRowIsVisible	= function(oInstance) {
	for (var oElement = oInstance; oElement = oElement.parentNode;)
		if (oElement instanceof cXHTMLElement_select) {
			var oScroll	= oElement.$getContainer("popup"),
				oInput	= oInstance.$getContainer(),
				nDiffTop	= oInput.offsetTop - oScroll.offsetTop,
				nDiffHeight	= oInput.offsetHeight - oScroll.offsetHeight;
			if (oScroll.scrollTop < nDiffTop + nDiffHeight)
				oScroll.scrollTop	= nDiffTop + nDiffHeight;
			else
			if (oScroll.scrollTop > nDiffTop)
				oScroll.scrollTop	= nDiffTop;
			break;
		}
};

// Class Events Handlers
cXHTMLElement_option.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		// Add to the options collection
		for (var oNode = this, nDepth = 0; oNode = oNode.parentNode;)
			if (oNode instanceof cXHTMLElement_select)
				break;
			else
				nDepth++;
		if (oNode) {
			oNode.options.$add(this);
			//
			if (this.parentNode != oNode)
				this.$getContainer("gap").style.width	= nDepth + "em";
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		// Remove from the options collection
		for (var oNode = this; oNode = oNode.parentNode;)
			if (oNode instanceof cXHTMLElement_select)
				break;
		if (oNode)
			oNode.options.$remove(this);
	}
};

cXHTMLElement_option.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "selected")
		this.$setPseudoClass("selected", sValue != null && sValue != "false");
	else
	if (sName == "label")
		this.$getContainer("gateway").innerHTML	= sValue || '';
	else
		cXHTMLElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXHTMLElement_option.prototype.$getTagOpen	= function() {
	var sClassName	= (this.prefix ? this.prefix + '-' : '') + this.localName;
	return '<div class="' +	sClassName +
				(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+
				(this.hasAttribute("disabled") ? ' ' + sClassName + '_disabled' : '')+
			'">\
				<div class="' + sClassName + '--gap" style="height:1em;float:left"></div>\
				<div class="' + sClassName + '--gateway">' +(this.getAttribute("label") || '');
};

cXHTMLElement_option.prototype.$getTagClose	= function() {
	return 		'</div>\
			</div>';
};

// Register Element
ample.extend(cXHTMLElement_option);

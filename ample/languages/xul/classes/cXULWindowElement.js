/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULWindowElement	= function() {
	cXULElement.apply(this, arguments);
};
cXULWindowElement.prototype	= new cXULElement;
cXULWindowElement.prototype.localName	= "#element-window";

cXULWindowElement.prototype.$draggable	= true;
cXULWindowElement.prototype.$resizable	= true;

cXULWindowElement.prototype.open	= function() {
	// TODO
};

cXULWindowElement.prototype.close	= function() {
	// TODO
};

//
cXULWindowElement.interactionstart	= function(oEvent) {
	var that	= oEvent.currentTarget;
	if (oEvent.target == that) {
		if (oEvent.type == "dragstart" && oEvent.$pseudoTarget != that.$getContainer("title"))
			oEvent.preventDefault();
		else {
			that.$getContainer("body").style.visibility	= "hidden";
			ample.query(that).animate({opacity:0.75});
		}
	}
};

cXULWindowElement.interactionend	= function(oEvent) {
	var that	= oEvent.currentTarget;
	if (oEvent.target == that) {
		that.$getContainer("body").style.visibility	= "";
		ample.query(that).animate({opacity:1.0});
	}
};

// Register Element
ample.extend(cXULWindowElement);

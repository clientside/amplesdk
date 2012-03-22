/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDataTransfer	= function() {
	this.types	= new cDOMStringList;
};
cDataTransfer.prototype.dropEffect		= "none";			// copy|move|link|position|none (dragenter|dragover)
cDataTransfer.prototype.effectAllowed	= "uninitialized";	// copy|move|link|copyLink|copyMove|linkMove|all|none|uninitialized=all (dragstart|dragenter|dragover)
cDataTransfer.prototype.types			= null;

cDataTransfer.prototype.clearData	= function(sFormat) {
//->Guard
	fGuard(arguments, [
		["format",	cString]
	]);
//<-Guard

	delete this.types[sFormat];
};

cDataTransfer.prototype.setData	= function(sFormat, vData) {
//->Guard
	fGuard(arguments, [
		["format",	cString],
		["data",	cString]
	]);
//<-Guard

	this.types[sFormat]	= vData;
};

cDataTransfer.prototype.getData	= function(sFormat) {
//->Guard
	fGuard(arguments, [
		["format",	cString]
	]);
//<-Guard

	return this.types[sFormat] || null;
};

cDataTransfer.prototype.setDragImage	= function(oImage, nLeft, nTop) {
//->Guard
	fGuard(arguments, [
		["image",	cXMLElement],
		["left",	cNumber,	true],
		["top",		cNumber,	true]
	]);
//<-Guard

	oDragAndDropManager_image.appendChild(oImage);
	oDragAndDropManager_image.style.marginLeft	= (nLeft || 0) + 'px';
	oDragAndDropManager_image.style.marginTop	= (nTop || 0) + 'px';
};

cDataTransfer.prototype.addElement		= function(oElement) {
//->Guard
	fGuard(arguments, [
		["element",	cXMLElement]
	]);
//<-Guard

	oDragAndDropManager_image.appendChild(oElement);
};

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegList() {
	this.$items	= [];
};

// Public Properties
cSVGPathSegList.prototype.numberOfItems	= 0;

// Private Properties
cSVGPathSegList.prototype.$onchange	= new Function;

// Public Methods
cSVGPathSegList.prototype.clear	= function() {
	this.$items.length	= 0;
	this.numberOfItems	= 0;
	this.$onchange();	// Notify about change
};

cSVGPathSegList.prototype.initialize	= function(oItem) {
	this.$items.length	= 0;
	this.numberOfItems	= this.$items.push(oItem);
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.getItem		= function(nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new ample.classes.DOMException(DOMException.INDEX_SIZE_ERR);

	return this.$items[nIndex];
};

cSVGPathSegList.prototype.insertItemBefore	= function(oItem, nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new ample.classes.DOMException(DOMException.INDEX_SIZE_ERR);

	this.numberOfItems	= this.$items.length++;
	for (var n = this.numberOfItems - 1; n > nIndex; n--)
		this.$items[n]	= this.$items[n - 1];
	this.$items[nIndex]	= oItem;
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.replaceItem	= function(oItem, nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new ample.classes.DOMException(DOMException.INDEX_SIZE_ERR);

	this.$items[nIndex]	= oItem;
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.removeItem	= function(nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new ample.classes.DOMException(DOMException.INDEX_SIZE_ERR);

	var oItem	= this.$items[nIndex];
	for (var n = nIndex + 1; n < this.numberOfItems; n++)
		this.$items[n - 1]	= this.$items[n];
	this.numberOfItems	= this.$items.length--;
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.appendItem	= function(oItem) {
	this.numberOfItems	= this.$items.push(oItem);
	this.$onchange();
	return oItem;
};
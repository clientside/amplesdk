// SVGRect object
function cSVGRect(nX, nY, nWidth, nHeight) {
	this.x	= nX;
	this.y	= nY;
	this.width	= nWidth;
	this.height	= nHeight;
};

// Public Properties
cSVGRect.prototype.x	= 0;
cSVGRect.prototype.y	= 0;
cSVGRect.prototype.width	= 0;
cSVGRect.prototype.height	= 0;

cSVGRect.prototype.toString	= function() {
	return "[object SVGRect]";
};
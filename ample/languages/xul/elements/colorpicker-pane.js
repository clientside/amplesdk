/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_colorpicker_pane	= function() {
	// Private Properties
	this.x	= 0;
	this.y	= 0;
	this.b	= 1;
};
cXULElement_colorpicker_pane.prototype	= new cXULPopupElement("colorpicker-pane");

cXULElement_colorpicker_pane.attributes	= {};
cXULElement_colorpicker_pane.attributes.value	= "#FF0000";

// Public	Method

// Private Methods
cXULElement_colorpicker_pane.prototype._moveTo	= function(sName, oPosition) {
	if (oPosition.x)
		this.$getContainer(sName).style.left	= oPosition.x + "px";
	if (oPosition.y)
		this.$getContainer(sName).style.top	= oPosition.y + "px";
};

cXULElement_colorpicker_pane.prototype._setColor	= function(sColor) {
	var oColor;
	if (oColor = cXULElement_colorpicker_pane._RGBtoXYB(sColor)) {
		this.b	= oColor.b;
		this.x	= oColor.x;
		this.y	= oColor.y;

		this._moveTo('palette-pointer', {'x' : this.x - 9, 'y' : this.y - 9});

		this.$getContainer('color').style.backgroundColor	= sColor;

		this._setColorBrightness(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': 0}));
		this._setPaletteBrightness(this.b);

		this._moveTo('brightness-pointer',	{'y' : this.b * 255	- 2});
	}
};

cXULElement_colorpicker_pane.prototype._setColorBrightness	= function(sColor) {
	this.$getContainer('brightness').style.backgroundColor	= sColor;
	this.$getContainer('brightness-shader').style.filter	= "progid:DXImageTransform.Microsoft.Gradient(startColorStr='" + sColor + "', endColorStr='#000000', gradientType='0');";
};

cXULElement_colorpicker_pane.prototype._setPaletteBrightness	= function(nBrightness) {
	// applying styles
	var oElementDOM	= this.$getContainer('palette-shader');
	oElementDOM.style.filter		= 'progid:DXImageTransform.Microsoft.alpha(opacity=' + nBrightness * 100 + ')'; // IE
	oElementDOM.style.opacity		= nBrightness; // Safari|FF1.5 (CSS 3)
	oElementDOM.style.MozOpacity	= nBrightness; // mozilla
};

cXULElement_colorpicker_pane.prototype._getComputedStyleByEvent	= function(oEvent, sName) {
	var oPosition	= this.getBoundingClientRect(sName);
	var nPositionX	= oEvent.clientX - oPosition.left/*	+ oPosition.scrollLeft*/;
	var nPositionY	= oEvent.clientY - oPosition.top/*	+ oPosition.scrollTop*/;

	// limit value by the range (0..255)
	nPositionX	= nPositionX < 0	? 0 :(nPositionX > 255	? 255	: nPositionX);
	nPositionY	= nPositionY < 0	? 0 :(nPositionY > 255	? 255	: nPositionY);

	return {'x' : nPositionX, 'y': nPositionY};
};

cXULElement_colorpicker_pane.prototype._setColorValue	= function(sColor) {
	this.$getContainer('color').style.backgroundColor	= sColor;
	this.$getContainer('value').value	= sColor;
};

cXULElement_colorpicker_pane.prototype._detachHandlers	= function() {
	document.onmousemove	= null;
	document.onmouseup	= null;
};

// Event handlers
cXULElement_colorpicker_pane.prototype._onInputChange	= function(oEvent, sValue) {
	this._setColor(sValue);
};

cXULElement_colorpicker_pane.prototype._onPointersBrightnessMouseMove	= function(oEvent) {
	var oPosition	= this._getComputedStyleByEvent(oEvent, 'brightness');
	this._moveTo('brightness-pointer', {'y' : oPosition.y - 3});

	this.b	= Math.round(100 * oPosition.y / 255) / 100;
	this._setPaletteBrightness(this.b);
	this._setColorValue(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': this.b}));
};

cXULElement_colorpicker_pane.prototype._onPointersBrightnessMouseDown	= function(oEvent) {
	var oElement	= this;
	document.onmousemove	= function(e) {
		return oElement._onPointersBrightnessMouseMove(e || event)
	};
	document.onmouseup	= function() {
		oElement._detachHandlers();
	};
	this._onPointersBrightnessMouseMove(oEvent);
};

cXULElement_colorpicker_pane.prototype._onPointerPaletteMouseMove	= function(oEvent) {
	var oPosition	= this._getComputedStyleByEvent(oEvent, "palette");
	this.x	= oPosition.x;
	this.y	= oPosition.y;

	this._moveTo('palette-pointer', {'x' : this.x - 9, 'y' : this.y - 9});
	this._setColorBrightness(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': 0}));
	this._setColorValue(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': this.b}));
};

cXULElement_colorpicker_pane.prototype._onPointerPaletteMouseDown	= function(oEvent) {
	var oElement	= this;
	document.onmousemove	= function(e) {
		return oElement._onPointerPaletteMouseMove(e || event)
	};
	document.onmouseup	= function() {
		oElement._detachHandlers();
	};
	this._onPointerPaletteMouseMove(oEvent);
};

// Overrride dialog methods
cXULElement_colorpicker_pane.prototype.acceptDialog	= function() {
	this.setAttribute("value", this.$getContainer('value').value);

	// fire select event
	var oEvent	= this.ownerDocument.createEvent("Event");
	oEvent.initEvent("accept", false, false);
	this.dispatchEvent(oEvent);
};

cXULElement_colorpicker_pane.prototype.cancelDialog	= function() {
	this.setAttribute("value", this.getAttribute("value"));

	// fire cancel event
	var oEvent	= this.ownerDocument.createEvent("Event");
	oEvent.initEvent("cancel", false, false);
	this.dispatchEvent(oEvent);
};

// Class handlers
cXULElement_colorpicker_pane.handlers	= {
	"DOMNodeInsertedIntoDocument":	function() {
		this._setColor(cXULElement_colorpicker_pane.attributes.value);
	}
};

cXULElement_colorpicker_pane.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value") {
		this._setColor(sValue || '');
		this.$getContainer('value').value	= sValue || '';
	}
	else
		cXULPopupElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Render
cXULElement_colorpicker_pane.prototype.$getTagOpen	= function() {
	return '<div class="xul-colorpicker-pane xul-menupopup' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '" style="' +
				(this.getAttribute("hidden") == "true" ? "display:none;" : '') +
				(this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;"></div>\
				<table cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td valign="top">\
							<div class="xul-colorpicker-pane--palette" style="position:relative;" onmousedown="ample.$instance(this)._onPointerPaletteMouseDown(event)">\
								<div class="xul-colorpicker-pane--palette-shader"><br /></div>\
								<div class="xul-colorpicker-pane--palette-pointer" style="position:absolute;"><br /></div>\
							</div>\
						</td>\
						<td align="center" valign="top" style="position:relative;display:block;">\
							<div style="width:39px" onmousedown="ample.$instance(this)._onPointersBrightnessMouseDown(event);">\
								<div class="xul-colorpicker-pane--brightness">\
									<div class="xul-colorpicker-pane--brightness-shader"><br /></div>\
								</div>\
								<div class="xul-colorpicker-pane--brightness-pointer" style="position:absolute;left:1px;"><br /></div>\
							</div>\
						</td>\
						<td valign="top">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">\
								<tbody>\
									<tr><td align="right"><div class="xul-colorpicker-pane--color"></div></td></tr>\
									<tr><td><br /></td></tr>\
									<tr><td><input autocomplete="no" type="text" value="#FF0000" maxlength="7" class="xul-colorpicker-pane--value" onchange="ample.$instance(this)._onInputChange(event, this.value)" onkeyup="ample.$instance(this)._onInputChange(event, this.value)" onselectstart="event.cancelBubble=true;" oncontextmenu="event.cancelBubble=true"/></td></tr>\
									<tr><td><br /></td></tr>\
									<tr><td><button type="button" onclick="ample.$instance(this).acceptDialog();" class="xul-colorpicker-pane--button-accept">' + ample.locale.localize("xul.dialog.button.accept") + '</button></td></tr>\
									<tr><td height="3"></td></tr>\
									<tr><td><button type="button" onclick="ample.$instance(this).cancelDialog()" class="xul-colorpicker-pane--button-cancel">' + ample.locale.localize("xul.dialog.button.cancel") + '</button></td></tr>\
								</tbody>\
							</table>\
						</td>\
					</tr>\
				</tbody>\
			</table>\
		</div>';
};

cXULElement_colorpicker_pane.prototype.$getTagClose	= function() {
	return '';
};

// Static methods
cXULElement_colorpicker_pane._XYBtoRGB	= function(oXYB) {
	var nH	= 360 / 256 * oXYB.x;
	var nS	= 1 - oXYB.y / 256;
	var nV	= 1 - oXYB.b;

	var nR, nG, nB;

	if (nS == 0)
		nR	= nG = nB = nV;
	else
	{
		var nI	= Math.floor(nH / 60);
		var nF	= nH / 60 - nI;
		var nP	= nV *(1 - nS);
		var nQ	= nV *(1 - nS * nF);
		var nT	= nV *(1 - nS * (1 - nF));

		switch (nI) {
			case 0:		nR	= nV;	nG	= nT;	nB	= nP;	break;
			case 1:		nR	= nQ;	nG	= nV;	nB	= nP;	break;
			case 2:		nR	= nP;	nG	= nV;	nB	= nT;	break;
			case 3:		nR	= nP;	nG	= nQ;	nB	= nV;	break;
			case 4:		nR	= nT;	nG	= nP;	nB	= nV;	break;
			default:	nR	= nV;	nG	= nP;	nB	= nQ;
		}
	}
	return '#' + this._toHex(nR * 256) + this._toHex(nG * 256) + this._toHex(nB * 256);
};

cXULElement_colorpicker_pane._RGBtoXYB	= function(sColor) {
	if (!sColor.match(/^#[0-9a-f]{6}$/i))
		return;

	var nR	= parseInt(sColor.substr(1, 2), 16);
	var nG	= parseInt(sColor.substr(3, 2), 16);
	var nB	= parseInt(sColor.substr(5, 2), 16);

	var nV	= Math.max(nR, nG, nB);
	var nX	= Math.min(nR, nG, nB);
	var nS	= (nV-nX) / nV;
	var nH	= 0;

	var nRed	=(nV - nR) / (nV - nX);
	var nGreen	=(nV - nG) / (nV - nX);
	var nBlue	=(nV - nB) / (nV - nX);

	if (nR == nV)
		nH	=(nG == nX) ? 5 + nBlue	: 1 - nGreen;
	else
	if (nG == nV)
		nH	=(nB == nX) ? 1 + nRed	: 3 - nBlue;
	else
		nH	=(nR == nX) ? 3 + nGreen	: 5 - nRed;

	nH	/=	6;

	return {'x' : (nH * 255), 'y' : (255 - nS * 255), 'b' : 1 - nV / 255};
};

cXULElement_colorpicker_pane._toHex	= function(nValue) {
	var sHexCharacters	= "0123456789ABCDEF";

	if (nValue < 0)
		return "00";
	if (nValue > 255)
		return "FF";
	else
		return sHexCharacters.charAt(Math.floor(nValue / 16)) + sHexCharacters.charAt(nValue % 16);
};

// Register Element
ample.extend(cXULElement_colorpicker_pane);

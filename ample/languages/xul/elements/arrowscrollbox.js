/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_arrowscrollbox	= function() {};

cXULElement_arrowscrollbox.prototype	= new cXULElement("arrowscrollbox");
cXULElement_arrowscrollbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_arrowscrollbox.attributes	= {};
cXULElement_arrowscrollbox.attributes.width	= "200";
cXULElement_arrowscrollbox.attributes.height	= "200";

// Private properties
cXULElement_arrowscrollbox.prototype._interval	= null;

// Public Methods
cXULElement_arrowscrollbox.prototype.scrollByIndex	= function(nLines) {
	throw new ample.classes.DOMException(DOMException.NOT_SUPPORTED_ERR);
};

// Private method
cXULElement_arrowscrollbox.prototype._onInterval	= function(sName, nSign) {
	this.$getContainer("gateway")[sName == "vertical" ? "scrollTop" : "scrollLeft"]+= 3 * nSign;
};

// Events Handlers
cXULElement_arrowscrollbox.prototype._onButtonOver	= function(oEvent, sName, nSign) {
	var oSelf	= this;
	this._interval	= setInterval(function() {
		oSelf._onInterval(sName, nSign);
	}, 30);
};

cXULElement_arrowscrollbox.prototype._onButtonOut	= function(oEvent) {
	this._interval	= clearInterval(this._interval);
};

// Element Render: open
cXULElement_arrowscrollbox.prototype.$getTagOpen	= function() {
	var sHtml	= '<table cellpadding="0" cellspacing="0" border="0" class="xul-arrowscrollbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
	sHtml	+= '<tbody>';
	sHtml	+= '<tr>';
	if (this.attributes["orient"] == "vertical") {
		sHtml	+= '<td height="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-up xul-arrowscrollbox-button-up-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'vertical\', -1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\'); ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
		sHtml	+= '</tr><tr>';
	}
	else
		sHtml	+= '<td width="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-left xul-arrowscrollbox-button-left-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'horizontal\', -1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\'); ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
	sHtml	+= '<td>';
	sHtml	+= '<div class="xul-arrowscrollbox--gateway" style="position:relative; height:' +(this.attributes["height"] -(this.attributes["orient"] == "vertical" ? 18 : 0))+ '; width:' +(this.attributes["width"] -(this.attributes["orient"] != "vertical" ? 18 : 0))+ '; overflow:hidden;">';

	return sHtml;
};

// Element Render: close
cXULElement_arrowscrollbox.prototype.$getTagClose	= function() {
	var sHtml	= '</div>';
	sHtml  += '</td>';
	if (this.attributes["orient"] == "vertical") {
		sHtml  += '</tr><tr>';
		sHtml  += '<td height="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-down xul-arrowscrollbox-button-down-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'vertical\', 1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\');ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
	}
	else
		sHtml  += '<td width="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-right xul-arrowscrollbox-button-right-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'horizontal\', 1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\');ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
	sHtml  += '</tr>';
	sHtml  += '</tbody>';
	sHtml  += '</table>';

	return sHtml;
};

// Register Element
ample.extend(cXULElement_arrowscrollbox);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_pager	= function(){};
cAUIElement_pager.prototype	= new cAUIElement("marker");

// Default Attributes
cAUIElement_pager.attributes	= {
	pagestep:		"1",
	pagesamount:	"10"
};

cAUIElement_pager.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "pagestep":
					if (!window.isNaN(oEvent.newValue))
						this.goTo(oEvent.newValue);
					break;

				case "pagesamount":
					break;
			}
		}
	}
};

// Public Methods
cAUIElement_pager.prototype.goTo	= function(nIndex) {
	if (nIndex * 1 < this.attributes["pagesamount"] * 1 && nIndex * 1 >= 0) {
		// deselect previously selected and select new item
		var oElement	= this.$getContainer("body");
		oElement.tBodies[0].rows[0].cells[this.attributes["pagestep"]].className	= oElement.tBodies[0].rows[0].cells[this.attributes["pagestep"]].className.replace("selected", "normal");
		oElement.tBodies[0].rows[0].cells[nIndex].className	= oElement.tBodies[0].rows[0].cells[nIndex].className.replace(/normal|hover|active/, "selected");

		this.attributes["pagestep"]	= nIndex;
	}

	// Fire event
	var oEvent	= this.ownerDocument.createEvent("Event");
	oEvent.initEvent("change", true, false);
	this.dispatchEvent(oEvent);
};

// Events Handlers
cAUIElement_pager.prototype._onItemClick	= function(oEvent, nIndex) {
	this.goTo(nIndex);
};

cAUIElement_pager.prototype._onButtonClick	= function(oEvent, sButtonType) {
	if (sButtonType == "next") {
		if (this.attributes["pagestep"] * 1 + 1 < this.attributes["pagesamount"] * 1)
			this.goTo(this.attributes["pagestep"] * 1 + 1);
	}
	else
	if (sButtonType == "back") {
		if (this.attributes["pagestep"] * 1 - 1 >= 0)
			this.goTo(this.attributes["pagestep"] * 1 - 1);
	}
};

// Element Render: open
cAUIElement_pager.prototype.$getTagOpen	= function() {
	var sHtml	= '<table cellpadding="0" cellspacing="0" border="0" class="aui-pager">';
	sHtml	+= '<tbody>';
	sHtml	+= '<tr>';
	sHtml	+= '<td width="1">Page:</td>';
	sHtml	+= '<td>';
	sHtml	+= '<table cellpadding="0" cellspacing="0" border="0" height="100%" class="aui-pager--body">';
	sHtml	+= '<tbody>';
	sHtml	+= '<tr>';
	for (var nIndex = 0; nIndex < this.attributes["pagesamount"] * 1; nIndex++)
		sHtml	+= '<td class="aui-pager-item" onmouseover="this.className=this.className.replace(\'normal\', \'hover\');" onmouseout="this.className=this.className.replace(\'hover\', \'normal\');" onmousedown="this.className=this.className.replace(\'hover\', \'active\');" onmouseup="this.className=this.className.replace(\'active\', \'hover\');" onclick="ample.$instance(this)._onItemClick(event, this.cellIndex)">' + nIndex + '</td>';
	sHtml	+= '</tr>';
	sHtml	+= '</tbody>';
	sHtml	+= '</table>';
	sHtml	+= '</td>';
	sHtml	+= '<td width="1" class="aui-pager-item" onclick="ample.$instance(this)._onButtonClick(event, \'back\')">&lt;&lt;</td>';
	sHtml	+= '<td width="1" class="aui-pager-item" onclick="ample.$instance(this)._onButtonClick(event, \'next\')">&gt;&gt;</td>';
	sHtml	+= '<td> </td>';
	sHtml	+= '</tr>';
	sHtml	+= '</tbody>';
	sHtml	+= '</table>';

	return sHtml;
};

// Register Element
ample.extend(cAUIElement_pager);

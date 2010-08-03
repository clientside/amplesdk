/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_pager	= function(){};
cAMLElement_pager.prototype  = new cAMLElement("marker");

// Default Attributes
cAMLElement_pager.attributes	= {
	pagestep:		"1",
	pagesamount:	"10"
};

// Public Methods
cAMLElement_pager.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "pagestep")
    {
        if (!window.isNaN(sValue))
            this.goTo(sValue);
    }
    else
    if (sName == "pagesamount")
    {

    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_pager.prototype.goTo     = function(nIndex)
{
    if (nIndex * 1 < this.attributes["pagesamount"] * 1 && nIndex * 1 >= 0)
    {
        // deselect previously selected and select new item
        var oElement	= this.$getContainer("body");
        oElement.tBodies[0].rows[0].cells[this.attributes["pagestep"]].className    = oElement.tBodies[0].rows[0].cells[this.attributes["pagestep"]].className.replace("selected", "normal");
        oElement.tBodies[0].rows[0].cells[nIndex].className  = oElement.tBodies[0].rows[0].cells[nIndex].className.replace(/normal|hover|active/, "selected");

        this.attributes["pagestep"]    = nIndex;
    }

    // Fire event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", true, false);
    this.dispatchEvent(oEvent);
};

// Events Handlers
cAMLElement_pager.prototype._onItemClick     = function(oEvent, nIndex)
{
    this.goTo(nIndex);
};

cAMLElement_pager.prototype._onButtonClick   = function(oEvent, sButtonType)
{
    if (sButtonType == "next")
    {
        if (this.attributes["pagestep"] * 1 + 1 < this.attributes["pagesamount"] * 1)
            this.goTo(this.attributes["pagestep"] * 1 + 1);
    }
    else
    if (sButtonType == "back")
    {
        if (this.attributes["pagestep"] * 1 - 1 >= 0)
            this.goTo(this.attributes["pagestep"] * 1 - 1);
    }
};

// Element Render: open
cAMLElement_pager.prototype.$getTagOpen	= function()
{
    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0" class="aml-pager">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td width="1">Page:</td>';
    sHtml  += '<td>';
    sHtml  += '<table cellpadding="0" cellspacing="0" border="0" height="100%" class="aml-pager--body">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    for (var nIndex = 0; nIndex < this.attributes["pagesamount"] * 1; nIndex++)
        sHtml  += '<td class="aml-pager-item" onmouseover="this.className=this.className.replace(\'normal\', \'hover\');" onmouseout="this.className=this.className.replace(\'hover\', \'normal\');" onmousedown="this.className=this.className.replace(\'hover\', \'active\');" onmouseup="this.className=this.className.replace(\'active\', \'hover\');" onclick="ample.$instance(this)._onItemClick(event, this.cellIndex)">' + nIndex + '</td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';
    sHtml  += '</td>';
    sHtml  += '<td width="1" class="aml-pager-item" onclick="ample.$instance(this)._onButtonClick(event, \'back\')">&lt;&lt;</td>';
    sHtml  += '<td width="1" class="aml-pager-item" onclick="ample.$instance(this)._onButtonClick(event, \'next\')">&gt;&gt;</td>';
    sHtml  += '<td> </td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

// Register Element
ample.extend(cAMLElement_pager);

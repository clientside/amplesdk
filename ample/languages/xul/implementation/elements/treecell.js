/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_treecell	= function(){};
cXULElement_treecell.prototype   = new cXULElement;

// Public Methods
cXULElement_treecell.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "label")
    {
        var sHtml   = '';
        if (this.attributes["src"])
            sHtml  += '<img src="' + this.attributes["src"] + '" align="absmiddle" /> ';
        sHtml  += sValue;
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    if (sName == "src")
    {
        var sHtml   = '';
        sHtml  += '<img src="' + sValue + '" align="absmiddle" /> ';
        if (this.attributes["label"])
            sHtml  += this.attributes["label"];
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    if (sName == "editable")
    {
        if (sValue == "true")
        {
        	var oElementDOM	= this.$getContainer("gateway");
            oElementDOM.innerHTML  = '<input style="border:none; margin:0px; margin-left: 2px; padding-left: 2px; padding-top:1px; width:100px;" onselectstart="event.cancelBubble=true;" onchange="ample.$instance(this).setAttribute(\'label\', this.value)" onblur="this.onchange();" onkeydown="if (event.keyCode == 13) this.onchange(); else if (event.keyCode == 27) ample.$instance(this).setAttribute(\'editable\', \'false\')"/>';
            oElementDOM.firstChild.focus();
            oElementDOM.firstChild.value   = this.attributes["label"];
        }
        else
            this.setAttribute("label", this.attributes["label"]);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Private methods
cXULElement_treecell.prototype._onNodeClick	= function(oEvent)
{
	this.parentNode.parentNode.setAttribute("open", this.parentNode.parentNode.getAttribute("open") == "true" ? "false" : "true");
};

// Element Render: open
cXULElement_treecell.prototype.$getTagOpen	= function()
{
    var sHtml   = '<td class="xul-treecell">';

	var oChildren	= this.parentNode.parentNode.parentNode;
    if (oChildren.tree && oChildren.tree.head && this.parentNode.cells && (oChildren.tree.head._getPrimaryColIndex() == this.parentNode.cells.$indexOf(this)))
    {
        var oElementCurrent = this;
        do {
            if (oElementCurrent instanceof cXULElement_treeitem)
                sHtml  += '<div onmousedown="return ample.$instance(this)._onNodeClick(event);" class="xul-treecell-line"><br /></div>';
            else
            if (oElementCurrent instanceof cXULElement_tree)
                break;
        } while(oElementCurrent = oElementCurrent.parentNode);
    }

    sHtml  += '<div class="xul-treecell--gateway">';
    if (this.attributes["src"])
        sHtml  += '<img src="' + this.attributes["src"] + '" align="absmiddle"/> ';
    sHtml  += this.attributes["label"] ? this.attributes["label"] : '';

    return sHtml;
};

// Element Render: close
cXULElement_treecell.prototype.$getTagClose	= function()
{
    return '</div></td>';
};

// Register Element with language
oXULNamespace.setElement("treecell", cXULElement_treecell);

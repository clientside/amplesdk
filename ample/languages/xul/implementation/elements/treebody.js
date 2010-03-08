/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treebody	= function(){};
cXULElement_treebody.prototype   = new cXULElement;

// Public Properties
cXULElement_treebody.prototype.children	= null;

// Public Methods

// Events Handlers
cXULElement_treebody.prototype._onScroll     = function()
{
    if (this.parentNode.head)
        this.parentNode.head.$getContainer("area").scrollLeft  = this.$getContainer("area").scrollLeft;
};

// Class events handlers
cXULElement_treebody.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= this.parentNode;

				// In both cases
				this.children  = oEvent.target;
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= null;

				// In both cases
				this.children  = null;
			}
	}
};

// Element Render: open
cXULElement_treebody.prototype.$getTagOpen	= function()
{
    return '<tr' +(this.attributes["hidden"] == "true" ? ' style="display:hidden;"' : '')+ '>\
				<td style="height:100%">\
					<div class="xul-treebody--area" style="height:100%;width:100%;overflow:scroll;position:relative;" onscroll="return ample.$instance(this)._onScroll(event)">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-treebody' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="position:absolute;' + (navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 == 7 ? 'border-left: solid 18px white;margin-left:-18px;' : '') + '">\
							<tbody class="xul-treebody--gateway">';
};

// Element Render: close
cXULElement_treebody.prototype.$getTagClose	= function()
{
    var sHtml   = '</tbody>';
    if (this.parentNode.head)
    {
        sHtml  += '<tfoot class="xul-treebody--foot">';
        sHtml  += '<tr>';
        if (this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio")
            sHtml  += '<td width="20" style="width:20px"><div style="width:20px" /></td>';
        for (var nIndex = 0, aItems = this.parentNode.head.items; nIndex < aItems.length; nIndex++)
            sHtml  += '<td' + (aItems[nIndex].attributes["width"] ? ' width="' + aItems[nIndex].attributes["width"] + '"' : '') + '><div style="height:1px;' + (aItems[nIndex].attributes["minwidth"] ? 'width:' + aItems[nIndex].attributes["minwidth"] + 'px' : '') + '"/></td>';
        sHtml  += '</tr>';
        sHtml  += '</tfoot>';
    }
    sHtml  += '</table>';
    sHtml  += '</div>';
    sHtml  += '</td>';
    sHtml  += '</tr>';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("treebody", cXULElement_treebody);

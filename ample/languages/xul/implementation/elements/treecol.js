/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_treecol	= function(){};
cXULElement_treecol.prototype	= new cXULElement;
cXULElement_treecol.prototype.$hoverable	= true;

// Public Methods
cXULElement_treecol.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "label")
    {
        this.$getContainer("label").innerHTML	= sValue;
    }
    else
    if (sName == "hidden" || sName == "hideheader")
    {
    	var nCell	= this.parentNode.items.$indexOf(this);
    	this.$getContainer().style.display	= sValue == "true" ? "none" : "";
        for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
        	if (aItems[nIndex].row)
        		aItems[nIndex].row.cells[nCell].setAttribute(sName, sValue);
        this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + 1].style.display	= sValue == "true" ? "none" : "";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class Events Handlers
cXULElement_treecol.handlers	= {
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		this.$setPseudoClass("active", true);
	},
	"mouseup":		function(oEvent) {
		this.$setPseudoClass("active", false);
	}
/*
	,"mousemove":	function(oEvent) {
		var oElementDOM	= this.$getContainer();
		var oPosition	= this.getBoundingClientRect();
		if (Math.abs(oPosition.left - oEvent.clientX) < 10 || Math.abs(oPosition.right - oEvent.clientX) < 10)
			oElementDOM.style.cursor	= "col-resize";
		else
			oElementDOM.style.cursor	= "";
	}
*/
};

// Element Render: open
cXULElement_treecol.prototype.$getTagOpen	= function()
{
	return '<th class="xul-treecol ' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : "")+(this.attributes["hideheader"] == "true" ? ' style="display:none"' : "")+ ' align="left">\
    			<div class="xul-treecol--label"' + (this.attributes["minwidth"] ? ' style="width:' + this.attributes["minwidth"] + 'px"' : '') + '> ' +(this.attributes["label"] || "");
};

// Element Render: close
cXULElement_treecol.prototype.$getTagClose	= function()
{
    return		'</div>\
			</th>';
};

// Register Element with language
oXULNamespace.setElement("treecol", cXULElement_treecol);

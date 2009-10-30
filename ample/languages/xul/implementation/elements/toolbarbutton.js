/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_toolbarbutton	= function(){};
cXULElement_toolbarbutton.prototype  = new cXULElement;

cXULElement_toolbarbutton.prototype.$hoverable	= true;
cXULElement_toolbarbutton.prototype.tabIndex	= 0;

// Public Methods
cXULElement_toolbarbutton.prototype.setAttribute = function(sName, sValue)
{
	if (sName == "open")
	{
		var oElement	= this.getElementsByTagNameNS(this.namespaceURI, "menupopup")[0];
		if (oElement)
		{
			if (sValue == "true")
			{
	            var that	= this;
	            oElement.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	        	oElement.addEventListener("popuphidden", function(oEvent) {
				   	oElement.removeEventListener("popuphidden", arguments.callee, false);
				    //
				    that.$setPseudoClass("active", false);
				    that.setAttribute("open", "false");
				}, false);

	            //
	            this.ownerDocument.popupNode	= oElement;
			}
			else
			{
	            oElement.hidePopup();

	            //
	            this.ownerDocument.popupNode	= null;
	        }
		}
	}
	else
    if (sName == "disabled")
    {
        // TODO
    }
    else
    if (sName == "type")
    {
        // TODO
    }
    else
    if (sName == "label")
    {
        var sHtml   = '';
        if (this.attributes["image"])
            sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle" />';
        sHtml  += ' ' + sValue;
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    if (sName == "image")
    {
        var sHtml   = '';
        sHtml  += '<img src="' + sValue + '" align="absmiddle" />';
        if (this.attributes["label"])
            sHtml  += ' ' + this.attributes["label"];
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class Events Handlers
cXULElement_toolbarbutton.handlers	= {
	"mouseout":		function(oEvent) {
		if (this.getAttribute("open") != "true")
		   	this.$setPseudoClass("active", false);
	},
	"mouseup":		function(oEvent) {
		if (this.getAttribute("open") != "true")
		   	this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (this.getAttribute("type") == "menu-button") {
			// If click happend on "arrow" button
			if (oEvent.$pseudoTarget == this.$getContainer("arrow")) {
			    if (this.getAttribute("open") == "true")
			        this.setAttribute("open", "false");
			    else {
			        this.setAttribute("open", "true");
				   	this.$setPseudoClass("active", true);
			    }
			}
			else
	        if (this.getAttribute("open") == "true")
	            return;
		}
		else
	    if (this.getAttribute("type") == "menu") {
	    	if (this.getAttribute("open") != "true")
            	this.setAttribute("open", "true");
            else
            	return;
	    }
		//
	   	this.$setPseudoClass("active", true);
	}
};

// Element Render: open
cXULElement_toolbarbutton.prototype.$getTagOpen	= function()
{
	var sType	= this.getAttribute("type");
    return '<table cellpadding="0" cellspacing="0" border="0" class="xul-toolbarbutton' + (this.attributes["disabled"] == "true" ? " xul-toolbarbutton_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
				<tbody>\
					<tr height="3">\
						<td width="3" rowspan="3" class="xul-toolbarbutton-left"><div style="width:3px"/></td>\
						<td class="xul-toolbarbutton-top"></td>'+
					(sType == "menu-button"
					 ? '<td width="3" rowspan="3" class="xul-toolbarbutton-right"></td>'
					 : '')+
					(sType == "menu" || sType == "menu-button"
					 ? '<td class="xul-toolbarbutton-top"></td>'
					 : '')+ '\
						<td width="3" rowspan="3" class="xul-toolbarbutton-right"><div style="width:3px"/></td>\
					</tr>\
					<tr>\
						<td class="xul-toolbarbutton--gateway">' +
					(this.getAttribute("image")
						? '<img src="' + this.getAttribute("image") + '" align="absmiddle"/>'
						: '')+
					(this.getAttribute("label")
						? ' ' + this.getAttribute("label")
						: '');

    return sHtml;
};

// Element Render: close
cXULElement_toolbarbutton.prototype.$getTagClose	= function()
{
	var sType	= this.getAttribute("type");
	return 				'</td>'+
    				(sType == "menu" || sType == "menu-button"
    				 ? '<td class="xul-toolbarbutton-arrow"><div class="xul-toolbarbutton--arrow"><br /></div></td>'
    				 : '') + '\
					</tr>\
					<tr height="3">\
						<td class="xul-toolbarbutton-bottom"></td>'+
					(sType == "menu" || sType == "menu-button"
					 ? '<td class="xul-toolbarbutton-bottom"></td>'
					 : '')+ '\
					</tr>\
				</tbody>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("toolbarbutton", cXULElement_toolbarbutton);

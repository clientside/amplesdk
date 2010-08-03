/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menubar	= function()
{
    // Collections
    this.items  = new AMLNodeList;
};
cXULElement_menubar.prototype	= new cXULElement("menubar");
cXULElement_menubar.prototype.tabIndex		= 0;
cXULElement_menubar.prototype.$selectable	= false;

// Public Properties
cXULElement_menubar.prototype.selectedItem	= null;

// Attributes Defaults
cXULElement_menubar.attributes	= {};
cXULElement_menubar.attributes.active	= "false";

cXULElement_menubar.prototype.selectItem	= function(oItem)
{
	if (this.selectedItem != oItem)
	{
	    // Hide previously active
	    if (this.selectedItem) {
			this.attributes["active"]	= "false";

	        if (this.selectedItem.menupopup)
	            this.selectedItem.menupopup.hidePopup();
	        this.selectedItem.setAttribute("selected", "false");
	    }

	    // Show this element
	    if (oItem) {
		    if (oItem.menupopup && oItem.$isAccessible()) {
	            oItem.menupopup.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	        	oItem.menupopup.addEventListener("popuphidden", function() {
	        		if (this.opener.attributes["active"] == "true")	{
						this.opener.selectedItem.setAttribute("selected", "false");
						this.opener.selectedItem.$setPseudoClass("hover", false);
						this.opener.selectedItem	= null;
					}
				   	this.removeEventListener("popuphidden", arguments.callee, false);

				    this.opener	= null;
				    this.ownerDocument.popupNode	= null;
	        	}, false);
	        	//
	        	oItem.menupopup.opener	= this;
		        this.ownerDocument.popupNode	= oItem.menupopup;
			}

			this.attributes["active"]	= "true";

			oItem.setAttribute("selected", "true");
		}

	    this.selectedItem = oItem;
	}
};

// Class event handler
cXULElement_menubar.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_menubar.prototype.$getTagOpen		= function()
{
	return '<div class="xul-menubar">\
    			<table cellpadding="0" cellspacing="0" border="0" width="100%">\
    				<tbody>\
    					<tr class="xul-menubar--gateway">';
};

// Element Render: close
cXULElement_menubar.prototype.$getTagClose	= function()
{
	return 					'<td width="100%"><br /></td>\
						</tr>\
					</tbody>\
    			</table>\
			</div>';
};

// Register Element
ample.extend(cXULElement_menubar);

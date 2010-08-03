/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_menuitem	= function(){};
cXULElement_menuitem.prototype	= new cXULElement("menuitem");

cXULElement_menuitem.prototype.$hoverable	= true;

// Class Events Handlers
cXULElement_menuitem.handlers	= {
	"mouseenter":	function(oEvent) {
		this.parentNode.selectItem(this);
	},
	"mouseleave":	function(oEvent) {
		this.parentNode.selectItem(null);
	},
	"click":	function(oEvent) {
		// If disabled, return
	    if (!this.$isAccessible())
	        return;

		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "selected":
					this.$setPseudoClass("selected", oEvent.newValue == "true");
					break;

				case "label":
					var oCell	= this.$getContainer().cells[1];
					// Strange IE problem, it doesn't allow setting innerHTML here..
					if (document.namespaces)
						oCell.innerText   = oEvent.newValue || '';
					else
						oCell.innerHTML   = oEvent.newValue || '';
					break;

				case "image":
					this.$getContainer("image").style.backgroundImage   = oEvent.newValue ? "url(" + oEvent.newValue + ")" : '';
					break;

				case "type":
					// TODO
					break;

				case "checked":
					if (this.attributes["type"] == "radio" && oEvent.newValue == "true") {
						// uncheck all the sibling items with the same name attribute
						var oElement	= this.parentNode;
						for (var nIndex = 0; nIndex < oElement.items.length; nIndex++)
							if (oElement.items[nIndex] instanceof cXULElement_menuitem && oElement.items[nIndex].attributes["type"] == "radio")
								if (oElement.items[nIndex] != this && oElement.items[nIndex].attributes["name"] == this.attributes["name"])
									oElement.items[nIndex].setAttribute("checked", "false");
					}
					this.$setPseudoClass("checked", oEvent.newValue == "true", "image");
					break;

				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$add(this);
		var oMenuList	= oParent.parentNode;
		if (oMenuList instanceof cXULElement_menulist)
			oMenuList.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$remove(this);
		var oMenuList	= oParent.parentNode;
		if (oMenuList instanceof cXULElement_menulist)
			oMenuList.items.$remove(this);
	},
	"DOMActivate":	function(oEvent) {
	    if (this.attributes["type"] == "checkbox")
	        this.setAttribute("checked", this.attributes["checked"] == "true" ? "false" : "true");
	    else
	    if (this.attributes["type"] == "radio")
	        this.setAttribute("checked", "true");

		// Execute commands
	    this.doCommand();
	}
};

cXULElement_menuitem.prototype.scrollIntoView	= function() {
	var oElementDOM	= this.$getContainer(),
		oParentDOM	= oElementDOM.parentNode;

	if (oParentDOM.scrollTop > oElementDOM.offsetTop)
		oParentDOM.scrollTop	= oElementDOM.offsetTop - 1;
	if (oParentDOM.scrollTop < oElementDOM.offsetTop - oParentDOM.offsetHeight + oElementDOM.offsetHeight)
		oParentDOM.scrollTop	= oElementDOM.offsetTop - oParentDOM.offsetHeight + oElementDOM.offsetHeight + 3;
};

// Element Render: open
cXULElement_menuitem.prototype.$getTagOpen		= function() {
	return '<tr class="xul-menuitem' + (!this.$isAccessible() ? " xul-menuitem_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') + '>\
				<td width="18"><div class="xul-menuitem-type---image' + (this.attributes["type"] ? ' xul-menuitem-type-' + this.attributes["type"] + '--image' +(this.attributes["checked"] == "true" ? ' xul-menuitem--image_checked' : '') : '') + '"' +(this.attributes["image"] ? ' style="background-image:url('+ this.attributes["image"] + ')"' : '')+ '></div></td>\
				<td nowrap="nowrap" style="white-space:nowrap;">' +(this.attributes["label"] || ' ');
};

// Element Render: open
cXULElement_menuitem.prototype.$getTagClose		= function() {
	return		'</td>\
				<td width="2"></td>\
				<td width="16"><div style="width:16px;"><br /></div></td>\
			</tr>';
};

// Register Element
ample.extend(cXULElement_menuitem);

/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_wizard	= function() {
    // Private Collections
    this._buttons   = {};   // Buttons

    // Collections
    this.wizardPages= new AMLNodeList;
};
cXULElement_wizard.prototype = new cXULWindowElement;

// Public Properties
cXULElement_wizard.prototype.currentPage	= null;

// Attributes Defaults
cXULElement_wizard.attributes	= {};
cXULElement_wizard.attributes.width		= "100%";
cXULElement_wizard.attributes.height	= "100%";

// Public Methods
cXULElement_wizard.prototype.advance = function(sId) {
    if (this.currentPage) {
    	if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "hide"))
        	return;

	    if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "advanced"))
	        return;
	}

    if (!cXULElement_wizard.dispatchEvent_onWizard(this, "next"))
        return;

    if (this.currentPage) {
    	var oPage	= sId ? this.getPage(sId) : cXULElement_wizard.getNextPage(this, this.currentPage);
        if (oPage) {
        	cXULElement_wizard.goTo(this, oPage);
        	//
            cXULElement_wizardpage.dispatchEvent_onPage(oPage, "show");
        }
    }
};

cXULElement_wizard.prototype.rewind  = function() {
    if (this.currentPage) {
    	if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "hide"))
        	return;

	    if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "rewound"))
	        return;
    }

    if (!cXULElement_wizard.dispatchEvent_onWizard(this, "back"))
        return;

    if (this.currentPage) {
    	var oPage	= cXULElement_wizard.getPrevPage(this, this.currentPage);
        if (oPage) {
        	cXULElement_wizard.goTo(this, oPage);
        	//
            cXULElement_wizardpage.dispatchEvent_onPage(oPage, "show");
        }
    }
};

cXULElement_wizard.prototype.cancel  = function() {
    if (cXULElement_wizard.dispatchEvent_onWizard(this, "cancel"))
        this.setAttribute("hidden", "true");

//	close();
};

cXULElement_wizard.prototype.finish  = function() {
    if (cXULElement_wizard.dispatchEvent_onWizard(this, "finish"))
        this.setAttribute("hidden", "true");

//	close();
};

cXULElement_wizard.prototype.goTo    = function(sId) {
	var oPage	= this.getPageById(sId);
    if (oPage)
    	cXULElement_wizard.goTo(this, oPage);
};

cXULElement_wizard.prototype.getPageById = function(sId) {
    for (var nIndex = 0; nIndex < this.wizardPages.length; nIndex++)
        if (this.wizardPages[nIndex].attributes["pageid"] == sId)
            return this.wizardPages[nIndex];

    return null;
};

cXULElement_wizard.prototype.getButton   = function(sName) {
    return this._buttons[sName];
};

cXULElement_wizard.dispatchEvent_onWizard  = function(oElement, sName) {
    var oEvent  = oElement.ownerDocument.createEvent("Events");
    oEvent.initEvent("wizard" + sName, false, true);

    return oElement.dispatchEvent(oEvent);
};

// Events Handlers
cXULElement_wizard.prototype._onButtonClick  = function(oEvent, sName) {
    if (sName == "button-back")
        this.rewind();
    else
    if (sName == "button-next")
        this.advance();
    else
    if (sName == "button-finish")
        this.finish();
    else
    if (sName == "button-cancel")
        this.cancel();
};

// Class events handlers
cXULElement_wizard.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "title":
					this.$getContainer("title").innerHTML   = oEvent.newValue || '';
					break;

				case "pagestep":
					if (this.wizardPages[oEvent.newValue])
						cXULElement_wizard.goTo(this, this.wizardPages[oEvent.newValue]);
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
//		this.$getContainer("body").style.visibility	= "hidden";
//		this.$getContainer("foot").style.visibility	= "hidden";
	}/*,
	"dragend":		function(oEvent) {
		this.$getContainer("body").style.visibility	= "";
		this.$getContainer("foot").style.visibility	= "";
	}*/
};
//cXULElement_wizard.handlers.resizestart		= cXULElement_wizard.handlers.dragstart;
//cXULElement_wizard.handlers.resizedragend	= cXULElement_wizard.handlers.dragend;

// Static methods
cXULElement_wizard.goTo	= function(oElement, oPage) {
	// Hide previous page
    if (oElement.currentPage)
    	oElement.currentPage.$getContainer().style.display	= "none";

    // Show new page
    oPage.$getContainer().style.display	= "";

	// Set header label and description
	oElement.$getContainer("label").innerHTML	= oPage.attributes["label"] || " ";
	oElement.$getContainer("description").innerHTML	= oPage.attributes["description"] || " ";
	oElement.$getContainer("header").className	= "xul-wizardheader xul-wizard--header " + (oPage.attributes["class"] || "");

	// Set buttons state
	var bNext	= cXULElement_wizard.getNextPage(oElement, oPage) != null,	// Is there next page?
		bPrev	= cXULElement_wizard.getPrevPage(oElement, oPage) != null;	// Is there prev page?
	oElement.$getContainer("button-back").disabled			= !bPrev;
	oElement.$getContainer("button-next").style.display		= bNext ? "" : "none";
	oElement.$getContainer("button-finish").style.display	= bNext ? "none" : "";

    // Set new current page
    oElement.currentPage    = oPage;
};

cXULElement_wizard.getPrevPage	= function(oElement, oPage) {
    var sId = oPage.attributes["pageid"];
	if (sId)
		for (var oNode = oElement.lastChild; oNode; oNode = oNode.previousSibling)
			if (oNode instanceof cXULElement_wizardpage && oNode.attributes["next"] == sId)
				return oNode;
	while (oPage = oPage.previousSibling)
		if (oPage instanceof cXULElement_wizardpage)
			return oPage;
	return null;
};

cXULElement_wizard.getNextPage	= function(oElement, oPage) {
    var sId = oPage.attributes["next"];
    if (sId)
		for (var oNode = oElement.firstChild; oNode; oNode = oNode.nextSibling)
			if (oNode instanceof cXULElement_wizardpage && oNode.attributes["pageid"] == sId)
				return oNode;
	while (oPage = oPage.nextSibling)
		if (oPage instanceof cXULElement_wizardpage)
			return oPage;
	return null;
};

// Element Render: open
cXULElement_wizard.prototype.$getTagOpen    = function() {
	return '<div class="xul-wizard'+(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
				(this.attributes["width"] ? 'width:' + this.attributes["width"] + 'px;' : '') +
				(this.attributes["height"] ? 'height:' + (this.attributes["height"] - 100) + 'px;' : '') +
				(this.attributes["hidden"] == "true" ? 'display:none;' : '') + '">\
				<div class="xul-wizard--head" ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<table cellpadding="0" cellspacing="0" border="0" width="100%">\
						<tbody>\
							<tr><td class="xul-wizard--title">' +(this.attributes["title"] ? this.attributes["title"] : " ")+ '</td></tr>\
						</tbody>\
					</table>\
				</div>\
				<div class="xul-wizardheader xul-wizard--header"><div class="xul-wizardheader--title xul-wizard--label"></div><div class="xul-wizardheader--description xul-wizard--description"></div></div>\
				<div class="xul-wizard--body xul-wizard--gateway">';
};

// Element Render: close
cXULElement_wizard.prototype.$getTagClose  = function() {
	return '	</div>\
				<div class="xul-wizard--foot">\
					<table cellpadding="0" cellspacing="0" border="0" height="100%" align="' +(this.attributes["buttonalign"] == "start" ? "left" : this.attributes["buttonalign"] == "center" ? "center" : "right")+ '">\
						<tbody>\
							<tr>\
								<td><button class="xul-wizard--button-back" onclick="ample.$instance(this)._onButtonClick(event, \'button-back\')" disabled="true">&lt; Back</button></td>\
								<td><button class="xul-wizard--button-next" onclick="ample.$instance(this)._onButtonClick(event, \'button-next\')" style="display:none">Next &gt;</button></td>\
								<td><button class="xul-wizard--button-finish" onclick="ample.$instance(this)._onButtonClick(event, \'button-finish\')">Finish</button></td>\
								<td width="8"><br /></td>\
								<td><button class="xul-wizard--button-cancel" onclick="ample.$instance(this)._onButtonClick(event, \'button-cancel\')">Cancel</button></td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
	    	</div>';
};

// Register Element with language
oXULNamespace.setElement("wizard", cXULElement_wizard);

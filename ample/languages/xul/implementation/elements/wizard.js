/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_wizard	= function()
{
    // Private Collections
    this._buttons   = {};   // Buttons
    this._actions   = [];   // Actions Stack

    // Collections
    this.wizardPages= new AMLNodeList;
};
cXULElement_wizard.prototype = new cXULElement;
cXULElement_wizard.prototype.currentPage	= null;
cXULElement_wizard.prototype.$draggable	= true;
cXULElement_wizard.prototype.$resizable	= true;

// Attributes Defaults
cXULElement_wizard.attributes	= {};
cXULElement_wizard.attributes.width		= "100%";
cXULElement_wizard.attributes.height	= "100%";

// Public Methods
cXULElement_wizard.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "title")
    {
        this.$getContainer("title").innerHTML   = sValue;
    }
    else
    if (sName == "pagestep")
    {
        if (this.wizardPages[sValue])
            this.goTo(this.wizardPages[sValue]);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_wizard.prototype.advance = function(sId)
{
    if (this.currentPage)
    {
    	if (!this.currentPage._fireEventOnPage("hide"))
        	return;

	    if (!this.currentPage._fireEventOnPage("advanced"))
	        return;
	}

    if (!this._fireEventOnWizard("next"))
        return;

    if (this.currentPage && (sId = sId || this.currentPage.attributes["next"]))
    {
        // Push current page into array in order to allow back-button functionality
       	this._actions.push(this.currentPage);

        this.goTo(sId);
    }
};

cXULElement_wizard.prototype.rewind  = function()
{
    if (this.currentPage)
    {
    	if (!this.currentPage._fireEventOnPage("hide"))
        	return;

	    if (!this.currentPage._fireEventOnPage("rewound"))
	        return;
    }

    if (!this._fireEventOnWizard("back"))
        return;

    var oElement    = this._actions.pop();
    if (oElement)
        this.goTo(oElement.attributes["pageid"]);
};

cXULElement_wizard.prototype.cancel  = function()
{
    if (this._fireEventOnWizard("cancel"))
        this.setAttribute("hidden", "true");

//	close();
};

cXULElement_wizard.prototype.finish  = function()
{
    if (this._fireEventOnWizard("finish"))
        this.setAttribute("hidden", "true");

//	close();
};

cXULElement_wizard.prototype.goTo    = function(sId)
{
    var oElement;
    if (oElement = this.getPageById(sId))
    {
        if (this.currentPage)
            this.currentPage.setAttribute("hidden", "true");

        this.currentPage    = oElement;

        this.currentPage.setAttribute("hidden", "false");
        this.$getContainer("label").innerHTML	= this.currentPage.attributes["label"] || " ";
        this.$getContainer("description").innerHTML	= this.currentPage.attributes["description"] || " ";

        // set buttons state
//        this._buttons["back"].setAttribute("disabled",  this.attributes["firstpage"]   == sId ? "true" :"false");
//        this._buttons["next"].setAttribute("hidden",    this.attributes["lastpage"]    == sId ? "true" :"false");
//        this._buttons["finish"].setAttribute("hidden",  this.attributes["lastpage"]    == sId ? "false": "true");

      	this.$getContainer("button-back").disabled	= this.attributes["firstpage"] == sId;
        this.$getContainer("button-next").style.display	= this.attributes["lastpage"]    == sId ? "none" :"";
        this.$getContainer("button-finish").style.display	= this.attributes["lastpage"]    == sId ? "": "none";

        this.currentPage._fireEventOnPage("show");
    }
};

cXULElement_wizard.prototype.getPageById = function(sId)
{
    for (var nIndex = 0; nIndex < this.wizardPages.length; nIndex++)
        if (this.wizardPages[nIndex].attributes["pageid"] == sId)
            return this.wizardPages[nIndex];

    return null;
};

cXULElement_wizard.prototype.getButton   = function(sName)
{
    return this._buttons[sName];
};

cXULElement_wizard.prototype._fireEventOnWizard  = function(sName)
{
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("wizard" + sName, false, true);

    return this.dispatchEvent(oEvent);
};

// Events Handlers
cXULElement_wizard.prototype._onButtonClick  = function(oEvent, sName)
{
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
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
//		this.$getContainer("body").style.visibility	= "hidden";
//		this.$getContainer("foot").style.visibility	= "hidden";
	}/*,
	"dragend":		function(oEvent) {
		this.$getContainer("body").style.visibility	= "";
		this.$getContainer("foot").style.visibility	= "";
	}*/,
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (!this.currentPage && this.firstChild)
			this.goTo(this.firstChild.attributes["pageid"]);
	}
};
//cXULElement_wizard.handlers.resizestart		= cXULElement_wizard.handlers.dragstart;
//cXULElement_wizard.handlers.resizedragend	= cXULElement_wizard.handlers.dragend;

// Element Render: open
cXULElement_wizard.prototype.$getTagOpen    = function()
{
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
cXULElement_wizard.prototype.$getTagClose  = function()
{
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

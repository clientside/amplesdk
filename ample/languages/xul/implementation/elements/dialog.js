/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_dialog	= function(){};
cXULElement_dialog.prototype	= new cXULElement;
cXULElement_dialog.prototype.$draggable	= true;
cXULElement_dialog.prototype.$resizable	= true;

// Attributes Defaults
cXULElement_dialog.attributes	= {};
cXULElement_dialog.attributes.orient	= "vertical";
cXULElement_dialog.attributes.buttons	= "accept" + "," + "cancel";
cXULElement_dialog.attributes.width		= "100%";
cXULElement_dialog.attributes.height	= "100%";

// Public Methods
cXULElement_dialog.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "title")
    {
        this.$getContainer("title").innerHTML = sValue;
    }
    else
    if (sName == "buttons")
    {
        this.$getContainer("button-help").style.display      = sValue.indexOf("help")    ==-1 ? "none" : "";
        this.$getContainer("button-cancel").style.display    = sValue.indexOf("cancel")  ==-1 ? "none" : "";
        this.$getContainer("button-accept").style.display    = sValue.indexOf("accept")  ==-1 ? "none" : "";
    }
    else
    if (sName == "buttonalign")
    {
        if (sValue == "start")
            this.$getContainer("foot").align  = "left";
        else
        if (sValue == "center")
            this.$getContainer("foot").align  = sValue;
        else
            this.$getContainer("foot").align  = "right";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_dialog.prototype.acceptDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogaccept", false, true);
    if (this.dispatchEvent(oEvent2))
        this.setAttribute("hidden", "true");
};

cXULElement_dialog.prototype.cancelDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogcancel", false, true);
    if (this.dispatchEvent(oEvent2))
        this.setAttribute("hidden", "true");
};

cXULElement_dialog.prototype.centerWindowOnScreen    = function()
{
	var oElementDOM	= this.$getContainer(),
    	oPosition	= this.getBoundingClientRect();
	oElementDOM.style.left	=(document.body.clientWidth - oPosition.right + oPosition.left) / 2;
	oElementDOM.style.top	=(document.body.clientHeight - oPosition.bottom + oPosition.top) / 2;
};

// Events Handlers
cXULElement_dialog.prototype._onButtonClick  = function(oEvent, sName)
{
    if (sName == "button-accept")
    {
        this.acceptDialog();
    }
    else
    if (sName == "button-cancel")
    {
        this.cancelDialog();
    }
    else
    if (sName == "button-help")
    {
        var oEvent2    = this.ownerDocument.createEvent("Events");
        oEvent2.initEvent("dialoghelp", false, true);
        this.dispatchEvent(oEvent2);
    }
};

// Class Events Handlers
cXULElement_dialog.handlers	= {
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
/*
		this.$getContainer("body").style.visibility	= "hidden";
		this.$getContainer("foot").style.visibility	= "hidden";*/
	}/*,
	"dragend":		function(oEvent) {
		this.$getContainer("body").style.visibility	= "";
		this.$getContainer("foot").style.visibility	= "";
	}*/
};
//cXULElement_dialog.handlers.resizestart	= cXULElement_dialog.handlers.dragstart;
//cXULElement_dialog.handlers.resizedragend	= cXULElement_dialog.handlers.dragend;

// Element Renders
cXULElement_dialog.prototype.$getTagOpen	= function()
{
	return '<table class="xul-dialog'+(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0"' +
				(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '') +
				(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '') +
				(this.attributes["hidden"] == "true" ? ' style="display:none;"' : '') + '>\
				<thead ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<tr>\
						<th class="xul-dialog--head" height="1">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%">\
								<tbody>\
									<tr>\
										<td class="xul-dialog--title">' +(this.attributes["title"] || " ")+ '</td>\
									</tr>\
								</tbody>\
							</table>\
						</th>\
					</tr>\
				</thead>\
				<tbody>\
					<tr>\
						<td class="xul-dialog--body">';
};

// Element Render: close
cXULElement_dialog.prototype.$getTagClose	= function()
{
	return 				'</td>\
					</tr>\
				</tbody>\
				<tfoot>\
					<tr>\
						<td class="xul-dialog--foot" align="' +(this.attributes["buttonalign"] == "start" ? "left" : this.attributes["buttonalign"] == "center" ? "center" : "right")+ '">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%">\
								<tbody>\
									<tr>\
										<td width="100%"><button class="xul-dialog--button-help" style="' +(this.attributes["buttons"].indexOf("help") ==-1 ? 'display:none;' : '')+ '" onclick="ample.$instance(this)._onButtonClick(event, \'button-help\')">Help</button></td>\
										<td><button class="xul-dialog--button-accept" style="' +(this.attributes["buttons"].indexOf("accept") ==-1 ? 'display:none;' : '')+ '" onclick="ample.$instance(this)._onButtonClick(event, \'button-accept\')">OK</button></td>\
										<td><button class="xul-dialog--button-cancel" style="' +(this.attributes["buttons"].indexOf("cancel") ==-1 ? 'display:none;' : '')+ '" onclick="ample.$instance(this)._onButtonClick(event, \'button-cancel\')">Cancel</button></td>\
									</tr>\
								</tbody>\
							</table>\
						</td>\
					</tr>\
				</tfoot>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("dialog", cXULElement_dialog);

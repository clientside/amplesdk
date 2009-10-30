/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_sound	= function(){};
cAMLElement_sound.prototype	= new cAMLElement;

// Public Methods
cAMLElement_sound.prototype.setAttribute	= function(sName, sValue)
{
	if (sName == "src")
		this.$getContainer().FileName	= sValue;
	else
	if (sName == "autostart")
		this.$getContainer().AutoStart	= sValue == "true";

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_sound.prototype.play	= function()
{
	this.$getContainer().CurrentPosition  = 0;
	if (this.$getContainer().OpenState == 6)
		this.$getContainer().Play();
};

cAMLElement_sound.prototype.stop	= function()
{
	if (this.$getContainer().OpenState == 6)
		this.$getContainer().Stop();
};

// Class Event Handlers
cAMLElement_sound.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("src")) {
			var oSelf	= this;
			window.setTimeout(function() {
				oSelf.setAttribute("src", oSelf.getAttribute("src"));
			});
		}
//		;ample.$instance(this).setAttribute("' + "autostart" + '", "' + this.getAttribute("autostart") + '");', 0);
	}
};

// Element Render: open
cAMLElement_sound.prototype.$getTagOpen	= function()
{
	return '<object classid="' + "clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" + '" style="' + "display:none" + '"><param name="' + "AutoStart" + '" value="false"/></object>';
};

// Register Element with language
oAMLNamespace.setElement("sound", cAMLElement_sound);

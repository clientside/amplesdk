/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_timer	= function(){};
cAMLElement_timer.prototype	= new cAMLElement;

// Private Properties
cAMLElement_timer.prototype._interval	= null;
cAMLElement_timer.prototype._timeout	= null;

// Public Methods
cAMLElement_timer.prototype.setAttribute	= function(sName, sValue)
{
	switch (sName)
	{
		case "interval":
			break;

		case "timeout":
			break;
	}

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_timer.prototype.start	= function()
{
    var oSelf	= this;
	// Set interval
	var nInterval	= window.parseInt(this.getAttribute("interval"));
	if (!window.isNaN(nInterval))
		this._interval	= window.setInterval(function() {
			oSelf._onInterval();
		}, nInterval);
	// Set timeout
	var nTimeout	= window.parseInt(this.getAttribute("timeout"));
	if (!window.isNaN(nTimeout))
		this._timeout	= window.setTimeout(function() {
			oSelf._onTimeOut();
		}, nTimeout);
};

cAMLElement_timer.prototype.stop		= function()
{
	if (this._interval)
		this._interval	= window.clearInterval(this._interval);
	if (this._timeout)
		this._timeout	= window.clearTimeout(this._timeout);
};

// Private Methods
cAMLElement_timer.prototype._onInterval	= function()
{
	var oEvent	= this.ownerDocument.createEvent("Events");
	oEvent.initEvent("interval", false, false);
	this.dispatchEvent(oEvent);
};

cAMLElement_timer.prototype._onTimeOut	= function()
{
	var oEvent	= this.ownerDocument.createEvent("Events");
	oEvent.initEvent("timeout", false, false);
	this.dispatchEvent(oEvent);
};

// Class Event Handlers
cAMLElement_timer.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("autostart") == "true")
			this.start();
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.stop();
	}
};

// Register Element with language
oAMLNamespace.setElement("timer", cAMLElement_timer);

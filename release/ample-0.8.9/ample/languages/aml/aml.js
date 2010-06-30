/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

(function () {


var oAMLNamespace	= new AMLNamespace;

ample.domConfig.setNamespace("http://www.amplesdk.com/ns/aml", oAMLNamespace);



var cAMLElement	= function(){};
cAMLElement.prototype	= new AMLElement;
cAMLElement.prototype.AMLElement	= new AMLElement;

oAMLNamespace.setElement("#element", cAMLElement);



var cAMLAttr_draggable	= function(){};

cAMLAttr_draggable.prototype	= new AMLAttr;

cAMLAttr_draggable.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$draggable	= this.value == "true";
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$draggable	= false;
	}
};

oAMLNamespace.setAttribute("draggable", cAMLAttr_draggable);



var cAMLAttr_droppable	= function(){};

cAMLAttr_droppable.prototype	= new AMLAttr;

cAMLAttr_droppable.handlers		= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$droppable	= this.value == "true";
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$droppable	= false;
	}
};

oAMLNamespace.setAttribute("droppable", cAMLAttr_droppable);



var cAMLAttr_resizable	= function(){};

cAMLAttr_resizable.prototype	= new AMLAttr;

cAMLAttr_resizable.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$resizable	= this.value == "true";
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$resizable	= false;
	}
};

oAMLNamespace.setAttribute("resizable", cAMLAttr_resizable);



var cAMLAttr_resize_edges	= function(){};

cAMLAttr_resize_edges.prototype	= new AMLAttr;

cAMLAttr_resize_edges.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var aValue	= this.value.split(' ');
		this.ownerElement.$resizeEdges	=	(aValue.indexOf("top")		>-1 ? 1 : 0) +
											(aValue.indexOf("right")	>-1 ? 2 : 0) +
											(aValue.indexOf("bottom")	>-1 ? 4 : 0) +
											(aValue.indexOf("left")		>-1 ? 8 : 0);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$resizeEdges	= 0;
	}
};

oAMLNamespace.setAttribute("resize-edges", cAMLAttr_resize_edges);



var cAMLAttr_selectable	= function(){};

cAMLAttr_selectable.prototype	= new AMLAttr;

cAMLAttr_selectable.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.ownerElement.$selectable	= this.value == "true" ? true : this.value == "false" ? false : null;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.ownerElement.$selectable	= null;
	}
};

oAMLNamespace.setAttribute("selectable", cAMLAttr_selectable);



var cAMLElement_data	= function()
{
	this.customers	= new AMLNodeList;
};
cAMLElement_data.prototype	= new cAMLElement;

cAMLElement_data.prototype.customers	= null;

cAMLElement_data.prototype.setAttribute	= function(sName, sValue)
{
	switch (sName)
	{
		case "src":
			this.load(sValue, this.getAttribute("async") != "false");
			break;

		case "type":
			throw new AMLException(AMLException.NOT_SUPPORTED_ERR);
	}

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_data.prototype.load	= function(sUrl, bAsync)
{
		if (this.hasChildNodes())
	{
				var oEvent	= this.ownerDocument.createEvent("Events");
		oEvent.initEvent("unload", false, false);
		this.dispatchEvent(oEvent);

				while (this.firstChild)
			this.removeChild(this.firstChild);
	}

	var oRequest	= new window.XMLHttpRequest;
	var oElement	= this;
	function fOnLoad()
	{
		if (oRequest.responseXML && oRequest.responseXML.documentElement && oRequest.responseXML.documentElement.localName != "parsererror")
		{
						oElement.appendChild(oElement.ownerDocument.importNode(oRequest.responseXML.documentElement, true));

						var oEvent	= oElement.ownerDocument.createEvent("Events");
			oEvent.initEvent("load", false, false);
			oElement.dispatchEvent(oEvent);
		}
		else
		{
						var oEvent	= oElement.ownerDocument.createEvent("Events");
			oEvent.initEvent("error", true, false);
			oElement.dispatchEvent(oEvent);
		}
	};

		oRequest.open("GET", sUrl, bAsync);
	if (bAsync) {
		oRequest.onreadystatechange	= function() {
			if (oRequest.readyState == 4) {
								fOnLoad();
								oRequest.onreadystatechange	= new window.Function;
			}
		};
	}
	oRequest.send(null);
	if (!bAsync)
		fOnLoad();
};

cAMLElement_data.prototype.register	= function(oElement)
{
	this.customers.$add(oElement);
};

cAMLElement_data.prototype.unregister	= function(oElement)
{
	this.customers.$remove(oElement);
};

cAMLElement_data.prototype.notify	= function()
{
	for (var nIndex = 0; nIndex < this.customers.length; nIndex++)
		this.customers[nIndex].refresh();
};

cAMLElement_data.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("src"))
			this.load(this.getAttribute("src"), this.getAttribute("async") != "false");
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
				for (var nIndex = 0; nIndex < this.customers.length; nIndex++)
			this.customers[nIndex].unbind();
	},
		"DOMNodeInserted":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	},
	"DOMCharacterDataModified":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	},
	"DOMAttrModified":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	}
};
cAMLElement_data.prototype.$getTag	= function()
{
	return "";
};

oAMLNamespace.setElement("data", cAMLElement_data);



var cAMLElement_filepicker	= function(){};
cAMLElement_filepicker.prototype = new cAMLElement;
cAMLElement_filepicker.prototype.tabIndex	= 0;

cAMLElement_filepicker.prototype.$isAccessible	= function()
{
	return !this.getAttribute("disabled");
};

cAMLElement_filepicker.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "disabled")
    {
	   	var oElementDOM	= this.$getContainer();
    	oElementDOM.className   = oElementDOM.className.replace(sValue == "true" ? "normal" : "disabled", sValue == "true" ? "disabled" : "normal");
        this.$getContainer("input").disabled =(sValue == "true");
	}

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_filepicker.prototype._onChange   = function(oEvent)
{
    this.attributes["value"]   = this.$getContainer("input").value;

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", true, false);
    this.dispatchEvent(oEvent);
};

cAMLElement_filepicker.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

cAMLElement_filepicker.prototype.$getTagOpen	= function()
{
    return '<span class="aml-filepicker"><input type="file" class="aml-filepicker--input"' +(this.attributes["disabled"] ? ' disabled="true"' : '')+ ' style="padding-left:3px;" onselectstart="event.cancelBubble=true;" />';
};

cAMLElement_filepicker.prototype.$getTagClose	= function()
{
    return '</span>';
};

oAMLNamespace.setElement("filepicker", cAMLElement_filepicker);



var cAMLElement_handler	= function(){};
cAMLElement_handler.prototype	= new cAMLElement;

cAMLElement_handler.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.firstChild)
		{
			if (this.getAttribute("event"))
				this.parentNode.addEventListener(this.getAttribute("event"), new window.Function("event", this.firstChild.nodeValue), this.getAttribute("phase") == "capture");
			else {
				var oElement	= window.document.createElement("script");
				oElement.type	= "text/javascript";
				oElement.text	= this.firstChild.nodeValue;
				window.document.getElementsByTagName("head")[0].appendChild(oElement);
				oElement.parentNode.removeChild(oElement);
			}
		}
	}
};

cAMLElement_handler.prototype.$getTag	= function(){return ''};

oAMLNamespace.setElement("handler", cAMLElement_handler);



var cAMLElement_map	= function(){};
cAMLElement_map.prototype	= new cAMLElement;


cAMLElement_map.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "longitude")
    {
		var oCenter	= new GLatLng(sValue * 1, this.getAttribute("latitude") * 1);
		this.object.panTo(oCenter);
    }
    else
    if (sName == "latitude")
    {
		var oCenter	= new GLatLng(this.getAttribute("longitude") * 1, sValue * 1);
		this.object.panTo(oCenter);
    }
    else
    if (sName == "altitude")
    {
		this.object.setZoom(sValue * 1);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_map.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (window.GMap) {
			this.object	= new GMap(this.$getContainer());
			var oCenter	= new GLatLng(this.getAttribute("longitude") * 1, this.getAttribute("latitude") * 1);
			this.object.setCenter(oCenter, this.getAttribute("altitude") * 1);
		}
		else {
			this.$getContainer().innerHTML	= "Google Maps API was not loaded";
		}
	}
};

cAMLElement_map.prototype.$getTagOpen	= function()
{
	return '<div' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') + '>';
};

cAMLElement_map.prototype.$getTagClose	= function()
{
    return '</div>';
};

oAMLNamespace.setElement("map", cAMLElement_map);



var cAMLElement_marker	= function(){};
cAMLElement_marker.prototype	= new cAMLElement;

cAMLElement_marker.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "longitude")
    {
		var oPoint	= new GLatLng(sValue * 1, this.getAttribute("latitude") * 1);
		this.object.setPoint(oPoint);
    }
    else
    if (sName == "latitude")
    {
		var oPoint	= new GLatLng(this.getAttribute("longitude") * 1, sValue * 1);
		this.object.setPoint(oPoint);
    }
    else
    if (sName == "image")
    {
		this.object.setImage(sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_marker.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (window.GMap) {
			if (this.parentNode instanceof cAMLElement_map) {
				var oPoint	= new GLatLng(this.getAttribute("longitude") * 1, this.getAttribute("latitude") * 1);
				this.object	= new GMarker(oPoint);
				this.parentNode.object.addOverlay(this.object);
				var sImage	= this.getAttribute("image");
				if (sImage)
					this.object.setImage(sImage);
			}
		}
	}
};

oAMLNamespace.setElement("marker", cAMLElement_marker);



var cAMLElement_pager	= function(){};
cAMLElement_pager.prototype  = new cAMLElement;

cAMLElement_pager.attributes	= {
	pagestep:		"1",
	pagesamount:	"10"
};

cAMLElement_pager.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "pagestep")
    {
        if (!window.isNaN(sValue))
            this.goTo(sValue);
    }
    else
    if (sName == "pagesamount")
    {

    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_pager.prototype.goTo     = function(nIndex)
{
    if (nIndex * 1 < this.attributes["pagesamount"] * 1 && nIndex * 1 >= 0)
    {
                var oElement	= this.$getContainer("body");
        oElement.tBodies[0].rows[0].cells[this.attributes["pagestep"]].className    = oElement.tBodies[0].rows[0].cells[this.attributes["pagestep"]].className.replace("selected", "normal");
        oElement.tBodies[0].rows[0].cells[nIndex].className  = oElement.tBodies[0].rows[0].cells[nIndex].className.replace(/normal|hover|active/, "selected");

        this.attributes["pagestep"]    = nIndex;
    }

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", true, false);
    this.dispatchEvent(oEvent);
};

cAMLElement_pager.prototype._onItemClick     = function(oEvent, nIndex)
{
    this.goTo(nIndex);
};

cAMLElement_pager.prototype._onButtonClick   = function(oEvent, sButtonType)
{
    if (sButtonType == "next")
    {
        if (this.attributes["pagestep"] * 1 + 1 < this.attributes["pagesamount"] * 1)
            this.goTo(this.attributes["pagestep"] * 1 + 1);
    }
    else
    if (sButtonType == "back")
    {
        if (this.attributes["pagestep"] * 1 - 1 >= 0)
            this.goTo(this.attributes["pagestep"] * 1 - 1);
    }
};

cAMLElement_pager.prototype.$getTagOpen	= function()
{
    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0" class="aml-pager">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td width="1">Page:</td>';
    sHtml  += '<td>';
    sHtml  += '<table cellpadding="0" cellspacing="0" border="0" height="100%" class="aml-pager--body">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    for (var nIndex = 0; nIndex < this.attributes["pagesamount"] * 1; nIndex++)
        sHtml  += '<td class="aml-pager-item" onmouseover="this.className=this.className.replace(\'normal\', \'hover\');" onmouseout="this.className=this.className.replace(\'hover\', \'normal\');" onmousedown="this.className=this.className.replace(\'hover\', \'active\');" onmouseup="this.className=this.className.replace(\'active\', \'hover\');" onclick="ample.$instance(this)._onItemClick(event, this.cellIndex)">' + nIndex + '</td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';
    sHtml  += '</td>';
    sHtml  += '<td width="1" class="aml-pager-item" onclick="ample.$instance(this)._onButtonClick(event, \'back\')">&lt;&lt;</td>';
    sHtml  += '<td width="1" class="aml-pager-item" onclick="ample.$instance(this)._onButtonClick(event, \'next\')">&gt;&gt;</td>';
    sHtml  += '<td> </td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

oAMLNamespace.setElement("pager", cAMLElement_pager);



var cAMLElement_panel	= function(){};
cAMLElement_panel.prototype	= new cAMLElement;

cAMLElement_panel.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "collapsed":
					break;
			}
		}
	}
};

cAMLElement_panel.prototype.toggle	= function() {
	this.setAttribute("collapsed", this.getAttribute("collapsed") == "true" ? "false" : "true");
};

cAMLElement_panel.prototype.$getTagOpen	= function() {
	return '<div class="aml-panel"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<div class="aml-panel--head">\
					<div class="aml-panel--icon"><br /></div>\
					<div class="aml-panel--label">' + this.getAttribute("label")+ '</div>\
				</div>\
				<div class="aml-panel--gateway">';
};

cAMLElement_panel.prototype.$getTagClose	= function() {
    return '	</div>\
    		</div>';
};

oAMLNamespace.setElement("panel", cAMLElement_panel);



var cAMLElement_panelset	= function(){};
cAMLElement_panelset.prototype	= new cAMLElement;

cAMLElement_panelset.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "cols":
				case "rows":
					this.refresh();
					break;
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.refresh();
				var that	= this;
		this.ownerDocument.addEventListener("resize", function() {
			that.refresh();
		}, false);
	}
};

cAMLElement_panelset.prototype.refresh	= function() {
	var aSize	= [],
		nFlex	= 0,
		nSize	= 0,
		nPanelsetSize	= 0,
		bVertical	= false,
		oElement;
	if (this.hasAttribute("rows")) {
		aSize	= this.getAttribute("rows").replace(/^\s+|\s+$/g, '').split(/\s+/);
		nPanelsetSize	= this.$getContainer().offsetHeight;
		bVertical	= true;
	}
	else
	if (this.hasAttribute("cols")) {
		aSize	= this.getAttribute("cols").replace(/^\s+|\s+$/g, '').split(/\s+/);
		nPanelsetSize	= this.$getContainer().offsetWidth;
		bVertical	= false;
	}

		for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++) {
		if (aSize[nIndex].match(/(\d*)\*/))
			nFlex	+=(RegExp.$1 || 1)* 1;
		else {
			oElement	= this.childNodes[nIndex].$getContainer();
			oElement.style[bVertical ? "height" : "width"]	= aSize[nIndex];
			nSize	+= oElement[bVertical ? "offsetHeight" : "offsetWidth"];
		}
	}
		for (var nIndex = 0, nOffset = 0; nIndex < this.childNodes.length; nIndex++) {
		if (aSize[nIndex].match(/(\d*)\*/))
			this.childNodes[nIndex].$getContainer().style[bVertical ? "height" : "width"]	= Math.floor((nPanelsetSize - nSize)*(RegExp.$1 || 1)/ nFlex - 2)+ "px";
	}
};

cAMLElement_panelset.prototype.$getTagOpen	= function()
{
	return '<div class="aml-panelset' + (this.hasAttribute("rows") ? ' aml-panelset-rows-' : this.hasAttribute("cols") ? ' aml-panelset-cols-' : '')+ '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') + '>';
};

cAMLElement_panelset.prototype.$getTagClose	= function()
{
    return 	'</div>';
};

oAMLNamespace.setElement("panelset", cAMLElement_panelset);



var cAMLElement_repeater	= function(){};
cAMLElement_repeater.prototype	= new cAMLElement;

cAMLElement_repeater.prototype.data	= null;

cAMLElement_repeater.prototype._timeout	= null;

cAMLElement_repeater.prototype.setAttribute	= function(sName, sValue)
{
	if (sName == "data")
	{
		if (sValue != this.attributes[sName])
			this.bind(sValue);
	}
	else
	if (sName == "select")
	{
	}
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_repeater.prototype.$getTag	= function()
{
	return "";
};

cAMLElement_repeater.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oElement	= this.ownerDocument.getElementById(this.getAttribute("data"));
		if (oElement)
		{
			this.bind(oElement);
						this.refresh();
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.unbind();
	}
};

cAMLElement_repeater.prototype.bind	= function(oElement)
{
	if (this.data && this.data != oElement)
		this.unbind();
	else
	{
		this.data	= oElement;
		this.data.register(this);
	}
};

cAMLElement_repeater.prototype.unbind	= function()
{
	if (this.data)
	{
		this.data.unregister(this);
		this.data	= null;
	}
};

cAMLElement_repeater.prototype.refresh	= function()
{
		if (this._timeout)
		return;

		var self	= this;
	this._timeout	= setTimeout(function() {
				self._timeout	= null;
		self.repeat();
	});
};

cAMLElement_repeater.prototype.repeat	= function()
{
	if (this.data) {
		var aElements, nIndex, oElement;

				aElements	= this.parentNode.childNodes;
		for (nIndex = 0; oElement = aElements[nIndex]; nIndex++)
			if (oElement.dataIndex)
				oElement.parentNode.removeChild(oElement) && nIndex--;

				var oContext	= this,
			oContextCache	= {},
			fResolver	= function (sPrefix) {
				return sPrefix in oContextCache ? oContextCache[sPrefix] : oContextCache[sPrefix] = oContext.lookupNamespaceURI(sPrefix);
			};
		aElements	= this.data.querySelectorAll(this.getAttribute("select"), fResolver);
		for (nIndex = 0; nIndex < aElements.length; nIndex++)
			this.parentNode.insertBefore(
				cAMLElement_repeater._processNode(
					this.firstChild.cloneNode(true),
					aElements[nIndex],
					fResolver),
				this).dataIndex	= nIndex + 1;
	}
};

cAMLElement_repeater._regexp	= /(\{([^\}]+)\})/g;

cAMLElement_repeater._processNode	= function(oElement, oData, fResolver)
{
	var oNode, sName;
	for (var nIndex = 0; nIndex < oElement.childNodes.length; nIndex++)
	{
		oNode	= oElement.childNodes[nIndex];
		switch (oNode.nodeType)
		{
			case AMLNode.ELEMENT_NODE:
				for (sName in oNode.attributes)
					if (oNode.attributes[sName].match(cAMLElement_repeater._regexp))
						oNode.attributes[sName]	= oNode.attributes[sName].replace(RegExp.$1, cAMLElement_repeater._resolveValue(RegExp.$2, oData, fResolver));
				cAMLElement_repeater._processNode(oNode, oData, fResolver);
				break;

			case AMLNode.TEXT_NODE:
			case AMLNode.CDATA_SECTION:
				if (oNode.data.match(cAMLElement_repeater._regexp))
				{
					oNode.data	= oNode.data.replace(RegExp.$1, cAMLElement_repeater._resolveValue(RegExp.$2, oData, fResolver));
					oNode.nodeValue	= oNode.data;
					oNode.length= oNode.data.length;
				}
		}
	}
	return oElement;
};

cAMLElement_repeater._resolveValue	= function(sQuery, oData, fResolver)
{
	var oElement	= oData.querySelector(sQuery, fResolver);
	return oElement && oElement.firstChild ? oElement.firstChild.data : '';
};

oAMLNamespace.setElement("repeater", cAMLElement_repeater);



var cAMLElement_sidebar	= function(){};
cAMLElement_sidebar.prototype	= new cAMLElement;

cAMLElement_sidebar.prototype.toggle	= function(bState)
{
	var oContainer	= this.$getContainer(),
		oStyle		= oContainer.style;
		var oPositionOld	= this.ownerDocument.$getContainerPosition(oContainer);
	oStyle.width	= "";
	oStyle.height	= "";
		this.$setPseudoClass("hover", bState || false);
		var oPositionNew	= this.ownerDocument.$getContainerPosition(oContainer);
	oStyle.width	= oPositionOld.width + "px";
	oStyle.height	= oPositionOld.height + "px";
		this.$play("width:" + oPositionNew.width + "px; height:" + oPositionNew.height + "px;", 500, AMLElement.EFFECT_ACCELERATE);
};

cAMLElement_sidebar.handlers	= {
	"mouseenter":	function(oEvent) {
		this.toggle(true);
	},
	"mouseleave":	function(oEvent) {
		this.toggle(false);
	}
};

cAMLElement_sidebar.prototype.$getTagOpen	= function()
{
	var sHtml	= '<div' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') + ' class="aml-sidebar';
	sHtml  +=(this.attributes["class"] ? " " + "aml-sidebar-" + this.attributes["class"] : '') + '">';

	return sHtml;
};

cAMLElement_sidebar.prototype.$getTagClose	= function()
{
    return '</div>';
};

oAMLNamespace.setElement("sidebar", cAMLElement_sidebar);



var cAMLElement_sound	= function(){};
cAMLElement_sound.prototype	= new cAMLElement;

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

cAMLElement_sound.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("src")) {
			var oSelf	= this;
			window.setTimeout(function() {
				oSelf.setAttribute("src", oSelf.getAttribute("src"));
			});
		}
	}
};

cAMLElement_sound.prototype.$getTagOpen	= function()
{
	return '<object classid="' + "clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" + '" style="' + "display:none" + '"><param name="' + "AutoStart" + '" value="false"/></object>';
};

oAMLNamespace.setElement("sound", cAMLElement_sound);



var cAMLElement_timer	= function(){};
cAMLElement_timer.prototype	= new cAMLElement;

cAMLElement_timer.prototype._interval	= null;
cAMLElement_timer.prototype._timeout	= null;

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
		var nInterval	= window.parseInt(this.getAttribute("interval"));
	if (!window.isNaN(nInterval))
		this._interval	= window.setInterval(function() {
			oSelf._onInterval();
		}, nInterval);
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

cAMLElement_timer.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("autostart") == "true")
			this.start();
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.stop();
	}
};

oAMLNamespace.setElement("timer", cAMLElement_timer);



var cAMLElement_xhtml	= function(){};
cAMLElement_xhtml.prototype	= new cAMLElement;

cAMLElement_xhtml.prototype.innerHTML	= null;

cAMLElement_xhtml.prototype.$getTag	= function()
{
	return this.innerHTML;
};

oAMLNamespace.setElement("xhtml", cAMLElement_xhtml);


})()

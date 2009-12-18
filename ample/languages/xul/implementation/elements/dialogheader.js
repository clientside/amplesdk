/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_dialogheader	= function(){};
cXULElement_dialogheader.prototype	= new cXULElement;

// Attributes Defaults
cXULElement_dialogheader.attributes	= {};
cXULElement_dialogheader.attributes.height	= "1";

// Public Methods
cXULElement_dialogheader.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "title")
        this.$getContainer("title").innerHTML = sValue || " ";
    else
    if (sName == "description")
        this.$getContainer("description").innerHTML = sValue || " ";
    else
        this._setAttribute(sName, sValue);

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Element Renders
cXULElement_dialogheader.prototype.$getTagOpen	= function()
{
	return '<table cellpadding="0" cellspacing="0" border="0" width="100%">\
				<tbody>\
					<tr><td valign="top" class="xul-dialogheader"><div class="xul-dialogheader--title">' +(this.attributes["title"] || " ")+ '</div><div class="xul-dialogheader--description">' +(this.attributes["description"] || " ")+ '</div></td></tr>\
				</tbody>\
			</table>';
};

// Register Element with language
oXULNamespace.setElement("dialogheader", cXULElement_dialogheader);

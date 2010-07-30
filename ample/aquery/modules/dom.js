/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Attributes (get/set)
aQuery.extend("attr", function(vArgument1, vArgument2) {
	if (arguments.length > 1)
		this.each(function() {
			this.setAttribute(vArgument1, vArgument2);
		});
	else
	if (this.length)
		return this[0].getAttribute(vArgument1);
	return this;
});

// Text (get/set)
aQuery.extend("text", function(vArgument1) {
	if (arguments.length > 0) {
		// Replace children with a text node
		this.each(function() {
			while (this.lastChild)
				this.removeChild(this.lastChild);
			// Add child
			this.appendChild(this.ownerDocument.createTextNode(vArgument1));
		});
	}
	else {
		// Get inner text
		var aText	= [];
		this.each(function(){
			(function fText(oNode) {
				for (; oNode; oNode = oNode.nextSibling)
					if (oNode instanceof AMLCharacterData)
						aText.push(oNode.data);
					else
					if (oNode instanceof AMLElement && oNode.hasChildNodes())
						aText.push(fText(oNode.firstChild));
			})(this);
		});
		return aText.join('');
	}
	return this;
});

// Structure
//
aQuery.extend("appendTo", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		oQuery.each(function() {
			var oParent	= this;
			that.each(function() {
				oParent.appendChild(this.cloneNode(true));
			});
		});
	}
	return this;
});

aQuery.extend("prependTo", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		oQuery.each(function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			that.each(function() {
				oParent.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("insertBefore", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		oQuery.each(function() {
			var oNode	= this,
				oBefore	= this;
			that.each(function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("insertAfter", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		oQuery.each(function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			that.each(function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("replaceAll", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		var that	= this;
		oQuery.each(function() {
			var oNode	= this,
				oBefore	= this;
			that.each(function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
			this.parentNode.removeChild(this);
		});
	}
	return this;
});

//
aQuery.extend("append", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		this.each(function() {
			var oParent	= this;
			oQuery.each(function() {
				oParent.appendChild(this.cloneNode(true));
			});
		});
	}
	return this;
});

aQuery.extend("prepend", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		this.each(function() {
			var oParent	= this,
				oBefore	= this.firstChild;
			oQuery.each(function() {
				oParent.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("before", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		this.each(function() {
			var oNode	= this,
				oBefore	= this;
			oQuery.each(function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

aQuery.extend("after", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		this.each(function() {
			var oNode	= this,
				oBefore	= this.nextSibling;
			oQuery.each(function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
		});
	}
	return this;
});

//
aQuery.extend("remove", function(vArgument1) {
	this.each(function() {
		this.parentNode.removeChild(this);
	});
	return this;
});

aQuery.extend("empty", function() {
	this.each(function() {
		while (this.lastChild)
			this.removeChild(this.lastChild);
	});
	return this;
});

//
aQuery.extend("replaceWith", function(vArgument1) {
	if (this.length) {
		//
		var oQuery	= vArgument1;
		if (!(oQuery instanceof aQuery))
			oQuery	= aQuery(oQuery);
		//
		this.each(function() {
			var oNode	= this,
				oBefore	= this;
			oQuery.each(function() {
				oNode.parentNode.insertBefore(this.cloneNode(true), oBefore);
			});
			this.parentNode.removeChild(this);
		});
	}
	return this;
});

//
aQuery.extend("clone", function() {
	var oQuery	= aQuery();
	this.each(function() {
		oQuery[oQuery.length++]	= this.cloneNode(true);
	});
	return oQuery;
});
/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// component constructor
var cXULElement_datepicker_pane	= function() {
	var oDate	= new Date();
	this.current	= new Date(oDate.getFullYear(), oDate.getMonth(), 1);
	//
	var that	= this;
	this.contentFragment	= ample.createDocumentFragment();
	// Month select
	this._elementMonth	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:menulist"));
	this._elementMonth.appendChild(ample.createElementNS(this.namespaceURI, "xul:menupopup"));
	this._elementMonth.tabIndex	=-1;
	this._elementMonth.addEventListener("change", function(oEvent) {
		that.doSelectMonth(this.items[this.selectedIndex].getAttribute("value"));
		// Stop propagation
		oEvent.stopPropagation();
	}, false);
	// months names
	for (var nIndex = 0, oElement; nIndex < 12; nIndex++) {
		oElement	= this._elementMonth.firstChild.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
		oElement.setAttribute("value", nIndex);
		oElement.setAttribute("label", ample.locale.culture.calendar.months.names[nIndex]);
	}
	// Year spinner
	this._elementYear	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:textbox"));
	this._elementYear.setAttribute("type", "number");
	this._elementYear.tabIndex	=-1;
	this._elementYear.setAttribute("max", Infinity);
	this._elementYear.addEventListener("change", function(oEvent) {
		that.doSelectYear(this.getAttribute("value"));
		// Stop propagation
		oEvent.stopPropagation();
	}, false);
};

// component prototype
cXULElement_datepicker_pane.prototype	= new cXULPopupElement("datepicker-pane");

// Pubic properties (read-only)
cXULElement_datepicker_pane.prototype.current= null;	// this is set by constructor
cXULElement_datepicker_pane.prototype.value	= null;
cXULElement_datepicker_pane.prototype.min	= null;
cXULElement_datepicker_pane.prototype.max	= null;

// Public methods
cXULElement_datepicker_pane.prototype.show	= function(nLeft, nTop) {
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("shown", false, true, null);
	if (this.dispatchEvent(oEvent)) {
		var oStyle	= this.$getContainer().style;
		oStyle.position	= "absolute";
		if (arguments.length > 0)
			oStyle.left	= nLeft + "px";
		if (arguments.length > 1)
			oStyle.top	= nTop + "px";
		oStyle.display	= "";
	}
};

cXULElement_datepicker_pane.prototype.hide	= function() {
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("hidden", false, true, null);
	if (this.dispatchEvent(oEvent))
		this.$getContainer().style.display	= "none";
};

cXULElement_datepicker_pane.prototype.refresh	= function() {
	// Render
	this.$getContainer("days-pane").innerHTML	= cXULElement_datepicker_pane.$getTagDays(this, this.current);
	var oItem	= this._elementMonth.firstChild.querySelector("[value='" + this.current.getMonth() + "']");
	this._elementMonth.firstChild.selectItem(oItem);
	this._elementMonth.setAttribute("value", oItem.getAttribute("label"));	// TODO: should be handled in menulist
	this._elementYear.setAttribute("value", this.current.getFullYear());
};

cXULElement_datepicker_pane.prototype._onSelectDay	= function(nDay) {
	var nMonth	= this.current.getMonth() + 1;
	var nYear	= this.current.getFullYear();

	// Update own value attribute
	var sValue	= nYear + '-' + (nMonth < 10 ? '0' : '') + nMonth + '-' + (nDay < 10 ? '0' : '') + nDay;
	if (this.getAttribute("value") != sValue) {
		this.setAttribute("value", sValue);

		// dispatch "change" event
		var oEvent	= this.ownerDocument.createEvent("UIEvent");
		oEvent.initEvent("change", false, false, window, null);
		this.dispatchEvent(oEvent);
	}

	// dispatch change event
	var oEventAccept	= this.ownerDocument.createEvent("UIEvent");
	oEventAccept.initUIEvent("accept", true, false, window, null);
	this.dispatchEvent(oEventAccept);
};

cXULElement_datepicker_pane.prototype.doSelectMonth	= function(nMonth) {
	// set current "month" in data object
	this.current.setMonth(nMonth);

	this.$getContainer("days-pane").innerHTML	= cXULElement_datepicker_pane.$getTagDays(this, this.current);
};

cXULElement_datepicker_pane.prototype.doSelectYear	= function(nYear) {
	// set current "year" in data object
	this.current.setYear(nYear);

	this.$getContainer("days-pane").innerHTML		= cXULElement_datepicker_pane.$getTagDays(this, this.current);
};

//Static members
cXULElement_datepicker_pane.parseDateFromString	= function(sDate) {
	var aDate	= sDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (aDate) {
		var nYear	= aDate[1] * 1,
			nMonth	= aDate[2] * 1 - 1,
			nDate	= aDate[3] * 1;
		// Check if date is valid
		var oDate	= new Date(nYear, nMonth, nDate, 0, 0, 0);
		if (oDate.getFullYear() == nYear && oDate.getMonth() == nMonth && oDate.getDate() == nDate)
			return oDate;
	}
	return null;
};

cXULElement_datepicker_pane.handlers	= {
	"click":		function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.$pseudoTarget == this.$getContainer("month-previous")) {
				var nYear	= this.current.getFullYear();
				this.doSelectMonth(this.current.getMonth() - 1);
				this._elementMonth.setAttribute("value", ample.locale.culture.calendar.months.names[this.current.getMonth()]);
				if (this.current.getFullYear() != nYear)
					this._elementYear.setAttribute("value", this.current.getFullYear());
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("month-next")) {
				var nYear	= this.current.getFullYear();
				this.doSelectMonth(this.current.getMonth() + 1);
				this._elementMonth.setAttribute("value", ample.locale.culture.calendar.months.names[this.current.getMonth()]);
				if (this.current.getFullYear() != nYear)
					this._elementYear.setAttribute("value", this.current.getFullYear());
			}
/*			else
			if (oEvent.$pseudoTarget == this.$getContainer("year-previous")) {
				this.doSelectYear(this.current.getFullYear() + 1);
				this._elementYear.setAttribute("value", this.current.getFullYear());
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("year-next")) {
				this.doSelectYear(this.current.getFullYear() - 1);
				this._elementYear.setAttribute("value", this.current.getFullYear());
			}*/
		}
	},
	"keydown":		function(oEvent) {
		// TODO: Enable keyboard navigation
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			if (oEvent.attrName == "min") {
				if (oEvent.newValue)
					this.min	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
				else
					this.min	= null;
			}
			else
			if (oEvent.attrName == "max") {
				if (oEvent.newValue)
					this.max	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
				else
					this.max	= null;
			}
			else
			if (oEvent.attrName == "value") {
				this.value	= null;
				if (oEvent.newValue) {
					var oDate	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
					if (oDate) {
						this.value	= oDate;
						this.current= new Date(oDate.getFullYear(), oDate.getMonth(), 1);
					}
				}
			}
			else
			if (oEvent.attrName == "disabled") {
				this._elementMonth.setAttribute("disabled", oEvent.newValue == "true" ? "true" : "false");
				this._elementYear.setAttribute("disabled", oEvent.newValue == "true" ? "true" : "false");
			}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		var sValue	= this.getAttribute("value");
		if (sValue) {
			var oDate	= cXULElement_datepicker_pane.parseDateFromString(sValue);
			if (oDate) {
				this.value	= oDate;
				this.current= new Date(oDate.getFullYear(), oDate.getMonth(), 1);
			}
		}
		this._elementMonth.setAttribute("value", ample.locale.culture.calendar.months.names[this.current.getMonth()]);
		this._elementYear.setAttribute("value", this.current.getFullYear());
		//
		this.refresh();
	}
};

cXULElement_datepicker_pane.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value")
		this.refresh();
	else
		cXULPopupElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// algorythm found at http://www.jslab.dk/library/Date.getISOWeek
cXULElement_datepicker_pane.getWeekNum	= function(oDate) {
	var y	= oDate.getFullYear();
	var m	= oDate.getMonth() + 1;
	var d	= 0;
	// If month jan. or feb.
	if (m < 3) {
		var a	= y - 1;
		var b	= (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
		var c	= ( (a - 1) / 4 | 0) - ( (a - 1) / 100 | 0) + ( (a - 1) / 400 | 0);
		var s	= b - c;
		var e	= 0;
		var f	= d - 1 + 31 * (m - 1);
	}
	// If month mar. through dec.
	else {
		var a	= y;
		var b	= (a / 4 | 0) - ( a / 100 | 0) + (a / 400 | 0);
		var c	= ( (a - 1) / 4 | 0) - ( (a - 1) / 100 | 0) + ( (a - 1) / 400 | 0);
		var s	= b - c;
		var e	= s + 1;
		var f	= d + ( (153 * (m - 3) + 2) / 5 | 0) + 58 + s;
	}
	var g	= (a + b) % 7;
	// ISO Weekday (0 is monday, 1 is tuesday etc.)
	var d	= (f + g - e) % 7;
	var n	= f + 3 - d;
	if (n < 0)
		var w	= 53 - ( (g - s) / 5 | 0);
	else if (n > 364 + s)
		var w	= 1;
	else
		var w	= (n / 7 | 0) + 1;
	return w;
};

/*
// static members
cXULElement_datepicker_pane.getWeekNum	= function(oDate, bFirstDay) {
	var nWeeks	= 0;
	var nMonth	= oDate.getMonth()		* 1;
	var nYear	= oDate.getFullYear()	* 1;

	for (var nIndex = 0; nIndex < nMonth; nIndex++)
		nWeeks += (new window.Date(nYear, nIndex + 1, 0).getDate());

	nWeeks +=(bFirstDay) ? 1 : oDate.getDate() * 1;
	nWeeks -= 7 - (new window.Date(nYear, 0, 1).getDay());
	nWeeks	= window.Math.ceil(nWeeks / 7);
	if (new window.Date(nYear, 0, 1).getDay() <= 3)
		nWeeks++;

	return nWeeks ? nWeeks : cXULElement_datepicker_pane.getWeekNum(new window.Date(nYear - 1, 11, 31), false);
};
*/

cXULElement_datepicker_pane.$getTagDays	= function(oInstance, oDate) {
	var aHtml	= [];

	// Day pane header
	aHtml.push('<table cellPadding="0" cellSpacing="1" border="0">\
					<thead class="xul-datepicker-pane--header">\
						<tr>\
							<td>&nbsp;</td>\
							<td class="xul-datepicker-pane-head-day">' + ample.locale.culture.calendar.days.namesShort[1] + '</td>\
							<td class="xul-datepicker-pane-head-day">' + ample.locale.culture.calendar.days.namesShort[2] + '</td>\
							<td class="xul-datepicker-pane-head-day">' + ample.locale.culture.calendar.days.namesShort[3] + '</td>\
							<td class="xul-datepicker-pane-head-day">' + ample.locale.culture.calendar.days.namesShort[4] + '</td>\
							<td class="xul-datepicker-pane-head-day">' + ample.locale.culture.calendar.days.namesShort[5] + '</td>\
							<td class="xul-datepicker-pane-head-day">' + ample.locale.culture.calendar.days.namesShort[6] + '</td>\
							<td class="xul-datepicker-pane-head-day">' + ample.locale.culture.calendar.days.namesShort[0] + '</td>\
						</tr>\
					</thead>\
					<tbody>\
						<tr>');

	var oDateToday	= new Date;

	var nWeek	= cXULElement_datepicker_pane.getWeekNum(oDate, true);
	// -1 here enables european week (starting on monday)
	var nWeekDay	= new Date(oDate.getFullYear(), oDate.getMonth(), 1).getDay() - 1;
	if (nWeekDay < 0)
		nWeekDay	= 6;

	aHtml.push('<td align="center" valign="center"><div class="xul-datepicker-pane-week">' + nWeek + '</div></td>');
	// filling empty td's
	for (var nIndex = 0; nIndex < nWeekDay; nIndex++)
		aHtml.push('<td><br /></td>');

	nWeek	= (nWeek >= 52) ? 0 : nWeek; // change if the first week is of previous year

	var nDays	= new Date(oDate.getFullYear(), oDate.getMonth() * 1 + 1, 0).getDate();

	for (var nIndex = 1, oDateCurrent, bDateDisabled; nIndex <= nDays; nIndex++) {
		oDateCurrent	= new Date(oDate.getFullYear(), oDate.getMonth(), nIndex);
		bDateDisabled	= (oInstance.min && oDateCurrent < oInstance.min) || (oInstance.max && oDateCurrent > oInstance.max);
		aHtml.push('	<td align="center" valign="center">\
							<div type="button"\
								class="xul-datepicker-pane-day' +(nWeekDay > 4 ? " xul-datepicker-pane-weekend" : '') + (oInstance.value && oDateCurrent.getTime() == oInstance.value.getTime() ? ' selected' : '') + '\
								' + (oDateToday.getDate() == oDateCurrent.getDate() && oDateToday.getMonth() == oDateCurrent.getMonth() && oDateToday.getFullYear() == oDateCurrent.getFullYear() ? ' today' : '') + '\
								' + (bDateDisabled ? ' disabled' : '" onclick="ample.$instance(this)._onSelectDay(' + nIndex + ')') + '"\
								onmouseover="this.className += \' hover\'" onmouseout="this.className = this.className.replace(/\\shover\\b/, \'\')"\
								>' + nIndex + '</div>\
						</td>');
		if ((nWeekDay == 6) && (nIndex < nDays)) {
			nWeek++;
			if (nWeek == 53)
				nWeek	= (new Date(oDate.getFullYear(), 11, 31).getDay() < 3) ? 1 : nWeek;
			aHtml.push('</tr>\
						<tr>\
							<td align="center" valign="center"><div class="xul-datepicker-pane-week">' + nWeek + '</div></td>');
			nWeekDay	= 0;
		}
		else
			nWeekDay++;
	}

	// filling left td's
	for (var nIndex = nWeekDay; nIndex < 7; nIndex++)
		aHtml.push(			'<td><br /></td>');

	aHtml.push('		</tr>\
					</tbody>\
				</table>');

	return aHtml.join('');
};

// component renderers
cXULElement_datepicker_pane.prototype.$getTagOpen	= function() {
	//
	return '<div class="xul-datepicker-pane xul-menupopup' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '" style="' +
				(this.getAttribute("hidden") == "true" ? "display:none;" : '') +
				(this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;"></div>\
				<table cellpadding="0" cellspacing="0" border="0">\
					<thead>\
						<tr>\
							<td><button class="xul-datepicker-pane--month-previous" onmouseover="ample.$instance(this).$setPseudoClass(\'hover\', true, \'month-previous\')" onmouseout="ample.$instance(this).$setPseudoClass(\'hover\', false, \'month-previous\')"><br /></button></td>\
							<td>' + this._elementMonth.$getTag() + '</td>\
							<td><button class="xul-datepicker-pane--month-next" onmouseover="ample.$instance(this).$setPseudoClass(\'hover\', true, \'month-next\')" onmouseout="ample.$instance(this).$setPseudoClass(\'hover\', false, \'month-next\')"><br /></button></td>\
							<td>' + this._elementYear.$getTag() + '</td>\
						</tr>\
					</thead>\
					<tbody>\
						<tr>\
							<td colspan="4" class="xul-datepicker-pane--days-pane"></td>\
						</tr>\
					</tbody>\
				</table>\
			</div>';
};

cXULElement_datepicker_pane.prototype.$getTagClose	= function() {
	return '';
};

// Register Element
ample.extend(cXULElement_datepicker_pane);

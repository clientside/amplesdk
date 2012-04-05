/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// component constructor
var cXHTMLElement_datepicker	= function() {
	var oDate	= new Date();
	this.current	= new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
	//
	var that	= this;
	this.contentFragment	= ample.createDocumentFragment();
	// Action buttons
	this._buttonAccept	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "button"));
	this._buttonAccept.setAttribute("class", "accept");
	this._buttonAccept.appendChild(ample.createTextNode("Accept"));
	this._buttonAccept.addEventListener("DOMActivate", function() {
		that.acceptDialog();
	});
	this._buttonCancel	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "button"));
	this._buttonCancel.setAttribute("class", "cancel");
	this._buttonCancel.appendChild(ample.createTextNode("Cancel"));
	this._buttonCancel.addEventListener("DOMActivate", function() {
		that.cancelDialog();
	});
	// Month select
	this._elementMonth	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "select"));
	this._elementMonth.tabIndex	=-1;
	this._elementMonth.addEventListener("change", function(oEvent) {
		that.doSelectMonth(this.items[this.selectedIndex].getAttribute("value"));
		// Stop propagation
		oEvent.stopPropagation();
	}, false);
	// months names
	for (var nIndex = 0, oElement; nIndex < 12; nIndex++) {
		oElement	= this._elementMonth.appendChild(ample.createElementNS(this.namespaceURI, "option"));
		oElement.setAttribute("value", nIndex);
		oElement.setAttribute("label", ample.locale.culture.calendar.months.names[nIndex]);
	}
	// Year spinner
	this._elementYear	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "input"));
	this._elementYear.setAttribute("type", "number");
	this._elementYear.tabIndex	=-1;
	this._elementYear.setAttribute("max", Infinity);
	this._elementYear.addEventListener("change", function(oEvent) {
		that.doSelectYear(this.getAttribute("value"));
		// Stop propagation
		oEvent.stopPropagation();
	}, false);
	this._elementMonthPrevious	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "input"));
	this._elementMonthPrevious.setAttribute("type", "button");
	this._elementMonthPrevious.tabIndex	=-1;
	this._elementMonthNext	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "input"));
	this._elementMonthNext.setAttribute("type", "button");
	this._elementMonthNext.tabIndex	=-1;
	//
	this._elementAccept	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "input"));
	this._elementAccept.setAttribute("type", "button");
	this._elementAccept.setAttribute("value", "OK");
	this._elementAccept.tabIndex	=-1;
	this._elementCancel	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "input"));
	this._elementCancel.setAttribute("type", "button");
	this._elementCancel.setAttribute("value", "Cancel");
	this._elementCancel.tabIndex	=-1;
};

// component prototype
cXHTMLElement_datepicker.prototype	= new cXHTMLElement("datepicker");

// Pubic properties (read-only)
cXHTMLElement_datepicker.prototype.current	= null;	// this is set by constructor
cXHTMLElement_datepicker.prototype.value	= null;
cXHTMLElement_datepicker.prototype.min	= null;
cXHTMLElement_datepicker.prototype.max	= null;

// Public methods
cXHTMLElement_datepicker.prototype.show	= function(nLeft, nTop) {
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
		//
		this.refresh();
	}
};

cXHTMLElement_datepicker.prototype.hide	= function() {
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("hidden", false, true, null);
	if (this.dispatchEvent(oEvent))
		this.$getContainer().style.display	= "none";
};

cXHTMLElement_datepicker.prototype.refresh	= function() {
	// Render
	this.$getContainer("days-pane").innerHTML	= cXHTMLElement_datepicker.$getTagDays(this, this.current);
	var oItem	= this._elementMonth.querySelector("[value='" + this.current.getMonth() + "']");
	return;
	this._elementMonth.selectItem(oItem);
	this._elementMonth.setAttribute("value", this.current.getMonth());
	this._elementYear.setAttribute("value", this.current.getFullYear());
};

cXHTMLElement_datepicker.prototype._onSelectDay	= function(nDay) {
	// set current "day" in data object
	this.current.setDate(nDay);
	var nMonth	= this.current.getMonth();
	var nYear	= this.current.getFullYear();

	// Update own value attribute
	var sValue	= nYear + '/' + (nMonth + 1 < 10 ? '0' : '') + (nMonth + 1) + '/' + (nDay < 10 ? '0' : '') + nDay;
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

cXHTMLElement_datepicker.prototype.doSelectMonth	= function(nMonth) {
	// set current "month" in data object
	this.current.setMonth(nMonth);

	this.$getContainer("days-pane").innerHTML	= cXHTMLElement_datepicker.$getTagDays(this, this.current);
};

cXHTMLElement_datepicker.prototype.doSelectYear	= function(nYear) {
	// set current "year" in data object
	this.current.setYear(nYear);

	this.$getContainer("days-pane").innerHTML		= cXHTMLElement_datepicker.$getTagDays(this, this.current);
};

//Static members
cXHTMLElement_datepicker.parseDateFromString	= function(sDate) {
	return new Date(sDate);
};

cXHTMLElement_datepicker.prototype.acceptDialog	= function() {
	this.attributes.value	= this.$getContainer('value').value;

	// fire select event
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("accept", false, false, null);
	this.dispatchEvent(oEvent);
};

cXHTMLElement_datepicker.prototype.cancelDialog	= function() {
	this.setAttribute("value", this.attributes.value);

	// fire cancel event
	var oEvent	= this.ownerDocument.createEvent("CustomEvent");
	oEvent.initCustomEvent("cancel", false, false, null);
	this.dispatchEvent(oEvent);
};

cXHTMLElement_datepicker.handlers	= {
	"click":		function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.$pseudoTarget == this.$getContainer("month-previous")) {
				var nYear	= this.current.getFullYear();
				this.doSelectMonth(this.current.getMonth() - 1);
				this._elementMonth.setAttribute("value", this.current.getMonth());
				if (this.current.getFullYear() != nYear)
					this._elementYear.setAttribute("value", this.current.getFullYear());
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("month-next")) {
				var nYear	= this.current.getFullYear();
				this.doSelectMonth(this.current.getMonth() + 1);
				this._elementMonth.setAttribute("value", this.current.getMonth());
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
			switch (oEvent.attrName) {
				case "min":
					if (oEvent.newValue)
						this.min	= cXHTMLElement_datepicker.parseDateFromString(oEvent.newValue);
					else
						this.min	= null;
//					this.refresh();
					break;

				case "max":
					if (oEvent.newValue)
						this.max	= cXHTMLElement_datepicker.parseDateFromString(oEvent.newValue);
					else
						this.max	= null;
//					this.refresh();
					break;

				case "value":
					if (oEvent.newValue) {
						this.value	= cXHTMLElement_datepicker.parseDateFromString(oEvent.newValue);
						this.current= cXHTMLElement_datepicker.parseDateFromString(oEvent.newValue);
					}
					else {
						this.value	= null;
					}
					this.refresh();
					break;
			}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		var sValue	= this.getAttribute("value");
		if (sValue) {
			this.value	= cXHTMLElement_datepicker.parseDateFromString(sValue);
			this.current= cXHTMLElement_datepicker.parseDateFromString(sValue);
		}
		this._elementMonth.setAttribute("value", this.current.getMonth());
		this._elementYear.setAttribute("value", this.current.getFullYear());
		//
		this.refresh();
	}
};

// algorythm found at http://www.jslab.dk/library/Date.getISOWeek
cXHTMLElement_datepicker.getWeekNum	= function(oDate) {
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
cXHTMLElement_datepicker.getWeekNum	= function(oDate, bFirstDay) {
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

	return nWeeks ? nWeeks : cXHTMLElement_datepicker.getWeekNum(new window.Date(nYear - 1, 11, 31), false);
};
*/

cXHTMLElement_datepicker.$getTagDays	= function(oInstance, oDate) {
	var aHtml	= [];

	// Day pane header
	aHtml.push('<table cellPadding="0" cellSpacing="1" border="0">\
					<thead class="datepicker--header">\
						<tr>\
							<td>&nbsp;</td>\
							<td class="datepicker-head-day">' + ample.locale.culture.calendar.days.namesShort[1] + '</td>\
							<td class="datepicker-head-day">' + ample.locale.culture.calendar.days.namesShort[2] + '</td>\
							<td class="datepicker-head-day">' + ample.locale.culture.calendar.days.namesShort[3] + '</td>\
							<td class="datepicker-head-day">' + ample.locale.culture.calendar.days.namesShort[4] + '</td>\
							<td class="datepicker-head-day">' + ample.locale.culture.calendar.days.namesShort[5] + '</td>\
							<td class="datepicker-head-day">' + ample.locale.culture.calendar.days.namesShort[6] + '</td>\
							<td class="datepicker-head-day">' + ample.locale.culture.calendar.days.namesShort[0] + '</td>\
						</tr>\
					</thead>\
					<tbody>\
						<tr>');

	var oDateToday	= new Date;

	var nWeek	= cXHTMLElement_datepicker.getWeekNum(oDate, true);
	// -1 here enables european week (starting on monday)
	var nWeekDay	= new Date(oDate.getFullYear(), oDate.getMonth(), 1).getDay() - 1;
	if (nWeekDay < 0)
		nWeekDay	= 6;

	aHtml.push('<td align="center" valign="center"><div class="datepicker-week">' + nWeek + '</div></td>');
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
								class="datepicker-day' +(nWeekDay > 4 ? " datepicker-weekend" : '') + (oInstance.value && oDateCurrent.getTime() == oInstance.value.getTime() ? ' datepicker-day_selected' : '') + '\
								' + (oDateToday.getDate() == oDateCurrent.getDate() && oDateToday.getMonth() == oDateCurrent.getMonth() && oDateToday.getFullYear() == oDateCurrent.getFullYear() ? ' datepicker-day_today' : '') + '\
								' + (bDateDisabled ? ' datepicker-day_disabled' : '" onclick="ample.$instance(this)._onSelectDay(' + nIndex + ')') + '"\
								onmouseover="this.className += \' datepicker-day_hover\'" onmouseout="this.className = this.className.replace(\' datepicker-day_hover\', \'\')"\
								>' + nIndex + '</div>\
						</td>');
		if ((nWeekDay == 6) && (nIndex < nDays)) {
			nWeek++;
			if (nWeek == 53)
				nWeek	= (new Date(oDate.getFullYear(), 11, 31).getDay() < 3) ? 1 : nWeek;
			aHtml.push('</tr>\
						<tr>\
							<td align="center" valign="center"><div class="datepicker-week">' + nWeek + '</div></td>');
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
cXHTMLElement_datepicker.prototype.$getTagOpen	= function() {
	return '<div class="datepicker' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '" style="' +
				(this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
				<table cellpadding="0" cellspacing="0" border="0">\
					<thead>\
						<tr>\
							<td valign="top">' + this._elementMonthPrevious.$getTag() + '</td>\
							<td>' + this._elementMonth.$getTag() + '</td>\
							<td valign="top">' + this._elementMonthNext.$getTag() + '</td>\
							<td>' + this._elementYear.$getTag() + '</td>\
						</tr>\
					</thead>\
					<tbody>\
						<tr>\
							<td colspan="4" class="datepicker--days-pane"></td>\
						</tr>\
					</tbody>\
					<tfoot>\
						<tr>\
							<td colspan="4" align="center">' +
								this._buttonAccept.$getTag() +
								this._buttonCancel.$getTag() + '\
							</td>\
						</tr>\
					</tfoot>\
				</table>\
			</div>';
};

cXHTMLElement_datepicker.prototype.$getTagClose	= function() {
	return '';
};

// Register Element
ample.extend(cXHTMLElement_datepicker);

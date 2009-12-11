/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

// component constructor
var cXULElement_datepicker_pane	= function() {
	var oDate	= new Date();
	this.current	= new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
};

cXULElement_datepicker_pane.prototype	= new cXULPopupElement;

cXULElement_datepicker_pane.months	= [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

// Pubic properties (read-only)
cXULElement_datepicker_pane.prototype.current= null;	// this is set by constructor
cXULElement_datepicker_pane.prototype.value	= null;
cXULElement_datepicker_pane.prototype.min	= null;
cXULElement_datepicker_pane.prototype.max	= null;

cXULElement_datepicker_pane.prototype.opener	= null;

cXULElement_datepicker_pane.prototype.refresh	= function() {
	// Render
	this.$getContainer("days-pane").innerHTML	= cXULElement_datepicker_pane.$getTagDays(this, this.current);
	this.$getContainer("month").value	= this.current.getMonth();
	this.$getContainer("year").value	= this.current.getFullYear();
};

cXULElement_datepicker_pane.prototype._onSelectDay	= function(nDay) {
	// set current "day" in data object
	this.current.setDate(nDay);
	var nMonth	= this.current.getMonth();
	var nYear	= this.current.getFullYear();

	// Update own value attribute
	var sValue	= nYear + '/' + (nMonth < 10 ? '0' : '') + (nMonth + 1) + '/' + (nDay < 10 ? '0' : '') + nDay;
	if (this.getAttribute("value") != sValue) {
		this.setAttribute("value", sValue);

		// dispatch "change" event
		var oEvent	= ample.createEvent("UIEvent");
		oEvent.initUIEvent("change", true, false, window, null);
		this.dispatchEvent(oEvent);
	}
};

cXULElement_datepicker_pane.prototype._onSelectMonth	= function(nMonth) {
	// set current "month" in data object
	this.current.setMonth(nMonth);

	this.$getContainer("days-pane").innerHTML	= cXULElement_datepicker_pane.$getTagDays(this, this.current);
};

cXULElement_datepicker_pane.prototype._onSelectYear	= function(nYear) {
	// set current "year" in data object
	this.current.setYear(nYear);

	this.$getContainer("days-pane").innerHTML		= cXULElement_datepicker_pane.$getTagDays(this, this.current);
};

cXULElement_datepicker_pane.prototype._onDayOver	= function(oElement) {
	var nIndex	= oElement.className.indexOf("xul-datepicker-pane-day_hover");
	if (nIndex ==-1)
		oElement.className	= oElement.className + ' xul-datepicker-pane-day_hover';
};

cXULElement_datepicker_pane.prototype._onDayOut	= function(oElement) {
	var nIndex	= oElement.className.indexOf("xul-datepicker-pane-day_hover");
	if (nIndex !=-1)
		oElement.className	= oElement.className.substr(0, nIndex);
};

// Static members
cXULElement_datepicker_pane.parseDateFromString	= function(sDate) {
	return new Date(sDate);
};

// Class event handlers
cXULElement_datepicker_pane.handlers	= {
	"click":		function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.$pseudoTarget == this.$getContainer("month-previous")) {
				var nYear	= this.current.getFullYear();
				this._onSelectMonth(this.current.getMonth() - 1);
				this.$getContainer("month").value	= this.current.getMonth();
				if (this.current.getFullYear() != nYear)
					this.$getContainer("year").value	= this.current.getFullYear();
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("month-next")) {
				var nYear	= this.current.getFullYear();
				this._onSelectMonth(this.current.getMonth() + 1);
				this.$getContainer("month").value	= this.current.getMonth();
				if (this.current.getFullYear() != nYear)
					this.$getContainer("year").value	= this.current.getFullYear();
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("year-previous")) {
				this._onSelectYear(this.current.getFullYear() - 1);
				this.$getContainer("year").value	= this.current.getFullYear();
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("year-next")) {
				this._onSelectYear(this.current.getFullYear() + 1);
				this.$getContainer("year").value	= this.current.getFullYear();
			}
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
						this.min	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
					else
						this.min	= null;
					this.refresh();
					break;

				case "max":
					if (oEvent.newValue)
						this.max	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
					else
						this.min	= null;
					this.refresh();
					break;

				case "value":
					if (oEvent.newValue) {
						this.value	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
						this.current= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
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
			this.value	= cXULElement_datepicker_pane.parseDateFromString(sValue);
			this.current= cXULElement_datepicker_pane.parseDateFromString(sValue);
		}

		this.refresh();
	}
};

// algorythm found at http://www.jslab.dk/library/Date.getISOWeek
cXULElement_datepicker_pane.getWeekNum  = function(oDate) {
    var y = oDate.getFullYear();
    var m = oDate.getMonth() + 1;
    var d = 0;
    // If month jan. or feb.
    if (m < 3) {
      var a = y - 1;
      var b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
      var c = ( (a - 1) / 4 | 0) - ( (a - 1) / 100 | 0) + ( (a - 1) / 400 | 0);
      var s = b - c;
      var e = 0;
      var f = d - 1 + 31 * (m - 1);
    }
    // If month mar. through dec.
    else {
      var a = y;
      var b = (a / 4 | 0) - ( a / 100 | 0) + (a / 400 | 0);
      var c = ( (a - 1) / 4 | 0) - ( (a - 1) / 100 | 0) + ( (a - 1) / 400 | 0);
      var s = b - c;
      var e = s + 1;
      var f = d + ( (153 * (m - 3) + 2) / 5 | 0) + 58 + s;
    }
    var g = (a + b) % 7;
    // ISO Weekday (0 is monday, 1 is tuesday etc.)
    var d = (f + g - e) % 7;
    var n = f + 3 - d;
    if (n < 0)
      var w = 53 - ( (g - s) / 5 | 0);
    else if (n > 364 + s)
      var w = 1;
    else
      var w = (n / 7 | 0) + 1;
    return w;
};

/*
// static members
cXULElement_datepicker_pane.getWeekNum  = function(oDate, bFirstDay) {
    var nWeeks  = 0;
    var nMonth  = oDate.getMonth()      * 1;
    var nYear   = oDate.getFullYear()   * 1;

    for (var nIndex = 0; nIndex < nMonth; nIndex++)
        nWeeks += (new Date(nYear, nIndex + 1, 0).getDate());

    nWeeks +=(bFirstDay) ? 1 : oDate.getDate() * 1;
    nWeeks -= 7 - (new Date(nYear, 0, 1).getDay());
    nWeeks  = Math.ceil(nWeeks / 7);
    if (new Date(nYear, 0, 1).getDay() <= 3)
        nWeeks++;

    return nWeeks ? nWeeks : cXULElement_datepicker_pane.getWeekNum(new Date(nYear - 1, 11, 31), false);
};
*/

cXULElement_datepicker_pane.$getTagDays	= function(oInstance, oDate) {
	var aHtml  = [];

	// Day pane header
	aHtml.push('<table cellpadding="0" cellspacing="1" border="0">\
					<thead class="xul-datepicker-pane--header">\
						<tr>\
							 <td>W</td>\
							 <td class="xul-datepicker-pane-head-day">Mo</td>\
							 <td class="xul-datepicker-pane-head-day">Tu</td>\
							 <td class="xul-datepicker-pane-head-day">We</td>\
							 <td class="xul-datepicker-pane-head-day">Th</td>\
							 <td class="xul-datepicker-pane-head-day">Fr</td>\
							 <td class="xul-datepicker-pane-head-day">Sa</td>\
							 <td class="xul-datepicker-pane-head-day">Su</td>\
						</tr>\
					</thead>\
					<tbody>\
						<tr>');

	var nWeek   = cXULElement_datepicker_pane.getWeekNum(oDate, true);
	// -1 here enables european week (starting on monday)
	var nWeekDay	= new Date(oDate.getFullYear(), oDate.getMonth(), 1).getDay() - 1;
	if (nWeekDay < 0)
		nWeekDay	= 6;

	aHtml.push('<td align="center" valign="center"><div class="xul-datepicker-pane-week">' + nWeek + '</div></td>');
	// filling empty td's
	for (var nIndex = 0; nIndex < nWeekDay; nIndex++)
		aHtml.push('<td><br /></td>');

	nWeek   = (nWeek >= 52) ? 0 : nWeek; // change if the first week is of previous year

	var nDays   = new Date(oDate.getFullYear(), oDate.getMonth() * 1 + 1, 0).getDate();

	for (var nIndex = 1, bDateDisabled, oDateCurrent; nIndex <= nDays; nIndex++)
	{
		oDateCurrent	= new Date(oDate.getFullYear(), oDate.getMonth(), nIndex);
		bDateDisabled	= (oInstance.min && oDateCurrent < oInstance.min) || (oInstance.max && oDateCurrent > oInstance.max);
		aHtml.push('	<td align="center" valign="center">\
							<div type="button"\
								class="' +(nWeekDay == 6 ? "xul-datepicker-pane-weekend" : 'xul-datepicker-pane-day') + (oInstance.value && oDateCurrent.getTime() == oInstance.value.getTime() ? ' xul-datepicker-pane-day_selected' : '') + '\
								' + (bDateDisabled ? ' xul-datepicker-pane-day_disabled" disabled="true"' : '" onclick="ample.$instance(this)._onSelectDay(' + nIndex + ')') + '" onmouseover="ample.$instance(this)._onDayOver(this)" onmouseout="ample.$instance(this)._onDayOut(this)"\
								>' + nIndex + '</div>\
						</td>');
		if ((nWeekDay == 6) && (nIndex < nDays))
		{
			nWeek++;
			if (nWeek == 53)
				nWeek   = (new Date(oDate.getFullYear(), 11, 31).getDay() < 3) ? 1 : nWeek;
			aHtml.push('</tr>\
						<tr>\
							<td align="center" valign="center"><div class="xul-datepicker-pane-week">' + nWeek + '</div></td>');
			nWeekDay  = 0;
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
	var sHtml = '<div class="xul-datepicker-pane xul-menupopup' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;"></div>\
				<table cellpadding="0" cellspacing="0" border="0">\
				<thead>\
					<tr>\
						<td><div class="xul-datepicker-pane--month-previous">&lt;</div></td>\
						<td class="xul-datepicker-pane--months-pane" width="1">\
							<select onchange="ample.$instance(this)._onSelectMonth(this.value)" class="xul-datepicker-pane--month">';
	// months names
    for (var nIndex = 0; nIndex < 12; nIndex++)
        sHtml  += '<option value="' + nIndex + '">' + cXULElement_datepicker_pane.months[nIndex] + '</option>';

	sHtml+=	'						</select>\
						</td>\
						<td>\
							<table cellpadding="0" cellspacing="0" border="0" class="xul-datepicker-pane--years-pane">\
								<tbody>\
									<tr>\
										<td width="100%"><input type="text" autocomplete="off" style="border:0px solid white;width:100%;" class="xul-datepicker-pane--year" onfocus="blur()"/></td>\
										<td valign="top"><div class="xul-datepicker-pane--year-previous" onmouseover="ample.$instance(this).$setPseudoClass(\'hover\', true, \'year-previous\')" onmouseout="ample.$instance(this).$setPseudoClass(\'hover\', false, \'year-previous\')"><br /></div><div class="xul-datepicker-pane--year-next" onmouseover="ample.$instance(this).$setPseudoClass(\'hover\', true, \'year-next\')" onmouseout="ample.$instance(this).$setPseudoClass(\'hover\', false, \'year-next\')"><br /></div></td>\
									</tr>\
								</tbody>\
							</table>\
						</td>\
						<td><div class="xul-datepicker-pane--month-next">&gt;</div></td>\
					</tr>\
				</thead>\
				<tbody>\
					<tr>\
						<td colspan="4" class="xul-datepicker-pane--days-pane"></td>\
					</tr>\
				</tbody>\
			</table>\
			</div>';

	return sHtml;
};

cXULElement_datepicker_pane.prototype.$getTagClose	= function() {
	return '';
};

// Register component with the language
oXULNamespace.setElement("datepicker-pane", cXULElement_datepicker_pane);

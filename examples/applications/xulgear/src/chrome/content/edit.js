function EditBox() {
	this.name = "";
	this.element = null;
}


//Edit box of simple textbox
function TextEditBox(name,option,onChange) {
	this.name = name;
	this.element = null;
	this.onChange = onChange;
}
TextEditBox.prototype.create = function() {
	//this.func = func;
	this.element = xml2Dom(
			<textbox oninput="this.editBox.onChange(this.editBox)"/>//emptytext={this.name}
			);
	this.element.editBox = this;
	return this.element;
}

TextEditBox.prototype.getValue = function() {
	return this.element.value;
}
TextEditBox.prototype.setValue = function(value) {
	this.element.value = value;
}
TextEditBox.prototype.init = function() {
	if (this.element.value)
		this.element.value = "";
}


//select from menulist
function SelectEditBox(name, option, onChange) {
	this.name = name;
	this.option = option;
	this.element = null;
	this.onChange = onChange;
}

SelectEditBox.prototype.create = function() {
	var values = [""].concat(this.option["values"]);
	var labels = ["["+this.name+"]"].concat(this.option["values"]);

	var menulist = document.createElement("menulist");
	menulist.setAttribute('oncommand', "this.editBox.onChange(this.editBox)");
	menulist.setAttribute("sizetopopup", "none");
	menulist.editBox  = this;

	if ("editable" in this.option) {
		menulist.setAttribute("editable", "true");
	}
	var menupopup = document.createElement("menupopup");
	for (var j = 0; j < values.length; j++) {
		var menuitem = document.createElement("menuitem");
		setAttributes(menuitem, {"label":labels[j], "value":values[j]});
		menupopup.appendChild(menuitem);
	}
	menulist.appendChild(menupopup);
	this.element = menulist;
	return this.element;
}
SelectEditBox.prototype.getValue = function() {
	return this.element.value;
}
SelectEditBox.prototype.setValue = function(value) {
	this.element.selectedIndex = this.option.values.indexOf(value)+1;
}
SelectEditBox.prototype.init = function() {
	this.element.selectedIndex = 0;
}


//number without unit
function SimpleNumberEditBox(name, option, onChange) {
	this.name = name;
	this.option = option;
	this.onChange = onChange;

	this.onUpdate = false;
}
SimpleNumberEditBox.prototype.create = function() {
	var scrollbarId = "ID"+Math.random();
	var xml = //
		<hbox>
			<textbox oninput="this.editBox.onChange(this.editBox);changeScrollbar(this.nextSibling, this.value)" flex="1" style="text-align:right">
				<observes onbroadcast="syncScrollbarWithTextbox(this.parentNode.nextSibling, this.parentNode); if(!this.editBox.onUpdate)this.editBox.onChange(this.editBox)" element={scrollbarId} attribute="curpos"/>
			</textbox>
			<scrollbar width="150px" flex="2" maxpos={("max" in this.option) ? this.option.max : 100} id={scrollbarId}/>
		</hbox>;
	//this.func = func;
	
	var hbox = xml2Dom(xml);
	hbox.firstChild.editBox = this;
	hbox.firstChild.firstChild.editBox = this;
	//var editBox = this;
	//hbox.firstChild.addEventListener('input', function(){func(editBox);changeScrollbar(this.nextSibling, this.value)}, false);
	//hbox.firstChild.firstChild.addEventListener('broadcast', function() {syncScrollbarWithTextbox(this.parentNode.nextSibling, this.parentNode); func(editBox)}, false);//{//observes
	//hbox.firstChild.name = name;
	this.element = hbox;
	return this.element;
}
SimpleNumberEditBox.prototype.getValue = function() {
	return this.element.firstChild.value;
}
SimpleNumberEditBox.prototype.setValue = function(value) {
	this.onUpdate = true;
	this.element.firstChild.value = value;
	changeScrollbar(this.element.lastChild , value);
	this.onUpdate = false;
}
SimpleNumberEditBox.prototype.init = function() {
	this.onUpdate = true;
	this.element.firstChild.value = "";
	changeScrollbar(this.element.lastChild , 0);
	this.onUpdate = false;
}

//number with unit
function NumberEditBox(name, option, onChange) {
	this.name = name;
	this.element = null;
	this.option = option;
	this.onChange = onChange;

	this.scrollbar = null;
	this.onUpdate = false;//for broadcast on observes
}

NumberEditBox.prototype.create = function() {
	var scrollbarId = "ID"+Math.random();
	if (!("decimalplaces" in this.option)) {
		this.option["decimalplaces"] = 0;
	}
	if (!("initial" in this.option)) {
		this.option["initial"] = 0;
	}
	//var rate = 1/Math.pow(10, this.option["decimalplaces"]);
	var maxpos = ("max" in this.option ? this.option.max : 100) * Math.pow(10, this.option["decimalplaces"]);
	//type="number" max={this.option["max"]} increment={rate} decimalplaces={this.option["decimalplaces"]} 
	var xml = 
	<hbox flex="1">
		<textbox onchange="this.editBox.onChange(this.editBox)" flex="1" minwidth="42" size="6" style="text-align:right">
			<observes onbroadcast="syncScrollbarWithTextbox(this.parentNode.nextSibling.nextSibling, this.parentNode, 1/this.rate); if(!this.editBox.onUpdate)this.editBox.onChange(this.editBox)" element={scrollbarId} attribute="curpos" />
		</textbox>
		<menulist editable="true" sizetopopup="none" width="42px">
			<menupopup>
			<menuitem selected="true" label="px" value="px"/>
			<menuitem label="%"/>
			<menuitem label="em"/>
			</menupopup>
		</menulist>
		<scrollbar flex="2" minwidth="70" maxpos={maxpos} id={scrollbarId}/>
	</hbox>
	if (this.option["nounit"]) {
		delete xml.menulist.menupopup.*;
		xml.menulist.menupopup.appendChild(<menuitem label="" value=""/>);
	}
	//if ("initial" in this.option) {
	xml.scrollbar.@curpos = this.option["initial"] * Math.pow(10, this.option['decimalplaces']);
	//}
	var hbox = xml2Dom(xml);
	this.units =  ["px", "%", "em"];
	var textbox = hbox.firstChild;
	var observes = hbox.firstChild.firstChild;
	var scrollbar = hbox.lastChild;
	textbox.editBox = this;
	observes.editBox = this;

	this.rate = observes.rate = Math.pow(10, this.option['decimalplaces']);
	textbox.name = observes.name = name;

	hbox.lastChild.initial = this.option["initial"] * Math.pow(10, this.option['decimalplaces'])
	this.element = hbox;
	this.scrollbar = hbox.lastChild;
	this.textbox = hbox.firstChild;
	return hbox;
}

NumberEditBox.prototype.getValue = function() {
	if (this.textbox.value)
		return this.element.firstChild.value + this.element.firstChild.nextSibling.value;
	else return null;
}

NumberEditBox.prototype.setValue = function(valueunit) {
	this.onUpdate = true;

	var idx = valueunit.search(/[^-\.0-9]/);
	var value = idx!=-1 ? valueunit.substring(0, idx) : valueunit;
	var unit = valueunit.substring(idx);
	changeScrollbar(this.element.lastChild, this.rate * new Number(value));
	this.element.firstChild.nextSibling.selectedIndex = this.units.indexOf(unit);
	this.textbox.value  = value;

	this.onUpdate = false;

}
NumberEditBox.prototype.init = function() {
	this.onUpdate = true;
	changeScrollbar(this.scrollbar, this.scrollbar.initial);
	this.textbox.value = "";
	this.onUpdate = false;

}

// color edit
function ColorEditBox(name, option, onChange) {
	this.name = name;
	this.option = option;
	this.onChange = onChange;
	this.textbox = null;
	this.colorpicke = null;
}

ColorEditBox.prototype.create = function() {
	this.element = xml2Dom(
			<hbox>
				<textbox  oninput="this.editBox.onChange(this.editBox);" flex="1"/>
				<colorpicker onchange="this.previousSibling.value = this.color; this.editBox.onChange(this.editBox)" flex="1" type="button"/>
			</hbox>
			);
	this.textbox = this.element.firstChild;
	this.colorpicker = this.element.lastChild;

	this.textbox.editBox = this;
	this.colorpicker.editBox = this;
	return this.element;
}

ColorEditBox.prototype.getValue = function() {
	return this.textbox.value;
}
ColorEditBox.prototype.setValue = function(value) {
	this.textbox.value = this.colorpicker.color = value;
}
ColorEditBox.prototype.init = function() {
	this.textbox.value = "";
	this.colorpicker.color = "ButtonFace";
}


function RadioEditBox(name, option, onChange) {
	this.name = name;
	this.option = option;
	this.onChange = onChange;
	this.element = null;
	this.value = null;
}

RadioEditBox.prototype.create = function() {
	var radiogroup_xml = <radiogroup oncommand="this.editBox.onChange(this.editBox)" 
				onclick="if(event.button==2) {this.editBox.init(); this.editBox.onChange(this.editBox)}"
				onkeypress="if(event.keyCode== event.DOM_VK_DELETE) {this.editBox.init(); this.editBox.onChange(this.editBox)}" orient="horizontal"  equalsize="always" />

	var radiogroup = xml2Dom(radiogroup_xml);
	radiogroup.editBox = this;

	for (var i = 0; i < this.option.values.length; i++) {
		var radio = xml2Dom(<radio label={this.option.values[i]} flex={1} value={this.option.values[i]}/>);
		radiogroup.appendChild(radio);
	}
	this.element = radiogroup;
	return this.element;
}
RadioEditBox.prototype.getValue = function(){
	if (this.element.selectedIndex == -1) return null;
	else 
		return this.element.value;
}
RadioEditBox.prototype.setValue = function(value){
	this.element.selectedIndex = this.option.values.indexOf(value);//getAttribute(name));
}
RadioEditBox.prototype.init = function(){
	try {
		this.element.selectedItem =  null;
	} catch(e){//error in Firefox2
	}
}

function changeScrollbar(scrollbar, value) {
	if (new Number(scrollbar.getAttribute('maxpos')) < new Number(value)) {
		scrollbar.setAttribute('maxpos', value);
	}
	scrollbar.setAttribute('curpos', value);
}
function syncScrollbarWithTextbox(scrollbar, textbox, rate) {
	var curpos = scrollbar.getAttribute('curpos');
	if (curpos == 0){curpos = ''} 
	if (rate) {curpos=Math.round(curpos*rate*100)/100};
	scrollbar.tooltipText=curpos;
	textbox.value = curpos; 
	//setAttr(textbox.treeitem,textbox.name,textbox.value)
}

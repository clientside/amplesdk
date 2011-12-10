const MAXOFRADIOs = 2;
var attributesBoxList = new Object();
//var eventsBoxList = new Object();

//global variables container 
var xulgear = {
}
function ElementInfo(element) {//ei for short, treeitem.ei = new ElementInfo(element);
	this.attrs = {};
	this.styles = {};
	this.idTreecell = null;
	this.element = element;
	this.styleRow = null;
}

function getTargetDocument() {
	try {
		return document.getElementById('targetWindow').contentDocument;
	} catch(e) {
		return this.targetDocument;
		//return this.targetWindow.document;
	}
}

var ncall = 0;
function initWindow(event) {
	if (ncall>0) return;
	ncall++;

	//set target property to the corresponding xul element
	var w = document.getElementById("window-treeitem");
	w.target = getTargetDocument().documentElement;//this.parent.targetWindow.document.documentElement;
	w.target.attrs = {xmlns:"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"};
	w.target.styles = {};

	w.idTreecell = w.target.idTreecell = this.document.getElementById("window-treecell");

	var doc = getTargetDocument();//this.parent.targetWindow.document;
	var skinitem = document.getElementById('global-skin-treeitem');
	skinitem.target = doc.createProcessingInstruction("xml-stylesheet", "href=\"chrome://global/skin/\" type=\"text/css\"");
	skinitem.target.attrs = {href:"chrome://global/skin/", type: "text/css"}
	doc.insertBefore(skinitem.target, doc.firstChild);
	
	createAttributesBox(w.target.tagName);
	createEventsBox(w.target);
	createStylesBox();


	initContextMenu();
	initNewElement();

	//select window in the element tree
	var tree = this.document.getElementById("element-tree");
	tree.target = getTargetDocument();
	tree.view.selection.select(1);

	if (location.search) {
		webopen(location.search);
	}
}
function initContextMenu() {
	var parentPopup = this.document.getElementById("new-element");
	parentPopup.menuitems = []
	for (var i in elementList) {
		var menuitem = xml2Dom(
			<menuitem label={i} oncommand={"createXULElements(this.label)"}/>
					);
		parentPopup.appendChild(menuitem);
		parentPopup.menuitems[i] = menuitem;
	}
}
function createAndMove(name, move) {
	var treeitem = createXULElements(name);
	if (move) {
		selectTreeitem(treeitem);
	}
}
function initNewElement() {
	var box = document.getElementById('new-element-box');

	box.buttons = {};
	for (var i in elementList) {
		var xml = <button hidden="true" crop="right" label={i} ondraggesture="dragStartFromNewElement(this.label)" onclick={"if(2 == event.button)prependXULElement('"+i+"', event.shiftKey);"} onmousedown={"if(event.button==1)createAndMove('"+i+"', true);"} oncommand={"createAndMove('"+i+"', event.shiftKey);"}/>;
		var button = xml2Dom(xml);
		box.appendChild(button); 
		box.buttons[i] = button;
	}
}
function passFilterToContextMenu() {
	var element = getSelectedTreeitems()[0].target;
	var parentPopup = this.document.getElementById("new-element");

	for (var i in parentPopup.childNodes) {
		parentPopup.childNodes[i].hidden = true;
	}

	if (element.tagName in availableChildren) {
		for (var i in availableChildren[element.tagName]) {
			parentPopup.menuitems[availableChildren[element.tagName][i]].hidden = false;
		}
	} 
	if ('isBox' in elementList[element.tagName]){
		for (var i in availableChildren["box"]) {
			parentPopup.menuitems[availableChildren["box"][i]].hidden = false;
		}
	}
}
function selectTreeitem(treeitem) {
	var tree = document.getElementById('element-tree');
	tree.view.selection.select(tree.view.getIndexOfItem(treeitem));
}
//set the element to a firstChild of the parentNode
function prependXULElement(elementName, move) {
	var treeitem = createXULElements(elementName);
	treeitem.parentNode.insertBefore(treeitem, treeitem.parentNode.firstChild);
	treeitem.target.parentNode.insertBefore(treeitem.target, treeitem.target.parentNode.firstChild);
	if (move) {
		selectTreeitem(treeitem);
	}
}

function createXULElements(elementName) {
	var parentTreeitems = getSelectedTreeitems();
	var treeitems = [];
	for (var i = 0; i < parentTreeitems.length; i++) {
		var element = createXULElement(elementName);
		parentTreeitems[i].target.appendChild(element);
		var treeitem = addElementToElementTree(element, parentTreeitems[i]);
		treeitems.push(treeitem);
	}
	addAction(new Action(INSERT, treeitems));
	//createAttributesBox(elementName);
	return treeitem;
}

function createXULElement(elementName, attrs, styles) {
	var doc = getTargetDocument();//this.parent.targetWindow.document;

	//create target xul element
	if ('namespace' in elementList[elementName]) {
		var element = doc.createElementNS(elementList[elementName].namespace, elementName);
		element.attrs = {xmlns: elementList[elementName].namespace};//cloneObject(attributes);
	} else if ('alt_namespace' in elementList[elementName]){
		var element = doc.createElementNS(elementList[elementName].alt_namespace, elementName);
		element.attrs = {};//cloneObject(attributes);
	} else {
		var element = doc.createElement(elementName);
		element.attrs = {};//cloneObject(attributes);
	}
	element.styles = {};
	for (var j in styles) {
		element.styles[j] = styles[j];
	}

	//set default value
	if ('attributes' in elementList[elementName] && !attrs) {
		var attributes = elementList[elementName].attributes;
		for (var j in attributes) {
			if ('value' in attributes[j]) {
				element.setAttribute(j, attributes[j].value);
				element.attrs[j] = attributes[j].value;
			}
		}
	}
	//init attributes with attrs in arguments
	if (attrs) {
		for (var j = 0; j < attrs.length; j++) {
			if (attrs[j].name == "src") {
				element.setAttribute(attrs[j].name, resolveURI(attrs[j].value));
			} else {
				element.setAttribute(attrs[j].name, attrs[j].value);
			}
			element.attrs[attrs[j].name] = attrs[j].value;
		}
	}
	//element.addEventListener("mouseover", function () {syncElement(treeitem)}, true); //
	
	createAttributesBox(elementName);
	return element;
}
/*
var preTreeitem = null;
function syncElement(treeitem) {
	treeitem.firstChild.setAttribute("properties", "sync");
	if (preTreeitem) 
		preTreeitem.firstChild.removeAttribute("properties");
	preTreeitem = treeitem;
}
*/


function addElementToElementTree(xulElement, parentTreeitem) {
	parentTreeitem.target.appendChild(xulElement);
	parentTreeitem.setAttribute("container", "true");
	parentTreeitem.setAttribute("open", "true");

	var treeitem =  //as xml
	<treeitem>
		<treerow>
			<treecell editable="false" />
			<treecell/>
		</treerow>
		<treechildren/>
	</treeitem>;

	if (xulElement.nodeType == xulElement.TEXT_NODE) {//nodetext
		treeitem.treerow.treecell[0].@label = "[#text]";
		delete treeitem.treechldren;
	} else if (xulElement.nodeType == 7) {//processing instruction
		treeitem.treerow.treecell[0].@label = "#"+xulElement.nodeName+"";
	} else if (xulElement.nodeType == xulElement.ELEMENT_NODE) {//assume element
		treeitem.treerow.treecell[0].@label = xulElement.tagName;

		treeitem.treerow.treecell[1].@id = "iTc"+Math.random();
		if (xulElement.hasAttribute("id")) { 
			treeitem.treerow.treecell[1].@label = xulElement.id;
		}
	} else {
		alert('error: other type of node');
	}

	treeitem = xml2Dom(treeitem);

	treeitem.target = xulElement;
	treeitem.idTreecell = treeitem.firstChild.lastChild; //xulElement.idTreecell = 
	parentTreeitem.lastChild.appendChild(treeitem);
	return treeitem;
}

function removeAttr(label, name) {
	var treeitem = label.treeitem;//parentNode.parentNode.treeitem;
	var grid = attributesBoxList[treeitem.target.tagName];
	setLabelAsWithValue(label, false);
	treeitem.target.removeAttribute(name);
	delete treeitem.target.attrs[name];
}

function setAttr(label, name, value) {
	var treeitem = label.treeitem;//parentNode.parentNode.treeitem;
	var elementName = treeitem.target.tagName;
	if ('attributes' in elementList[elementName] && name in elementList[elementName].attributes) {
		var alt_prop = elementList[elementName].attributes[name].alt_prop;
	}

	if (!value) {
		removeAttr(label, name);
		if (alt_prop) { treeitem.target[alt_prop] = ""; }
		return;
	} 
	setLabelAsWithValue(label, true);
	/*
	var amp = value.indexOf('&');
	var entities = {"&amp;": "&"};
	if(amp != -1) {
		var period = value.indexOf(';', amp);
		if (period != -1)
		value = value.substring(0, amp)+entities[value.substring(amp, period+1)];
	}
	*/
	if (alt_prop) {
		treeitem.target.setAttribute(name, value);
		treeitem.target[alt_prop] = value;
	} else {
		if (name == 'style') {
			var style = value;
			for (var i in treeitem.target.styles) {
				style += ";"+i+":"+treeitem.target.styles[i];
			}
			treeitem.target.setAttribute(name, style);
		} else if (name == 'src') {
			treeitem.target.setAttribute(name, resolveURI(value));
		} else {
			treeitem.target.setAttribute(name, value);
		}

	}
	treeitem.target.attrs[name] = value;
}
function createTexts(str) {
	var parentTreeitems = getSelectedTreeitems();

	for (var i=0;i < parentTreeitems.length; i++) {
		var text = createText(str);//doc.createTextNode(str);
		parentTreeitems[i].target.appendChild(text);
		var treeitem = addElementToElementTree(text, parentTreeitems[i]);
	}
}
function createText(str) {
	var doc = getTargetDocument();//this.parent.targetWindow.document;
	var text = doc.createTextNode(str);
	return text;
}

function createAttributesBox(elementName) {
	var grid_xml =
	<grid style="overflow:auto">
		<columns>
			<column ordinal="center"/>
			<column flex="1"/>
		</columns>
		<!--rows-->
	</grid>;
	if (!(elementName in attributesBoxList)) {
		var grid = attributesBoxList[elementName] = xml2Dom(grid_xml);//document.createElement("grid");
		//document.getElementById("attributes-deck").appendChild(grid);
		grid.appendChild(createAttributeRows(elementName));
	}
}

function createAttributeRows(xulElementName) {
	var rows = this.document.createElement("rows");
	var grid = attributesBoxList[xulElementName];
	var row_xml = <row align="center"><label ondblclick="this.parentNode.editBox.init();onChangeAttribute(this.parentNode.editBox)" class="attribute-label" /></row>;

	if ("attributes" in elementList[xulElementName])
	for (var name in elementList[xulElementName]["attributes"]) {
		row_xml.label.@value = name;
		var row = xml2Dom(row_xml, document);
		row = createAttributeRow(row, name, elementList[xulElementName]["attributes"][name]);
		rows.appendChild(row);
	}

	rows.appendChild(xml2Dom( <separator class="groove"/> ));

	// common attributes
	for (var name in commonAttributes) {
		if (elementList[xulElementName].noview && !commonAttributes[name].noview) {
			continue;
		}
		if (name == "id") {
			row_xml.label.@ondblclick = "this.parentNode.editBox.init();onIdChange(this.parentNode.editBox)";
		} else {
			row_xml.label.@ondblclick = "this.parentNode.editBox.init();onChangeAttribute(this.parentNode.editBox)"
		}
		row_xml.label.@value = name;
		var row = xml2Dom(row_xml);

		row = createAttributeRow(row, name, commonAttributes[name]);
		rows.appendChild(row);

		if (name == "style") {
			grid.styleRow = row;
		}
	}
	return rows;
}

function syncTreecellWithTextbox(treecell, textbox) {
	textbox.value = treecell.getAttribute('label');
}

function onChangeAttribute(editBox) {
	//if (!onChangeAttributesBox)
	setAttr(editBox.element.previousSibling, editBox.name, editBox.getValue());
}
function onIdChange(editBox) {
	onChangeAttribute(editBox);
	editBox.element.previousSibling.treeitem.idTreecell.setAttribute('label', editBox.getValue());
}
function onStyleChange(editBox) {
	onChangeAttribute(editBox);
	editBox.element.previousSibling.treeitem.target.styles = parseStyle(editBox.getValue());
	changeStylesBox(getSelectedTreeitems()[0]);
}
function createAttributeRow(row, name, attr) {
		var type = attr["type"];
		if (type == AT_NUM) { //integer type, put a scrollbar to edit the number
			row.editBox = new SimpleNumberEditBox(name, attr, onChangeAttribute);
			row.appendChild(row.editBox.create());

		} else if (type == AT_STR || type == undefined) { // string type, put a textbox
			var onchange = onChangeAttribute;
			if (name == "id") {//attr["treecol"]) {
				var onchange = onIdChange;
			} else if (name == "style") {
				var onchange = onStyleChange
			}
			row.editBox = new TextEditBox(name, attr, onchange);
			row.appendChild(row.editBox.create());
			if (name == "id") {
				row.appendChild(xml2Dom(<observes attribute="label" onbroadcast="syncTreecellWithTextbox(this.parentNode.firstChild.treeitem.idTreecell, this.previousSibling);onChangeAttribute(parentNode.editBox)"/>));
			}
		} else if (type == AT_SELECT && attr["values"].length > MAXOFRADIOs) { //menulist
			row.editBox = new SelectEditBox(name, attr, onChangeAttribute);
			row.appendChild(row.editBox.create());
		} else if (type == AT_SELECT || type == AT_BOOL) { // radiogroup for BOOL and select
			if (type == AT_BOOL) {
				attr["values"] = bools;//bools is defined in data.js
			}
			row.editBox = new RadioEditBox(name, attr, onChangeAttribute);
			row.appendChild(row.editBox.create());
		}
		return row;
}
function setLabelAsWithValue(label, hasValue) {
	label.style.fontWeight = hasValue ? "bold": "";
}
//var onChangeAttributesBox = false;
function changeRows(treeitem) {
	var xulElement = treeitem.target;
		
	//onChangeAttributesBox = true;
	var grid = attributesBoxList[xulElement.tagName];
	grid.getElementsByTagName('rows')[0].treeitem = treeitem;
	var rows = grid.getElementsByTagName("row");

	for (var i = 0; i < rows.length; i++) {
		var row = rows.item(i);
		var label = row.firstChild;//row.getElementsByTagName("label").item(0);
		label.treeitem = treeitem;
		var name = label.getAttribute("value");

		var hasValue = name in xulElement.attrs;

		setLabelAsWithValue(row.firstChild, hasValue);

		if (name == "id") {
			var observes = row.lastChild;
			observes.setAttribute("element", treeitem.idTreecell.id);
		}
		if (hasValue) {
			row.editBox.setValue(xulElement.attrs[name]);
		} else {
			row.editBox.init();
		}
	}
	//onChangeAttributesBox = false;
}
function addEvent(treeitem, name, func) {
	//treeitem.target.removeAttribute(name); 
	treeitem.target.setAttribute(name, func); 
	treeitem.target.attrs[name] = func;//element.value;
}

function insertTab(textbox){
	var scrollTop = textbox.inputField.scrollTop;
	var scrollLeft = textbox.inputField.scrollLeft;
	
	var pos = textbox.selectionStart;
	textbox.value = textbox.value.substring(0, pos)+'\t'+textbox.value.substring(textbox.selectionEnd);//, textbox.value.length);
	textbox.selectionStart=textbox.selectionEnd=pos+1;
	
	textbox.inputField.scrollTop = scrollTop;
	textbox.inputField.scrollLeft = scrollLeft;
	//textbox.setSelectionRange(pos+1,pos+1);
}
//generate event box
function createEventsBox(element) {
	var name = element.tagName;
	var tabpanel = document.getElementById('events-tabpanel');

	var tabbox = xml2Dom(<tabbox id="events-tabbox" flex="1" style="margin:0px; padding:0px" >
				<tabs style="overflow:hidden"/>
				<tabpanels style="margin:0px; padding:4px" flex="1"/>
			</tabbox>);
	tabbox.eventTabMap = {}
	var eventGroup = {};
	for (var i in elementList) {
		if (elementList[i].events) { eventGroup[i] = elementList[i].events; }
	}
	for (var i in commonEventsGroup) { eventGroup[i] = commonEventsGroup[i]; }

	for (var i in eventGroup) {
		tabbox.eventTabMap[i] = tabbox.firstChild.appendChild(xml2Dom(<tab label={i}/>));
		var panel = xml2Dom(<tabpanel orient="vertical" ></tabpanel>);
		for (var j=0; j < eventGroup[i].length; j++) {
			var label = eventGroup[i][j];
			panel.appendChild(xml2Dom(<vbox flex="1"><label value={label}/><textbox oninput={"addEvent(treeitem, '"+label+"', this.value)"} multiline="true" wrap="off" onkeypress="if (event.keyCode == event.DOM_VK_TAB &amp;&amp; !event.ctrlKey) {insertTab(this); return false;}" flex="1"/></vbox>));
			panel.appendChild(xml2Dom(<splitter tooltiptext={label} collapse="none"><!--<grippy/>--></splitter>));
		}
		tabbox.lastChild.appendChild(panel);
	}
	tabpanel.appendChild(tabbox);
}
function changeEventsBox(treeitem) {
	var tabbox = document.getElementById('events-tabbox');
	var tabs = tabbox.getElementsByTagName('tab');
	var tabpanels = tabbox.getElementsByTagName('tabpanel');
	
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].hidden = true;
	}
	for (var i in commonEventsGroup) {
		tabbox.eventTabMap[i].hidden = false;
	}
	if (tabbox.eventTabMap[treeitem.target.tagName]) {
		tabbox.eventTabMap[treeitem.target.tagName].hidden =false;
		tabbox.selectedTab = tabbox.eventTabMap[treeitem.target.tagName];
	} else {
		tabbox.selectedTab = tabbox.eventTabMap['mouse'];
	}
	var labels = tabbox.getElementsByTagName('label');
	for (var j = 0; j < labels.length; j++) {
		var label = labels[j];
		var textbox = label.nextSibling;
		textbox.treeitem = treeitem;

		if (label.value in treeitem.target.attrs) {
			textbox.value = treeitem.target.attrs[label.value];
		} else {
			textbox.value = "";
		}
	}
}
function updateAttributesList(treeitem) {
	var xulElement = treeitem.target;
	if (xulElement.nodeType == xulElement.TEXT_NODE) {
		var textbox = document.getElementById("textnode");
		textbox.parentNode.selectedPanel = textbox;
		textbox.value = xulElement.data;
		textbox.target = xulElement;
		textbox.treeitem = treeitem;
		if (treeitem.onTab) {
			textbox.collapsed = true;
		} else {
			textbox.collapsed = false;
		}
	} else if (xulElement.nodeType == xulElement.PROCESSING_INSTRUCTION_NODE) {
		var piBox = document.getElementById('pi-box');
		var name= piBox.firstChild.lastChild;
		var valueBox = piBox.firstChild.nextSibling.lastChild;
		valueBox.readOnly = true;
		name.value = xulElement.nodeName;
		valueBox.value = xulElement.attrs['href'];
		piBox.lastChild.hidden = true;
		piBox.parentNode.selectedPanel = piBox;
	} else {
		var infobox = document.getElementById("elementInfoBox");
		if (infobox.selectedIndex != 0) {
			infobox.selectedIndex = 0;
		}
	var deck = document.getElementById("attributes-deck");
	var attrBox = attributesBoxList[xulElement.tagName];
	if (!attrBox.parentNode) {
		deck.appendChild(attrBox);
	}
	deck.selectedPanel = attrBox;
	changeRows(treeitem);

	changeEventsBox(treeitem);
	changeStylesBox(treeitem);

	}
}
function updateNewElementsBox(treeitem) {
	var box = document.getElementById('new-element-box');

	var separator = box.getElementsByTagName('separator')[0];
	box.insertBefore(separator, box.firstChild);

	var names = {};
	if (treeitem.target.tagName in availableChildren) {
		var childs = availableChildren[treeitem.target.tagName];
		var insertPoint = box.firstChild;
		for (var j = 0; j < childs.length; j++) {
			var name = childs[j];
			names[name] = true;
			box.insertBefore(box.buttons[name], insertPoint);
			box.buttons[name].hidden = false;
		}
	}

	var separatorHidden = true;
	if (elementList[treeitem.target.tagName].isBox) {//
		for (var i=0; i < availableChildren['box'].length; i++) {
			var name = availableChildren['box'][i];
			names[name] = true;
			box.buttons[name].hidden = false;
		}
		separatorHidden = !(j>0);
	}//

	var buttons  = box.getElementsByTagName('button');
	for (var i=0; i < buttons.length; i++) {
		var button = buttons[i];
		//if (button.tagName != "button")continue;
		if (button.hidden == false && !(button.label in names))
			button.hidden = true;
	}
	separator.hidden = separatorHidden;

}
function selectElement() {
	var treeitems = getSelectedTreeitems();
	if (treeitems.length) {
		updateAttributesList(treeitems[0]);
		if (treeitems[0].target.nodeType == 1)
			updateNewElementsBox(treeitems[0]);
	}
}

function getSelectedTreeitems() {
	var tree = this.document.getElementById("element-tree");
	var numRanges = tree.view.selection.getRangeCount();

	var elements = [];
	for (var t=0,start={},end={}; t < numRanges; t++){
		tree.view.selection.getRangeAt(t,start,end);
		for (var v = start.value; v <= end.value; v++){
			elements.push(tree.view.getItemAtIndex(v));
		}
	}
	return elements;
}

function setAttributes(el, attrs) {
	for (var i in attrs) {
		el.setAttribute(i, attrs[i]);
	}
}
function xml2Dom(xml, doc) {//consider elements 
	if (!doc) { doc = document;}
	
	var el = doc.createElement(xml.name());
	
	var attributes = xml.attributes();
	for each(i in attributes) {
		el.setAttribute(i.name(), i);
	}
	
	var elements = xml.elements();
	for (var i in elements) {
		el.appendChild(xml2Dom(elements[i], doc));
	}
	
	return el;
}
function onStyle(editBox) {
	//if(!onChangeStylesBox) 
		addStyle(editBox.element.previousSibling, editBox.name, editBox.getValue());
	var treeitem = editBox.element.previousSibling.treeitem;
	var styleRow = attributesBoxList[treeitem.target.tagName].styleRow;

	var s = "";
	for (var i in treeitem.target.styles) {
		s += i+":"+treeitem.target.styles[i]+";";
	}
	if (styleRow) { //if it is noview, styleRow does not exist.
		styleRow.editBox.setValue(s);
		setAttr(styleRow.firstChild, "style", s);
	}
}

function createStylesBox() {
	var rows = document.getElementById("style-rows");
	const  EditBoxs = [TextEditBox, NumberEditBox, SelectEditBox, ColorEditBox];

	for (var group in style_groups) {
		for (var name in style_groups[group]) {
			var row_xml = <row align="center" tooltiptext={name}>
					<label minwidth="80" crop="right" tooltiptext={name} value={name}/>
				</row>;
			var row = xml2Dom(row_xml);
			row.name = name;

			var style = style_groups[group][name];
			var type = style.type == undefined ? ST_STR: style.type;

			row.editBox = new (EditBoxs[type])(name, style, onStyle);
			row.appendChild(row.editBox.create());
			rows.appendChild(row);
		}
		rows.appendChild(xml2Dom(<separator class="groove-thin"/>));
	}
}

function closeWindow() {
	this.close();
}
//var onChangeStylesBox = false;
function changeStylesBox(treeitem) {
	var styleRows = document.getElementById("style-rows");
	styleRows.treeitem = treeitem;

	//onChangeStylesBox = true;
	var labels = styleRows.getElementsByTagName('label');
	for (var i = 0, length=labels.length; i < length; i++ ) {
		var label = labels[i];
		label.treeitem = treeitem;
		var row = label.parentNode;
		var name = label.value;
		var styles = treeitem.target.styles;

		var hasValue = name in styles;

		if (hasValue)
			row.editBox.setValue(styles[name]);
		else 
			row.editBox.init();

		setLabelAsWithValue(label, hasValue);
	}
	//onChangeStylesBox = false;
}
function addStyle(label, name, value) {
	if (!value) {
		removeStyle(label, name);
		return;
	}
	var treeitem = label.treeitem;//.parentNode.parentNode.treeitem;
	treeitem.target.styles[name] = value;
	setLabelAsWithValue(label, true);
}
function removeStyle(label ,name) {
	delete label.treeitem.target.styles[name]; //var treeitem = ;
	setLabelAsWithValue(label, false);
}

var focusedElement = null; //dummy object which has a setAttribute function
var preRow = 0;
var preStyle = {};
const lightStyle = {color:"green", borderTopStyle:"solid", borderTopWidth:"1px", borderTopColor:"green"
		, borderLeftStyle:"solid", borderLeftWidth:"1px", borderLeftColor:"green"
		, borderRightStyle:"solid", borderRightWidth:"1px", borderRightColor:"green"
		, borderBottomStyle:"solid", borderBottomWidth:"1px", borderBottomColor:"green"}
function lightup(event){
	var row = {}, obj = {};
	var tree = this.document.getElementById("element-tree");
	tree.boxObject.QueryInterface(Components.interfaces.nsITreeBoxObject);
	tree.boxObject.getCellAt(event.clientX, event.clientY, row, {}, obj);

	if (preRow != row.value) {
		preRow = row.value;

		if (focusedElement) {
			for (var i in lightStyle) {
				//if (i in preStyle) {// && focusedElement.style[i] == lightStyle[i]) {
						focusedElement.style[i] = preStyle[i];
				//}
			}
		}

		if (row.value == -1) {
			focusedElement = null;return;
		}
		var treeitem = tree.view.getItemAtIndex(row.value);
		if (treeitem.target.nodeType != 1)return;

		focusedElement = treeitem.target;
		for (var i in lightStyle) {
			preStyle[i] = treeitem.target.style[i];
			treeitem.target.style[i] = lightStyle[i];
		}
	}
}
function lightDown() {
	if (focusedElement) {
		for (var i in lightStyle) {
			if (i in preStyle) {// && focusedElement.style[i] == lightStyle[i]) {
					focusedElement.style[i] = preStyle[i];
			}
		}
	}
	focusedElement = null;
	preStyle = {};
}
function getPropertyName(name){
	var list = name.split('-');
	for (var i = 1; i < list.length; i++) {
		list[i] = list[i].substring(0,1).toUpperCase()+list[i].substring(1,list[i].length);
	}
	return list.join('');
}
/*
function getSelectedElements() {
	var treeitems = getSelectedTreeitems();
	var l = [];
	for (var i in treeitems) {
		l[i] = treeitems[i].target;
	}
	return l;
}
function cloneObject(obj) {//shallow
	var newobj = {};
	for (var i in obj) {
		newobj[i] = obj[i];
	}
	return newobj;
}
function assert(cond) {
	if (!cond) {
		alert("assertion error!"+arguments.callee.caller);
	}
}
*/

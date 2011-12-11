//attribute type(0:integer, 1:string, 2:select, 3:boolean)
//default value: 1:string
const AT_NUM = 0;
const AT_STR = 1;
const AT_SELECT = 2;
const AT_BOOL = 3;

var commonAttributes = {	
	"id": {treecol:1, noview:true},
	"class": {noview:true},
	"style": {},
	"flex": {type: AT_NUM},
	"hidden": {type:AT_BOOL},
	"tooltiptext": {},
	"orient": { type: AT_SELECT, values:["horizontal", "vertical"]}, 
	"pack" : {type: AT_SELECT, values: ["start", "center", "end"]},
	"dir": {type: AT_SELECT, values: ["normal", "reverse"]},
	"align": {type: AT_SELECT, values: ["start", "center", "end", "baseline", "stretch", "left", "center", "right"]}, 
	"popup": {},
	/*
	"top": {type: AT_NUM, max: 512},
	"bottom": {type: AT_NUM, max: 512},
	"left": {type: AT_NUM, max: 512},
	"right": {type: AT_NUM, max: 512},
	*/
	"width": {type: AT_NUM, max: 1024},
	"height": {type: AT_NUM, max: 1024}
 };

const availableChildren = {
	"box": ["button", "textbox", "label", "description", "box", "hbox", "vbox", "arrowscrollbox","browser", "canvas" ,"checkbox", "colorpicker","datepicker","deck", "grid",  "groupbox","iframe", "image",  "listbox","menubar",  "menulist","panel",  "progressmeter",   /*"bbox",*/"radiogroup", "richlistbox", "resizer",  "scale", "separator", "scrollbar","spacer", "splitter","stack",  "statusbar", "svg", "tabbox","timepicker", "toolbox", "tree"],

	"window": ["script", "style", "keyset", "popupset"],

	"tree": ["treecols", "treechildren", "treeitem"],
	"treecols": ["treecol", "splitter"],
	"treechildren": ["treeseparator", "treeitem"],
	"treeitem": ["treerow", "treechildren"],
	"treerow": ["treecell"],
	"treeseparator": [],

	"grid": ["rows", "columns"],
	"rows": ["row"],
	"columns": ["column"],

	"splitter": ["grippy"],
	"checkbox": [],
	"description": ["pre"],
	"groupbox": ["caption"],

	"listbox": ["listhead", "listcols", "listitem"],
	"listcols": ["listcol"],
	"listitem": ["listcell"],
	"listhead": ["listheader"],

	"radiogroup": ["radio"],

	"menubar": ["menu"],
	"menu": ["menupopup"],
	"menulist": ["menupopup"],
	"menupopup": ["menu", "menuitem", "menuseparator"],

	"popupset": ["menupopup", "tooltip", "panel", "popup"],
	"popup": ["menu", "menuitem", "menuseparator"],

	"richlistbox": ["richlistitem"],

	"statusbar": ["statusbarpanel"],

	"tabbox": ["tabs", "tabpanels"],
	"tabs": ["tab"],
	"tabpanels": ["tabpanel"],

	/*
	"colorpicker": [],
	"datepicker": [],
	"timepicker": [],
	*/

	"toolbox": ["toolbar", "menubar"],
	"toolbar": ["toolbarbutton", "toolbaritem", "toolbarseparator", "toolbargrippy"],
	"toolbarseparator": [],
	"toolbargrippy": [],
	"toolbarbutton": [],

	"keyset": ["key"],
	"key": [],

	"template": ["rule"],
	"rule": ["where", "binding", "action"],
	"where": [],
	"action": []
}

const crops = ["start", "end", "left", "right", "center", "none"];
const bools = ["true", "false"];
var elementList = {
	"window": { "isBox": true, namespace:"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
		"attributes":{
			"hidechrome": {},
			"screenX": {type:AT_NUM, max:1000},
			"screenY": {type:AT_NUM, max:1000},
			"sizemode": {type:AT_SELECT, values:["maximized", "minimized", "normal"]},
			"title": {},
			"windowtype": {}
		},
		"styles":[],
		"events":["onload", "onunload", "onclose"]
	},
	"button": {
		"attributes": {
			"accesskey": {},
			"autoCheck": {type:AT_BOOL},
			"checkState": {type:AT_SELECT, values:[0,1,2]},
			"checked": {type:AT_BOOL},
			"crop": {type:AT_SELECT, values:crops},
			"disabled": {type:AT_BOOL},
			"dlgType": {type:AT_SELECT, values:["accept", "cancel", "help", "disclosure"]},
			"group": {},
			"image": {},
			"label": {value:"button"},
			"icon": {type:AT_SELECT, values:["accept", "cancel", "help", "open", "save", "find", "clear", "yes", "no", "apply", "close", "print", "add", "remove", "refresh", "go-forward", "go-back", "properties", "select-font", "select-color", "network"]},
			"open": {type:AT_BOOL},
			"tabindex": {type:AT_NUM, max:10},
			"type": {type:AT_SELECT, values:["checkbox", "menu", "menu-button", "radio", "repeat"]}
		},
		"events": ["oncommand"]
		,"isBox": true
	},

	"textbox": {
		"attributes": { 
			"cols": {type:AT_NUM, max:400},
			"decimalplaces": {type: AT_NUM, max:20},
			"disabled": {type:AT_BOOL},
			//"empty": {type:AT_BOOL},
			"emptytext": {},
			"hidespinbuttons": {type: AT_BOOL},
			"increment": {type: AT_NUM, max:100},
			"label": {},
			"max": {type:AT_NUM, max:2048},
			"maxlength": {type:AT_NUM, max:2048},
			"min": {type:AT_NUM, max:100},
			"multiline": {type:AT_BOOL},
			"newlines": {type:AT_SELECT, values:["pasteintact", "pastetofirst", "replacewithcommas", "replacewithspaces", "strip", "stripsurroundingwhitespace"]},
			"preference": {},
			"readonly": {type:AT_BOOL},
			"rows": {type:AT_NUM, max:100},
			"size": {type: AT_NUM, max:1024*8},
			"spellcheck": {type:AT_BOOL},
			"tabindex": {type:AT_NUM, max:100},
			"timeout": {type:AT_NUM, max:1024},
			"type": {type:AT_SELECT, values:["autocomplete", "number", "password", "timed"]},
			"value": {alt_prop:"value"}, 
			"wrap": {},
			"wraparound": {type:AT_BOOL}
		},
		"events": ["onchange", "oninput"]
		,"isBox": true
	},
	"label": {
		"attributes": {
			"control": {},
			"disabled": {type:AT_BOOL},
			"href": {},
			"value": {value:"label"}
		}
		,default_attributes: {
			"value": "label"
		}
	},
	"description":{"attributes":{ 
		"crop":{type:AT_SELECT, values:crops},
		"disabled":{type:AT_BOOL},
		"tabindex":{type:AT_NUM, max:100},
		"value": {}
		}
	},
		"box":{isBox: true },
	"hbox":{isBox:true},
	"vbox":{isBox:true},
	"action":{},
	"arrowscrollbox":{isBox:true, isTopLevel:true},
	"assign":{},
	"bbox":{isTopLevel:true, "isBox": true},
	"binding":{},
	"bindings":{},
	"broadcaster":{},
	"broadcasterset":{},
	"browser":{ "isTopLevel":true,
		"attributes": {
			"autocompleteenabled": {type:AT_BOOL},
			"autocompletepopup": {type:AT_BOOL},
			"autoscroll": {type: AT_BOOL},
			"disablehistory": {type: AT_BOOL},
			"disablesecurity": {type: AT_BOOL},
			"homepage": {},
			"showcaret": {type:AT_BOOL},
			"src": {},
			"type": {type:AT_SELECT, values:["content", "content-primary", "content-targetable"]}
		}
	},
	"canvas" :{namespace:"http://www.w3.org/1999/xhtml"
	},
	"caption":{"attributes":{"label":{}}},
	"checkbox": {
		"attributes": {
			"accesskey": { type: AT_STR},
			"disabled":{type:AT_BOOL},
			"checked":{type:AT_BOOL},
			"command":{},
			"image":{},
			"label":{value:"checkbox"},
			"preference":{},
			"crop": {type:AT_SELECT, values:crops},
			"src": {},
			"tabindex": {type: AT_NUM, max:10}
		}
		,"events": ["oncommand"]
	},

	"colorpicker":{"isTopLevel":true,
		"attributes": {
			"disabled": {type:AT_BOOL},
			"color": {alt_prop:"color"},
			"preference":{},
			"tabindex":{type:AT_NUM, max:10},
			"type": {type:AT_SELECT, values:["button"]}
		},
		"events": ["onchange"]
	},
	"column":{"isBox": true},
	"columns":{},
	"commandset":{"events": ["commandupdate"]}, 
	"command":{},
	"conditions":{},
	"content":{},
	"datepicker":{
		"attributes":{
			"disabled": {type: AT_BOOL},
			"firstdayofweek": {type:AT_SELECT, values:[0,1,2,3,4,5,6]},
			"readonly": {type:AT_BOOL},
			"tabindex": {type:AT_NUM, max:100},
			"type": {type:AT_SELECT, values:["normal", "grid", "popup"]},
			"value":{alt_prop:"value"}
		}, "events": ["onchange", "onselect"]
	},
	"deck":{"attributes":{"selectedIndex":{}}, isBox: true, "events": ["onchagne", "oncommand"]},
	"dialog":{},
	"dialogheader":{},
	"dropmarker":{},
	"editor":{},
	"grid":{},
	"grippy":{},
	"groupbox":{isBox:true},
	"iframe":{
		"attributes":{
			"showcaret": { type:AT_BOOL},
			"src": {}
		}
	},
	"image":{"attributes":{"src":{}, "validate":{type:AT_SELECT, values:["always", "never"]}},
		 "events":["onerror", "onload"]},
	"key": { noview:true,
		"attributes" : {
			"command": {},
			"disabled": {type: AT_BOOL},
			"key": {},
			"keycode": {},
			"keytext": {},
			"modifiers": {},
			"phase": {type:AT_SELECT, values:["capturing", "target"]}
		}
		,"events": ["oncommand"]
	},
	"keyset":{noview:true},
	"listbox":{
		"attributes": {
			"disabled": {type:AT_BOOL},
			"disableKeyNavigation": {type:AT_BOOL},
			"preference": {},
			"rows": {type:AT_NUM, max:100},
			"seltype": {type:AT_SELECT, values:["single", "multiple"]},
			"suppressonselect": {type:AT_BOOL},
			"tabindex":{type:AT_NUM},
			"value":{}
		}
		,"events": ["onselect","oncommand"]
	},
	"listcell":{
		"attributes": {
			"crop": {type:AT_SELECT, values:crops},
			"disabled": {type:AT_BOOL},
			"image": {},
			"label": {},
			"type": {type:AT_SELECT, values:["checkbox"]}
		}
	},
	"listcol":{},
	"listcols":{},
	"listhead":{
		"attributes": {
			"disabled": {type:AT_BOOL}
		}
	},
	"listheader":{
		"attributes": {
			"disabled": {type:AT_BOOL},
			"label":{}
		}
	},
	"listitem":{
		"attributes": {
			"accesskey": {},
			"checked": {type:AT_BOOL},
			"command": {},
			"crop": {type:AT_SELECT, values:crops},
			"current": {type:AT_BOOL},
			"disabled": {type:AT_BOOL},
			"image": {},
			"label": {},
			"preference": {},
			"selected": {type:AT_BOOL},
			"tabindex": {type:AT_NUM, max:100},
			"type": {type:AT_SELECT, values:["checkbox"]},
			"value":{}
		}
	},
	"member":{},
	"menu":{
		"attributes": {
			"acceltext":{},
			"accesskey":{},
			"allowevents":{type:AT_BOOL},
			"crop": {type:AT_SELECT, values:crops},
			"disabled": {type:AT_BOOL},
			"label": {},
			"menuactive": {type:AT_BOOL},
			"open": {type:AT_BOOL},
			"sizetopopup": {type:AT_SELECT, values:["none", "always"]},
			"value": {}
		}
		,"events": ["oncommand"]
	},
	"menubar":{ "attributes":{ "grippyhidden":{type:AT_BOOL}, "statusbar":{}} 
		,"events": ["oncommand"]
	},
	"menuitem":{
		"attributes": {
			"acceltext": {},
			"accesskey": {},
			"allowevents": {type:AT_BOOL},
			"autocheck": {type:AT_BOOL},
			"checked": {type:AT_BOOL},
			"command": {},
			"crop": {type:AT_SELECT, values:crops},
			"description": {},
			"disabled": {type:AT_BOOL},
			"image": {},
			"key": {},
			"label": {},
			"name": {},
			"selected": {type:AT_BOOL},
			"tabindex": {type:AT_NUM, max:100},
			"type": {type:AT_SELECT, values:["checkbox", "radio"]},
			"validate": {type:AT_SELECT, values:["always", "never"]},
			"value": {}
		}
		,"events": ["oncommand"]
	},
	"menulist":{
		"attributes":{
			"accesskey": {},
			"crop": {type:AT_SELECT, values:crops},
			"disableautoselect": {type:AT_BOOL},
			"disabled": {type:AT_BOOL},
			"editable": {type:AT_BOOL},
			"focused": {type:AT_BOOL},
			"image": {},
			"label": {},
			"open": {type:AT_BOOL},
			"preference": {},
			"readonly": {type:AT_BOOL},
			"sizetopopup": {type:AT_SELECT, values:["none", "always"]},
			"tabindex": {type:AT_NUM, max:100},
			"value": {}
		},
		"events": ["oncommand"]

	},
	"menupopup":{
		"attributes": {
			"ignorekeys": {type:AT_BOOL},
			"left": {type:AT_NUM, max:512},
			"position":{type:AT_SELECT, values:["after_start", "after_end", "before_start", "before_end", "end_after", "end_before", "start_after", "start_before", "overlap", "at_pointer", "after_pointer"]},
			"top": {type:AT_NUM, max:512}
		},
		"events": ["onpopuphidden", "onpopuphiding", "onpopupshowing", "onpopupshown"]
	},
	"menuseparator":{},
	"notification":{},
	"notificationbox":{},
	"observes":{},
	"overlay":{},
	"page":{},
	"panel":{isBox:true,
		"attributes": {
			"ignorekeys": {type:AT_BOOL},
			"left": {type:AT_NUM, max:1024},
			"noautofocus": { type:AT_BOOL},
			"noautohide": {type:AT_BOOL},
			"position": {type:AT_SELECT, values:["after_start", "after_end", "before_start", "before_end", "end_after", "end_before", "start_after", "start_before", "overlap", "at_pointer", "after_pointer"]},
			"top": {type:AT_NUM, max:1024}
		},
		"events": ["onpopuphidden", "onpopuphiding", "onpopupshowing", "onpopupshown"]
	},
	"param":{},
	"popup":{noview:true},
	"popupset":{noview:true},
	"preference":{},
	"preferences":{},
	"prefpane":{},
	"prefwindow":{},
	"progressmeter":{
		"attributes": {
			"mode": { type: AT_SELECT, values:["determined", "undetermined"]}
			,"value": {type:AT_NUM, max:100}
		}
	},
	"query":{},
	"queryset":{},
	"radio":{
		"attributes":{
			"accesskey": {},
			"command": {},
			"crop": {type:AT_SELECT, values:crops},
			"disabled": {type:AT_BOOL},
			"focused": {type:AT_BOOL},
			"group": {},
			"image": {},
			"label": {},
			"selected": {type:AT_BOOL},
			"tabinex": {type:AT_NUM, max:100},
			"value": {}
		}
		,"events": ["oncommand"]
	},
	"radiogroup":{isBox:true,
		"attributes":{
			"disabled": {type:AT_BOOL},
			"focused": {type:AT_BOOL},
			"preferences": {},
			"tabinex": {type:AT_NUM, max:100},
			"value": {}
		}
		,events: ["oncommand","onselect"]
	},
	"resizer":{"attributes":{ "dir":{type:AT_SELECT, values:["left", "right", "top", "bottom", "bottomleft", "bottomright", "topleft", "topright"]}}},
	"richlistbox":{
		"attributes": {
			"disabled": {type:AT_BOOL},
			"disableKeyNavigation": {type: AT_BOOL},
			"preferences": {},
			"rows": {type:AT_NUM, max:1000},
			"seltype": {type:AT_SELECT, values:["single", "multiple"]},
			"suppressonselect": {type:AT_BOOL},
			"tabinex": {type:AT_NUM, max:100},
			"value": {}
		}
	},
	"richlistitem":{ isBox:true,
		"attributes": {
			"disabled": {type: AT_BOOL},
			"searchlabel": {},
			"selected": {type: AT_BOOL},
			"tabinex": {type: AT_NUM, max:100},
			"value": {}
		}
	},
	"row":{isBox:true},
	"rows":{},
	"rule":{},
	"scale":{
		"attributes": {
			"disabled": {type:AT_BOOL},
			"increment": {type:AT_NUM, max:100},
			"min": {type:AT_NUM, max:500},
			"max": {type:AT_NUM, max:1000},
			"pageincrement": {type:AT_NUM, max:500},
			"tabinex": {type:AT_NUM, max:100},
			"value": {type:AT_NUM, max:100}
		},
		"events": ["onchange"]
	},
	"script":{ "alt_namespace": "http://www.w3.org/1999/xhtml" ,
		"attributes": {
			"src": {},
			"type": {value:"application/x-javascript"}
		}
		,noview:true
	},
	"pre": {"namespace": "http://www.w3.org/1999/xhtml"
	},
	"scrollbar":{
		"attributes":{
			"curpos": {type:AT_NUM, max:1000},
			"increment": {type:AT_NUM, max:100},
			"maxpos": {type:AT_NUM, max:1000},
			"pageincrement": {type:AT_NUM, max:100}
		}
	},
	"scrollbox":{},
	"scrollcorner":{},
	"separator":{},
	"spacer":{},
	"spinbuttons":{},
	"splitter":{
		"attributes": {
			"collapse": {type:AT_SELECT, values:["none", "before", "after", "both"]},
			"resizeafter": {type: AT_SELECT, values:["closest", "farthest", "grow", "flex"]},
			"state": {type: AT_SELECT, values:["open", "collapsed", "dragging"]},
			"substate": {type: AT_SELECT, values:["before", "after"]}
		}
	},
	"stack":{isBox:true},
	"statusbar":{},
	"statusbarpanel":{
		"attributes": {
			"crop": {type:AT_SELECT, values:crops},
			"image": {},
			"label": {}
		}
	},
	"style": { namespace:"http://www.w3.org/1999/xhtml",
		attributes: {
			"type": {value:"text/css"}
		}
		,noview:true
	},
	"stringbundle":{},
	"stringbundleset":{},
	"svg": {
		namespace: "http://www.w3.org/2000/svg",
		"attributes": {
			'version':{value:"1.1"},
			'baseProfile':{value:"full"}
		}
	},
	"tab":{
		"attributes": {
			"accesskey": {},
			//"afterselected": {type:AT_BOOL},
			//"beforeselected": {type:AT_BOOL},
			"crop": {type:AT_SELECT, values:crops},
			"disabled": {type:AT_BOOL},
			//"first-tab": {type:AT_BOOL},
			"image": {},
			"label": {},
			//"last-tab": {type:AT_BOOL},
			"linkedpanel": {},
			"selected": {type:AT_BOOL},
			"tabindex": {type:AT_NUM, max:100},
			"validate": {type:AT_SELECT, values:["always", "never"]}
		},
		"events": ["oncommand"]
	},
	"tabbrowser":{},// (Firefox 3/Gecko 1.9 以降の Firefox のみ)":{},
	"tabbox":{
		"attributes": {
			"eventnode": {type: AT_SELECT, values:["parent", "window", "document"]},
			"handleCtrlPageUpDown": {type:AT_BOOL},
			"handleCtrlTab": {type: AT_BOOL}
		}
	},
	"tabpanel":{isBox:true},
	"tabpanels":{"attributes":{"seletedIndex":{type:AT_NUM, max:100}}},
	"tabs":{
		"attributes": {
			"closebutton": {type:AT_BOOL},
			"disableclose": {type:AT_BOOL},
			"disabled": {type:AT_BOOL},
			"setfocus": {type:AT_BOOL},
			"tabinex": {type:AT_NUM, max:100},
			"tooltiptextnew": {}
		},
		"events": ["onclosetab", "onnewtab", "onselect"]
	},
	"template":{isBox:true,
		"attributes": {
			"container": {},
			"member": {}
		}
	},
	"textnode":{},
	"timepicker":{
		"attributes": {
			"disabled": {type:AT_BOOL},
			"hideseconds": {type:AT_BOOL},
			"readonly": {type:AT_BOOL},
			"increment": {type:AT_NUM, max:100},
			"tabinex": {type:AT_NUM, max:100},
			"value": {alt_prop:"value"}
		}
		,"events": ["onchange", "oncommand"]
	},
	"titlebar":{
		"attributes": {
		}
	},
	"toolbar":{
	},
	"toolbarbutton":{
		"attributes": {
			"accesskey": {},
			"autoCheck": {type:AT_BOOL},
			"checkState": {type:AT_SELECT, values:[0,1,2]},
			"checked": {type:AT_BOOL},
			"crop": {type:AT_SELECT, values:crops},
			"disabled": {type:AT_BOOL},
			"dlgType": {type:AT_SELECT, values:["accept", "cancel", "help", "disclosure"]},
			"group": {},
			"image": {},
			"label": {value:"button"},
			"open": {type:AT_BOOL},
			"tabindex": {type:AT_NUM, max:10},
			"type": {type:AT_SELECT, values:["checkbox", "menu", "menu-button", "radio"]},
			"validate": {type:AT_SELECT, values:["always", "never"]}
		},
		"events": ["oncommand", "onclick"]
	},
	"toolbargrippy":{},
	"toolbaritem":{isBox:true},
	"toolbarpalette":{},
	"toolbarseparator":{},
	"toolbarset":{},
	"toolbarspacer":{},
	"toolbarspring":{},
	"toolbox":{},
	"tooltip":{},
	"tree":{
		"attributes": {
			"disabled": {type:AT_BOOL},
			"disableKeyNavigation": {type:AT_BOOL},
			"editable": {type:AT_BOOL},
			"enableColumnsDrag": {type:AT_BOOL},
			"flags": {type:AT_SELECT, values:["dont-test-empty", "dont-build-content", "dont-test-empty dont-build-content"]},
			"hidecolumnpicker": {type:AT_BOOL},
			"rows": {type: AT_NUM, max:1000},
			"seltype": {type:AT_SELECT, values:["single", "multiple", "cell", "text"]},
			"stateddatasource": {},
			"tabinex": {type:AT_NUM, max:100}
		},
		"events": ["onselect"]
	},
	"treecell":{
		"attributes": {
			"editable": {type:AT_BOOL},
			"label": {},
			"mode": {type:AT_SELECT, values:["none", "normal", "undetermined"]},
			"properties": {},
			"ref": {},
			"src": {},
			"value": {}
		}
	},
	"treechildren":{
		"attributes": {
			"alternatingbackground": {type:AT_BOOL}
		}
	},
	"treecol":{
		"attributes": {
			"crop": {type:AT_SELECT, values:crops},
			"cycler": {type:AT_BOOL},
			"editable": {type:AT_BOOL},
			"fixed": {type:AT_BOOL},
			"hideheader": {type:AT_BOOL},
			"ignoreinclumnpicker": {type:AT_BOOL},
			"label": {},
			"primary": {type:AT_BOOL},
			"sort": {},
			"sortActive": {type:AT_BOOL},
			"sortDirection": {type:AT_SELECT, values:["ascending", "descending", "natural"]},
			"src":{},
			"type":{type:AT_SELECT, values:["checkbox", "progressmeter", "text"]},
			"width":{type:AT_NUM, max:1024}
		}
	},
	"treecols":{
		"attributes": {
			"pickertooltiptext": {}
		}

	},
	"treeitem":{
		"attributes": {
			"container": {type:AT_BOOL},
			"empty": {type:AT_BOOL},
			"label": {},
			"open": {type:AT_BOOL},
			"uri": {}

		}
	},
	"treerow":{
		"attributes": {
			"properties": {}
		}
	
	},
	"treeseparator":{
		"attributes": {
			"properties": {}
		}
	},
	"triple":{},
	"where":{},
	"wizard":{},
	"wizardpage":{}
}
//var commonEvents = ["oncommand"];
var commonEventsGroup = {
	"mouse": ["onclick", "ondblclick", "onmousedown", "onmouseup",  "onmousemove", "onmouseover", "onmouseout"/*,  "DOMMouseScroll"*/]
	,"drag": ["ondrag", "ondragdrop", "ondragend", "ondragenter", "ondragexit", "ondraggesture", "ondragover"]
	,"key": ["onkeypress", "onkeydown", "onkeyup"]
	,"focus": ["onfocus", "onblur"]
}

const ST_STR = 0;
const ST_NUM = 1;
const ST_SELECT = 2;
const ST_COLOR = 3;
var styles = {
}
const border_styles = ["solid", "dotted", "double", "groove", "ridge", "inset", "outset"];
var style_groups = {
	"visual": {
		"color": {type:ST_COLOR},
		"background-color": {type:ST_COLOR},
		"display": {type:ST_SELECT, values: ["inherit", "none", "block", "inline"]},
		"position": {type:ST_SELECT, values:["absolute", "relative", "static"]},
		"overflow": {type:ST_SELECT, values:["scroll", "hidden", "visible", "auto"]},
		"cursor": {type:ST_SELECT, values:["crosshair", "default", "hand", "move", "text", "wait", "help"]},
		"opacity": {type:ST_NUM, decimalplaces: 2, max:1, increment:0.01, initial:1, nounit:true},
		"top": {type:ST_NUM, max:1000},
		"left": {type:ST_NUM, max:1000},
		"bottom": {type:ST_NUM, max:1000},
		"right": {type:ST_NUM, max:1000},
		"float": {type:ST_SELECT, values:["left", "right", "none"]},
		"clear": {type:ST_SELECT, values:["none", "left", "right", "both"]},
		"width": {type:ST_NUM, max:1000},
		"height": {type:ST_NUM, max:1000},
		"max-height": {type:ST_NUM, max:1000},
		"max-width": {type:ST_NUM, max:1000},
		"min-height": {type:ST_NUM, max:1000},
		"min-width": {type:ST_NUM, max:1000},
		"vertical-align": {type:ST_SELECT,values:["sub", "super"]}
		//"clip": {},
		//"z-index ": {},
		//"direction": {type:ST_SELECT,values:["ltr", "rtl"]},
		//"unicode-bidi": {},
	}
	,"text": {
		"text-align": {type:ST_SELECT, values:["left", "center", "right", "justify"]},
		"text-decoration": {type:ST_SELECT, values:["underline", "overline", "line-through", "blink", "none"]},
		"text-indent": {type:ST_NUM},
		"letter-spacing": {type:ST_NUM},
		"line-height": {type:ST_NUM, max:100}
		/*
		"text-transform": {type:ST_SELECT, values:["capitalize", "uppercase", "lowercase"]}
		"text-shadow": {},
		"word-spacing": {},
		"white-space": {},
		*/
	}
	,"margin": {
		"margin": {},
		"margin-bottom": {type:ST_NUM, max:100},
		"margin-left": {type:ST_NUM, max:100},
		"margin-right": {type:ST_NUM, max:100},
		"margin-top": {type:ST_NUM, max:100}
	}
	,"padding": {
		"padding": {},
		"padding-bottom": {type:ST_NUM, max:100},
		"padding-left": {type:ST_NUM, max:100},
		"padding-right": {type:ST_NUM, max:100},
		"padding-top": {type:ST_NUM, max:100}
	}
	,"font": {
		"font": {},
		"font-family": {type:ST_SELECT, editable:true, values:["serif", "sans-serif", "cursive", "fantasy", "monospace"]},
		"font-size": {type:ST_NUM, max:100},
		"font-size-adjust": {},
		"font-stretch": {},
		"font-style": {type:ST_SELECT, values:["italic","oblique","normal"]},
		"font-weight": {type:ST_SELECT, values:["normal","bold","bolder","lighter"]}
		/*
		"font-variant": {type:ST_SELECT, values:["normal","small-caps"]},
		*/
	}
	,"background": {
		"background": {},
		"background-attachment": {type:ST_SELECT, values:["fixed", "scroll"]},
		"background-image": {},
		"background-position": {},
		"background-repeat": {type:ST_SELECT, values:["repeat", "repeat-x", "repeat-y", "no-repeat", "inherit"]}
	}
	,"border": {
		"border": {},
		"border-width": {type:ST_NUM},
		"border-color": {type:ST_COLOR},
		"border-style": {type:ST_SELECT, values:border_styles},
		"border-spacing": {},
		"border-top": {},
		"border-top-color": {type:ST_COLOR},
		"border-top-style": {type:ST_SELECT, values:border_styles},
		"border-top-width": {type:ST_NUM},
		"border-bottom": {},
		"border-bottom-color": {type:ST_COLOR},
		"border-bottom-style": {type:ST_SELECT, values:border_styles},
		"border-bottom-width": {type:ST_NUM},
		"border-left": {},
		"border-left-color": {type:ST_COLOR},
		"border-left-style": {type:ST_SELECT, values:border_styles},
		"border-left-width": {type:ST_NUM},
		"border-right": {},
		"border-right-color": {type:ST_COLOR},
		"border-right-style": {type:ST_SELECT, values:border_styles},
		"border-right-width": {type:ST_NUM}
		/*
		"border-collapse": {},
		*/
	}
	,"outline": {
		"outline": {},
		"outline-color": {},
		"outline-style": {},
		"outline-width": {}
	}
	/*
	,"print": {
		"page": {},
		"page-break-after": {},
		"page-break-before": {},
		"page-break-inside": {},
		"size": {},
		"marks": {},
		"orphans": {},
		"widows": {}
	}
	,"content": {
		"content": {},
		"quotes": {},
		"counter-increment": {},
		"counter-reset": {},
		"marker-offset": {}
	}
	,"table": {
		"caption-side": {},
		"table-layout": {},
		"empty-cells": {}
	}
	,"sound": {
		"speak": {},
		"speak-header": {},
		"speak-numeral": {},
		"speak-punctuation": {},
		"speech-rate": {},
		"stress": {},
		"volume": {},
		"voice-family": {},
		"pause": {},
		"pause-after": {},
		"pause-before": {},
		"azimuth": {},
		"cue": {},
		"cue-after": {},
		"cue-before": {},
		"elevation": {},
		"pitch": {},
		"pitch-range": {},
		"play-during": {},
		"richness": {}
	},
	"list": {
		"list-style": {},
		"list-style-image": {},
		"list-style-position": {},
		"list-style-type": {},
	}
	,"other": {
	}
	*/
}

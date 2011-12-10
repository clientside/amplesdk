//io.js


var filePath = null;
var dir = null;

function openXULFile() {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Select a XUL File", nsIFilePicker.modeOpen);
	fp.appendFilter("XUL Files (*.xul)","*.xul; *.xml");
	fp.appendFilters( nsIFilePicker.filterAll);
	var res = fp.show();

	if (res == nsIFilePicker.returnOK) {
		try {
			dir = fp.file.parent.path;
			this.document.title = fp.file.leafName + " - XUL Gear";
			openFile("file://"+fp.file.path);
			filePath = fp.file.path;
		} catch(e) {
			alert(e);
		}
	}
}

function webopen(search) {
	var values = search.substring(1).split('&');
	for (var i = 0; i < values.length; i++) {
		var value = values[i].split('=');
		if (value[0] == 'id' && value[1]) {
			var key = value[1];
			openFile("/download.py?id="+key);
			return;
		}
	}
}

function openFile(url) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if(req.status == 0 || req.readyState == 4) {
			initTargetWindow();
			initTree();

			//copying Processing Instruction, style definition,
			for (var i= 0; i < req.responseXML.childNodes.length; i++) {
				var doc = getTargetDocument();//this.parent.targetWindow.document;
				var e = req.responseXML.childNodes[i];
				if (e.nodeType == e.ELEMENT_NODE) {
					//doc.replaceChild(doc.importNode(e, true), doc.documentElement);
				} else if (e.nodeType == 7) {//PROCESSING_INSTRUCTION{
					//var node = doc.appendChild(doc.importNode(e, true));
					insertPI(createPI(e.nodeName, parsePI(e.nodeValue)));
				}
			}

			var tree = document.getElementById('element-tree');
			var doc = tree.target = getTargetDocument();//this.parent.targetWindow.document;
			//use documentFragment to reduce redrawing 
			var temp = tree.target;
			//tree.target = this.parent.targetWindow.document.createElement('window');
			buildDocument(req.responseXML.documentElement, tree);//, true);
			//this.parent.targetWindow.document.appendChild(tree.target);
			//tree.target = this.parent.targetWindow.document;
			//doc.appendChild(doc.removeChild(doc.documentElement)); //this must be here

			doc.appendChild(doc.removeChild(doc.documentElement)); //this must be here to render 

			if (parent.targetWindow.onload) parent.targetWindow.onload();
			tree.view.selection.select(1);
		} 
	}
   //if (req.readyState == 4) {
            //if (httpRequest.status == 200) {
	
	req.open('GET', url, true); 
	req.send(null);
}
//parse string of processing struction to object
function parsePI(str) {
	var attrs = {};
	var v = str.split(' ');
	for (var i = 0; i < v.length; i++) {
		var n = v[i].split('=');
		var name = n[0];
		var a0 = n[1].indexOf('"');
		var a1 = n[1].lastIndexOf('"');
		var value = n[1].substring(a0+1, a1);
		attrs[name] = value;
	}
	return attrs;
}
function createSpecifiedPI(target, href) {
	if (target == "xml-stylesheet") {
		var pi = createPI(target, {href:href, type:"text/css"});
	} else if ( target == "overlay") {
		var pi = createPI(target, {href:href});
	}
	insertPI(pi);
	/*
	treeitem.parentNode.insertBefore(treeitem, treeitem.parentNode.firstChild);
	treeitem.target.parentNode.insertBefore(treeitem.target, treeitem.target.parentNode.firstChild);
	*/
}
function createPI(target, attrs) {
	var tree = document.getElementById('element-tree');
	var doc = getTargetDocument();//this.parent.targetWindow.document;

	var tempattrs = {};
	var attrname = "";
	for (var i in attrs) {
		tempattrs[i] = attrs[i];
		if (i == "href") {
			attrname += i+"=\""+resolveURI(attrs[i])+"\" ";
		} else {
			attrname += i+"=\""+attrs[i]+"\" ";
		}
	}
	attrname = attrname.substring(0, attrname.length-1);
	var pi = doc.createProcessingInstruction(target, attrname);
	pi.attrs = tempattrs;

	return pi;
	/*
	var insertPoint = doc.documentElement ? doc.documentElement : doc.lastChild; 
	doc.insertBefore(pi, insertPoint);
	var treeitem = addElementToElementTree(pi, tree);
	insertPoint = treeitem.parentNode.lastChild.target == doc.documentElement ? treeitem.parentNode.lastChild.previousSibling : treeitem.parentNode.lastChild;
	treeitem.parentNode.appendChild(treeitem);//, insertPoint);

	return treeitem;
	*/
}
function insertPI(pi) {
	var tree = document.getElementById('element-tree');
	var doc = getTargetDocument();//this.parent.targetWindow.document;
	tree.target = doc;

	var treeitem = addElementToElementTree(pi, tree);
	insertPoint = treeitem.parentNode.lastChild.target == doc.documentElement ? treeitem.parentNode.lastChild : treeitem.parentNode.lastChild.previousSibling;
	treeitem.parentNode.insertBefore(treeitem, insertPoint);

	var insertPoint = doc.documentElement ? doc.documentElement : doc.lastChild; 
	doc.insertBefore(pi, insertPoint);
	/*
	treeitem.parentNode.insertBefore(treeitem, treeitem.parentNode.firstChild);
	treeitem.target.parentNode.insertBefore(treeitem.target, treeitem.target.parentNode.firstChild);
	*/
}
function enablePIBox(target) {
	var piBox = document.getElementById('pi-box');
	var name= piBox.firstChild.lastChild;
	var valueBox = piBox.firstChild.nextSibling.lastChild;
	valueBox.readOnly = false;
	name.value = target;
	valueBox.value = "";
	piBox.lastChild.hidden = false;
	piBox.parentNode.selectedPanel = piBox;

}
function initTargetWindow() {
	var doc = getTargetDocument();//this.parent.targetWindow.document;
	while (doc.hasChildNodes()) {
		doc.removeChild(doc.firstChild);
	}
}
function parseStyle(str) {
	var styles = {};
	var values = str.split(';');
	for (var i=0; i < values.length; i++) {
		var s = values[i].split(':');
		if (s[0] && s[1]) {
		var name = s[0].replace(/^\s+/, '').replace(/\s+$/, '');
		var value = s[1].replace(/^\s+/, '').replace(/\s+$/, '');
			if (name && value)
				styles[name] = value;
		}
	}
	return styles;

}
function buildDocument(el, parentTreeitem) { //, suspend) {

	var styles  = null;
	if (el.hasAttribute('style')) {
		styles = parseStyle(el.getAttribute('style'));
		//el.removeAttribute('style');
	}
	var newElement = createXULElement(el.tagName, el.attributes, styles);
	var treeitem = addElementToElementTree(newElement, parentTreeitem);
	for (var i=0; i < el.childNodes.length; i++) {
		var next = el.childNodes[i];
		if (next.nodeType == 1) {
			buildDocument(next, treeitem);
		} else if (next.nodeType == next.TEXT_NODE || next.nodeType == next.CDATA_SECTION_NODE) {
			var l = [], len = -1;
			do {
				l.push(next);
				len++;
				next = next.nextSibling;
			} while (next &&  (next.nodeType == next.TEXT_NODE || next.nodeType == next.CDATA_SECTION_NODE));
			i += len;
			buildTextAndCDATA(l, treeitem);
		} /*else if (next.nodeType == 5) {
			alert(0);
			//document.title = next.nodeName+": "+next.nodeValue;
		}
		*/
	}
}

function upload(id) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				alert(req.responseText);
			} else {
				alert('problem');
			}
		}
	}
	req.open('POST', "/upload.py", true); 
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send('id='+id+"&value="+encodeURIComponent(getXML()));//getXML());
}

function buildTextAndCDATA(elements, parentTreeitem) {
	var str = "";
	for (var i = 0; i < elements.length; i++) {
		var el = elements[i];
		if (el.nodeType == el.TEXT_NODE) {
			var haveData = el.nodeValue.match(/[^\x00-\x20]/);// ingnore spaces
			if (haveData) {
				str += el.data;
			}
		} else if (el.nodeType == el.CDATA_SECTION_NODE) {
			str += "<![CDATA["+el.data+"]]>";
		}


	}
	if (str != "") {
		addElementToElementTree(createText(str), parentTreeitem);
	}
}
function resolveURI(str) {
	var idx = str.indexOf('://');

	if (idx == -1) {//relative 
		return "file:///"+dir+"\\"+str;
	} else {
		var protocol = str.substring(0, idx);
		if (protocol == "http") {
		} else if (protocol == "file") {

		}
	}
	return str;
}
function initTree() {
	var children = document.getElementById("element-tree").lastChild;
	while (children.hasChildNodes()) {
		children.removeChild(children.firstChild);
	}
}

function initialize() {
	initTargetWindow();
	initTree();
	this.document.title = "XUL Gear";
	var tree = document.getElementById('element-tree');
	tree.target = getTargetDocument();//this.parent.targetWindow.document;
	insertPI(createPI('xml-stylesheet', {href: "chrome://global/skin/", type:"text/css"}));
	var el = createXULElement('window', [{name: "xmlns", value: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"}]);
	addElementToElementTree(el, tree);
	tree.view.selection.select(1);
}
function reCreate(treeitem, parentTreeitem) {
	var element = treeitem.target;
	if (element.nodeType == element.PROCESSING_INSTRUCTION_NODE) {
		treeitem.target = parentTreeitem.target.appendChild(createPI(element.nodeName, element.attrs));
	} else if (element.nodeType == element.ELEMENT_NODE && element.attrs) { //do nothing if attrs is not defined
		var el = createXULElement(element.tagName, [{name: i, value:element.attrs[i]} for (i in element.attrs)], copyObject(element.styles));
		treeitem.target = parentTreeitem.target.appendChild(el);

		var treeitems = treeitem.lastChild.childNodes;//getElementsByTagName('treeitem');
		for (var i = 0; i < treeitems.length; i++) {
			reCreate(treeitems[i], treeitem);//, element.
		}
	} else if (element.nodeType == element.TEXT_NODE) {
		var el = createText(element.data);
		treeitem.target = parentTreeitem.target.appendChild(el);
	}

}
function reConstruct(tree) {
	var nodes = [];
	for (var i=0; i < tree.lastChild.childNodes.length; i++) {
		nodes[i] = tree.lastChild.childNodes[i];
	}
	for (var i = 0; i < nodes.length; i++) {
		//reCreate(tree.lastChild.removeChild(nodes[i]), tree);
		reCreate(nodes[i], tree);
	}
}

function reload() {
	if (this.tWindow && this.tWindow.location) {
		var targetWindow = document.getElementById('targetWindow');
		targetWindow.addEventListener('load', rebuild, true);
		getTargetDocument().defaultView.location.reload(false);
		
	} else {
		rebuild();
	}
}
//To keep the open state
function rebuild() {
	this.removeEventListener('load', rebuild, true);
	var tree = document.getElementById('element-tree');
	var doc = getTargetDocument();//parent.targetWindow.document;

	//use documentfragment to reduce redrawing and keep accracy
	//tree.target = doc.createDocumentFragment();
	while (doc.hasChildNodes()) {
		doc.removeChild(doc.firstChild);//documentElement);
	}
	tree.target = doc;
	reConstruct(tree);
	//doc.appendChild(tree.target);
	doc.appendChild(doc.removeChild(doc.documentElement)); //this must be here to render 

	if (getTargetDocument().defaultView.onload) getTargetDocument().defaultView.onload();
}

function saveXULFile() {
	if (this.location.search) {
		var strs = this.location.search.substring(1).split('&');
		for (var i=0; i < strs.length; i++) {
			var value = strs[i].split('=');
			if (value[0] == 'id' && value[1]) {
				upload(value[1]);
				return;
			}
		}
	} else if (filePath) {
		var file = Components.classes['@mozilla.org/file/local;1'].createInstance();
		if (file) {
			file.QueryInterface(Components.interfaces.nsILocalFile);
		}
		file.initWithPath(filePath);
		//aFile.create(aFile.NORMAL_FILE_TYPE, 0666);
		save(file);
		return true;
	} else {
		return saveXULFileAs();
	}
}
function saveXULFileAs() {
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.appendFilter("XUL Files (xul)","*.xul");//; *.xml
	//fp.appendFilters( nsIFilePicker.filterAll);
	fp.init(window, "Select a File", nsIFilePicker.modeSave); //modeGetFolder modeOpen
	
	var res = fp.show();
	if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace) {
		try {

			//if (fp.file.path.substring(fp.file.path.length-4) == ".xul") { 
				save(fp.file);
				/*
			} else {
			var targetTempFile = Components.classes['@mozilla.org/file/local;1'].createInstance(); 
				if (targetTempFile) targetTempFile.QueryInterface(Components.interfaces.nsILocalFile); 
				targetTempFile.initWithPath(fp.file.path+".xul");
				if (targetTempFile.exists()) {
					targetTempFile.remove(false);
				}
				targetTempFile.create(targetTempFile.NORMAL_FILE_TYPE, 0666);
				save(targetTempFile);
			}
			*/

			this.document.title = fp.file.leafName+" - XUL Gear";
			return true;
		} catch(e) {
			alert(e);
		}

	}
	return false;
}

//assume that file is already opened(init).
function save(file) {
	var stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	//stream.init(thefile, 2, 0x200, false);
	stream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
	var os = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
		.createInstance(Components.interfaces.nsIConverterOutputStream);

	var charset = "UTF-8"; // any format is available whatever Mozilla supports
	os.init(stream, charset, 0, 0x0000);

	os.writeString(getXML());
	//stream.write(aText, aText.length);
	os.close();
	stream.close();


}
function getXML() {
	var pis = getPI(getTargetDocument().firstChild);//this.parent.targetWindow.document.firstChild);
	var xml = recurse(getTargetDocument().documentElement);//this.parent.targetWindow.document.documentElement);

	//new XMLSerializer().serializeToString(docu)
	//var str = '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\n' + pis+ xml.join("\n");
	var str = '<?xml version="1.0" encoding="utf-8"?>\n' + pis+ xml.join("\n");
	return str;
}
function getPI(node) {
	var str = "";
	while (node) {
		if (node.nodeType == node.PROCESSING_INSTRUCTION_NODE) {
			str += "<?"+node.nodeName;
			for (var i in node.attrs) {
				str += " "+i+"=\""+node.attrs[i]+"\"";
			}
			str += "?>\n";
		}
		node = node.nextSibling;
	}
	return str;
}
function exportXML(event) {
	try {
		var textbox = this.document.getElementById("xml-textbox");
		textbox.parentNode.parentNode.selectedIndex = 2;
		textbox.value = getXML();
	}catch(e){
		alert(e);
	}
}
function escapeXML(str) {
	return str.replace(/&/g, "&amp;").replace(/\"/g, "&quot;")
			.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttribute(str) {
	return str.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
			.replace(/\n/g, "&#xA;").replace(/\t/g, "&#x9;");
}
function mergeCDATA(str) {
	var idx = 0;
	var nextIdx = 0;;
	var result = "";
	var endOfCDATA = 0;
	while ( (nextIdx = str.indexOf("<![CDATA[", idx)) != -1 ) {
		var endOfCDATA = 3 + str.indexOf("]]>", nextIdx+9);
		result += escapeXML(str.substring(idx, nextIdx)) + str.substring(nextIdx, endOfCDATA);
		idx = endOfCDATA;
	}
	return result+escapeXML(str.substring(endOfCDATA));
				//nannde<!CDATA[ ... ]]>
}
function recurse(element) {

	var lines = [];
	var t = "<"+element.tagName;//+">";

	for (var i in element.attrs) {
		if (element.attrs[i])
		t += " "+i+"=\""+escapeAttribute(element.attrs[i])+"\"";
	}

	if (element.hasChildNodes()) {
		t += ">";
		lines.push(t);
		
		for (var i=0; i <element.childNodes.length; i++) {
			if (element.childNodes[i].nodeType == 1 && element.childNodes[i].attrs) {
				//t += "\t"+recurse(element.childNodes[i]);
				var l = recurse(element.childNodes[i]);
				for (var j=0; j<l.length; j++) {
					lines.push("\t"+l[j]);
				}
			} else if (element.childNodes[i].nodeType == 3){
				lines[lines.length-1] += mergeCDATA(element.childNodes[i].data);
			}
		}
		//t += "</"+element.tagName+">\n";
		if (element.childNodes.length == 1 && element.childNodes[0].nodeType == 3) {
			lines[lines.length-1] += "</"+element.tagName+">";
		} else {
			lines.push("</"+element.tagName+">");
		}

	} else {
		t += "/>";
		lines.push(t);
	}
	return lines;
}
function quit (aForceQuit)
{
  var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
    getService(Components.interfaces.nsIAppStartup);

  var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
  appStartup.quit(quitSeverity);
}


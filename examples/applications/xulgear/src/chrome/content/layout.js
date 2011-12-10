var layout = 0;

var layouts = [];

layouts[0] = {
show: function () {

      },
hide: function () {

      }
}
function hideLayout(num) {

}
function preload() {
	this.removeEventListener('load', preload, true);
	//alert(this.ownerDocument.defaultView.tWindow);
	if (this.ownerDocument.defaultView.tWindow.location) {
		this.addEventListener('load', rebuild, true);
		this.ownerDocument.defaultView.tWindow.location.reload(false);
	} else {
		rebuild();
	}
}
//return tabbox
function showTabbox() {
	var targetWindow = document.getElementById('targetWindow');
	targetWindow.addEventListener('load', preload, true);
	if (targetWindow.parentNode.tagName == "tabpanel") {
		return targetWindow.parentNode.parentNode.parentNode;
	}
	var parent = targetWindow.parentNode;

	var tabbox = 
		<tabbox flex="1">
			<tabs>
				<tab flex="1" class="main-tab" label="Design"/>
			</tabs>
			<tabpanels flex="1" style="margin:0px;padding:0px">
				<tabpanel flex="1" style="margin:0px; padding:0px"/>
			</tabpanels>
		</tabbox>;
	
	tabbox = xml2Dom(tabbox);
	tabbox.lastChild.firstChild.appendChild(targetWindow);
	parent.appendChild(tabbox);
	return tabbox;
}
function hideTabbox() {
	var targetWindow = document.getElementById('targetWindow');
	if (targetWindow.parentNode.tagName != "tabpanel") {
		return ;//targetWindow.parentNode.parentNode.parentNode;
	}
	targetWindow.addEventListener('load', preload, true);
	var tabbox = targetWindow.parentNode.parentNode.parentNode;
	tabbox.parentNode.appendChild(targetWindow);
	tabbox.parentNode.removeChild(tabbox);

	for (var i = 0; i < tabList.length; i++) {
		tabList[i].onTab = false;
	}
	tabList = [];
	document.getElementById('textnode').collapsed = false;
}
var tabList = [];
function removeTextnodeTab(tab) {
	var treeitem = tab.treeitem;
	var tabs = tab.parentNode;
	tabs.advanceSelectedTab(-1, true)
	tabs.removeItemAt(tabs.getIndexOfItem(tab));
	tab.tabpanel.parentNode.removeChild(tab.tabpanel);

	treeitem.onTab = false;

	var tree = document.getElementById('element-tree');
	if (treeitem == getSelectedTreeitems()[0]) {
		var textbox = document.getElementById('textnode')
		textbox.collapsed = false;
		textbox.value = treeitem.target.data;
	}

}
function showTextboxOnTabbox() {
	var treeitem = getSelectedTreeitems()[0];
	if (treeitem.target.nodeType == treeitem.target.TEXT_NODE) {
		var iframe = document.getElementById('targetWindow');
		if (treeitem.onTab && iframe.parentNode.tagName == "tabpanel") {
			var tabbox = iframe.parentNode.parentNode.parentNode;
		} else {
			var tabbox = showTabbox();
			var treeitem = getSelectedTreeitems()[0];
			treeitem.tab = tabbox.firstChild.appendChild(xml2Dom(<tab flex="1" class="main-tab" ondblclick="removeTextnodeTab(this)" label={treeitem.target.parentNode.tagName+"#text"}/>));
			treeitem.tabpanel = tabbox.lastChild.appendChild(xml2Dom(
						<tabpanel><textbox value={treeitem.target.data} onkeypress="if (event.keyCode == event.DOM_VK_TAB &amp;&amp; !event.ctrlKey) {insertTab(this);this.treeitem.target.data=(this.value); return false;}" oninput="this.treeitem.target.data=(this.value);" multiline="true" flex="1" style="font-family: monospace"/></tabpanel>));
			treeitem.tabpanel.firstChild.treeitem = treeitem;
			treeitem.tab.tabpanel = treeitem.tabpanel;
			treeitem.tab.treeitem = treeitem;
			tabList.push(treeitem);
		}
		document.getElementById('textnode').collapsed = true;
		tabbox.selectedTab = treeitem.tab;
		treeitem.onTab = true;
	}
}
function changeLayout(num) {
	var newElementBox = document.getElementById('new-element-box');
	var rightDeck = document.getElementById('right-deck');
	var tabbox = document.getElementById('elementInfoBox');
	var elementTree = document.getElementById('element-tree');
	var menubar = document.getElementById('menubar');
	var leftBox = document.getElementById('left-box');

	/*
	var elements = [i for each(i in document.documentElement.childNodes) if (i && i.tagName == "splitter")];
	for each(i in elements) {
		document.documentElement.removeChild(i);
	}
	*/


	if (layout == 0) {
		if (num == 1) {
			var t = document.getElementById('targetWindow');
			var a = t.addEventListener('load', preload, true);
			var frameParent = t.parentNode;
			//t.parentNode.removeChild(t);
			elementTree.flex=1;
			elementTree.parentNode.width=200;
			
			tabbox.width = 352;
			elementTree.parentNode.parentNode.appendChild(tabbox);//, rightDeck);
			
			tabbox.removeAttribute('flex');

			var parent = rightDeck.parentNode;
			var box = document.createElement('box');
			box.appendChild(rightDeck);
			box.flex="1";
			parent.appendChild(box);
		
			
			rightDeck.flex = 1;
			document.getElementById('right-splitter').hidden = false;
			document.getElementById('tree-bottom-splitter').hidden = true;
		}
} else if (layout == 1) {
		if (num == 0) {
			elementTree.removeAttribute('flex');
			elementTree.parentNode.width = 300;

			elementTree.parentNode.appendChild(tabbox);
		//	rightDeck.parentNode.insertBefore(newElementBox, rightDeck);
			document.getElementById('tree-bottom-splitter').hidden = false;
			document.getElementById('right-splitter').hidden = true;
			
		}
	}

	/*
	var childNodes = [i for each(i in document.documentElement.childNodes)];
	for (var i=0; i < childNodes.length; i++) {
		var el = childNodes[i];
		if(el.nodeType == 1)
		if (!el.hasAttribute('id') && el.tagName != "keyset" && el.tagName != "script" && el.tagName != "popupset") {
			document.documentElement.removeChild(el);
		}
	}
	*/

	layout = num;
	selectElement();
}

function changeLayoutFromXML(xml) {
	if ("@id" in xml) {
		var el = document.getElementById(xml.@id);
	} else {
		var el = document.createElement(xml.name());
	}
	
	for each (i in xml.elements()) {
		el.appendChild(changeLayoutFromXML(i));
	}
	return el;

}
function showPanel(panel, show) {
	var newElements = document.getElementById(panel);
	newElements.hidden = !show;
	newElements.previousSibling.hidden = !show;
}

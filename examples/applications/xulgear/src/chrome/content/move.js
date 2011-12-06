var copyList = null; 
function CopyInfo() {
	this.type;//1:element, 3:nodeText
	this.name;
	this.children;
	this.attributes;
	this.styles;
	this.data;//for textnode
}
function copyElements() {
	copyList = [];
	var treeitems = getSelectedTreeitems();
	for (var i=0; i < treeitems.length; i++) {
		if (treeitems[i].target== getTargetDocument().documentElement) {//.tagName=="window") {// 
			continue;
		}
		copyList[i] = copyElement(treeitems[i]);
	}
}
function copyElement(treeitem) {
	if (treeitem.target.nodeType == 1) {
		var treeitems = treeitem.lastChild.childNodes;//getChildTreeitems(treeitem);
		var childs = [copyElement(i) for each(i in treeitems) if(i.tagName=='treeitem')]
		var attributes = [{name: i, value:treeitem.target.attrs[i]} for (i in treeitem.target.attrs)];
		var obj = {type:1, name: treeitem.target.tagName, children:childs, attributes: attributes, "styles": copyObject(treeitem.target.styles)};
	} else if (treeitem.target.nodeType == 3) {
		var obj = {type:3, data:treeitem.target.data};

	}
	return obj;
}
function pasteElements() {
	if (copyList) {
		var parentTreeitems = getSelectedTreeitems();
		var action = new Action(INSERT, []);
		for (var i=0; i < parentTreeitems.length; i++) {
			for (var j=0; j < copyList.length; j++) {
				var item = pasteElement(parentTreeitems[i], copyList[j]);
				action.treeitems.push(item);
			}
		}
		addAction(action);
	}
}
function copyObject(obj) {//shallow copy
	var n = {};
	for (var i in obj) {
		n[i] = obj[i];
	}
	return n;
}
function pasteElement(parentTreeitem, copyInfo) {
	if (copyInfo.type == 1) {
		var treeitem = addElementToElementTree(createXULElement(copyInfo.name, copyInfo.attributes, copyInfo.styles), parentTreeitem) ;
		for (var i = 0; i < copyInfo.children.length; i++) {
			pasteElement(treeitem, copyInfo.children[i]);
		}
	} else if (copyInfo.type == 3) {
		var treeitem = addElementToElementTree(createText(copyInfo.data), parentTreeitem);
	}
	return treeitem;
}
function selectNextItem() {
	var tree = document.getElementById('element-tree');
	tree.view.selection.select(++tree.currentIndex);
}
function selectPrevItem() {
	var tree = document.getElementById('element-tree');
	tree.view.selection.select(--tree.currentIndex);
}

function deleteElement(){
	var treeitems = getSelectedTreeitems();
	if (treeitems.length == 0) {
		return;
	}
	var tree = document.getElementById('element-tree');
	var index = tree.view.getIndexOfItem(treeitems[0]);
	var action = new Action(REMOVE, treeitems);
	removeElements(action);
	addAction(action);
	if (index > tree.view.rowCount - 1) {
		index = tree.view.rowCount - 1;
	}
	tree.view.selection.select(index);
}

function cutElement() {
	copyElements();
        deleteElement();
}

function upElement() {
	var treeitems = getSelectedTreeitems();
	for (var i in treeitems) {
		var treeitem =  treeitems[i];
		var target = treeitem.target;
		treeitem.parentNode.insertBefore(treeitem, treeitem.previousSibling);
		target.parentNode.insertBefore(target, target.previousSibling);
	}
}
function downElement() {
	var tree = this.document.getElementById("element-tree");
	var start = new Object();
	var end = new Object();
	var numRanges = tree.view.selection.getRangeCount();
	var lastTreeitem = null;

	for (var t = numRanges-1; t >= 0; t--) {
		tree.view.selection.getRangeAt(t, start, end);

		for (var v = end.value; v >= start.value; v--){
			var treeitem = tree.view.getItemAtIndex(v);
			if (treeitem.nextSibling == null || lastTreeitem == treeitem.nextSibling) {
				lastTreeitem = treeitem;
				continue;
			}
			treeitem.parentNode.insertBefore(treeitem, treeitem.nextSibling.nextSibling);
			treeitem.target.parentNode.insertBefore(treeitem.target, treeitem.target.nextSibling.nextSibling);
			lastTreeitem = treeitem;
		}
	}
}
function dragging(event ,tree) {
	if (!tree.ondrag)
		return;

	var row = {}, obj = {};
	tree.boxObject.QueryInterface(Components.interfaces.nsITreeBoxObject);
	tree.boxObject.getCellAt(event.clientX, event.clientY, row, {}, obj);

	if (tree.prerow) {// && treerow != tree.prerow)
		tree.prerow.removeAttribute("properties");
	}
	/*
	if (tree.precell) {
		tree.precell.removeAttribute("properties");
	}
	*/

	if (row.value != -1) {
		var treeitem = tree.view.getItemAtIndex(row.value);

		var x = {}, y = {}, width = {}, height = {}, column = 0;
		if (typeof tree.columns != "undefined") column = tree.columns[column];
		tree.boxObject.getCoordsForCellItem( row.value, column, "cell", x, y, width, height );


		//alert(y.value+tree.boxObject.y+height.value-1+","+event.clientY);
		var yoffset = y.value+tree.boxObject.y+height.value-1;

		var treerow = treeitem.getElementsByTagName("treerow")[0];
		if (tree.prerow) {// && treerow != tree.prerow)
			tree.prerow.removeAttribute("properties");
		}
		/*
		if (tree.precell) {
			tree.precell.removeAttribute("properties");
		}
		*/

		var treecell = treerow.getElementsByTagName("treecell")[0]
		tree.prerow = treerow;
		//tree.precell = treecell;

		if (yoffset + 5 > event.clientY) {
			//treecell.setAttribute("properties", "top-over");
			treerow.setAttribute("properties", "top-over");
		} else if (yoffset+height.value - 4 < event.clientY) {
			//treecell.setAttribute("properties", "bottom-over");
			treerow.setAttribute("properties", "bottom-over");
		} else {
			//treerow.setAttribute("properties", "mover");
			treecell.setAttribute("properties", "mover");
			tree.prerow = treecell;
		}
	}

}
var dragElements = null;
function dragStartFromNewElement(name) {

	var treeitem = addElementToElementTree(createXULElement(name) ,document.getElementById('element-tree').lastChild.lastChild);
	treeitem.parentNode.removeChild(treeitem);
	treeitem.target.parentNode.removeChild(treeitem.target);
	dragElements = [treeitem];
	var tree = document.getElementById('element-tree');
	tree.ondrag = true;
	//createAttributesBox(name);
}
function dragElement(event, tree) {
		var row = {}, obj = {}, column={};
		//var tree = this.document.getElementById("element-tree");
		tree.boxObject.QueryInterface(Components.interfaces.nsITreeBoxObject);
		tree.boxObject.getCellAt(event.clientX, event.clientY, row, column, obj);

		if (column.value && column.value.index >= 0) {// to ignore scrollbox 
			dragElements = getSelectedTreeitems();
			tree.ondrag=true;
		}
}
function dropElement(event, tree) {
	if(tree.ondrag) {
		tree.ondrag=false;
		var row = {}, obj = {}, column={};
		tree.boxObject.QueryInterface(Components.interfaces.nsITreeBoxObject);
		tree.boxObject.getCellAt(event.clientX, event.clientY, row, column, obj);

		var x = {}, y = {}, width = {}, height = {}, column = 0;
		if (typeof tree.columns != "undefined") column = tree.columns[column];
		tree.boxObject.getCoordsForCellItem( row.value, column, "cell", x, y, width, height );


		//alert(y.value+tree.boxObject.y+height.value-1+","+event.clientY);
		var yoffset = y.value+tree.boxObject.y+height.value-1;

		var treeitem = tree.view.getItemAtIndex(row.value);
		var treerow = treeitem.getElementsByTagName("treerow").item(0);
		if (tree.prerow) {// && treerow != tree.prerow)
			tree.prerow.removeAttribute("properties");
		}
		if (tree.precell) {
			tree.precell.removeAttribute("properties");
		}
		tree.prerow = treerow;

		if (row.value != -1) {
			//treeitem = tree.view.getItemAtIndex(row.value);

			if (yoffset + 5 > event.clientY) {// top 5 pixels of treeitem
				/*
				if (treeitem.target == this.targetWindow.document.documentElement) {
					return;
				}
				*/
				var parentTreeitem = treeitem.parentNode.parentNode;
				var after = treeitem;
			} else if (yoffset+height.value - 4 < event.clientY) {//bottom 5 pixels of treeitem
				if (treeitem.getAttribute("open") == "true") { //the target treeitem has child nodes
					var parentTreeitem = treeitem;
					var after = treeitem.lastChild.firstChild;
				} else {
					var parentTreeitem = treeitem.parentNode.parentNode;
					var after = treeitem.nextSibling;
				}
			} else {
				var parentTreeitem = treeitem;
				var after = null;
				if (treeitem.getAttribute("container") == false) {
					treeitem.setAttribute("container", "true");
					treeitem.setAttribute("open", "true");
				}
			}

			var refTarget = after ? after.target : null;

			if (dragElements) {
				var treeitems = dragElements;
			//var treeitems = getSelectedTreeitems();
			var action = new Action(MOVE, [], [], []);
			for (var i in treeitems) {
				var selectedItem = treeitems[i];
				if (selectedItem == parentTreeitem) { //for myself
					fixOpenState(treeitem);
					/*
					if (treeitem.getElementsByTagName("treeitem").length == 0) {
						treeitem.removeAttribute("open");
						treeitem.removeAttribute("container");
					}
					*/
					return;
				}

				//undo & redo
				if (selectedItem.parentNode) {
					action.treeitems.push(selectedItem);
					action.parents.push(selectedItem.parentNode.parentNode);
					action.nextTreeitems.push(selectedItem.nextSibling);
				} else {
					action.type = INSERT;
					action.treeitems.push(selectedItem);
				}
				
				//fixOpenState(selectedItem);
				if (selectedItem.parentNode)
					var parentSelected = selectedItem.parentNode.parentNode;
				parentTreeitem.lastChild.insertBefore(selectedItem, after);
				parentTreeitem.target.insertBefore(selectedItem.target, refTarget);

				
				if (parentSelected) {
					fixOpenState(parentSelected);
				}
			}
			addAction(action);
			tree.view.selection.select(tree.view.getIndexOfItem(treeitems[0]));
			}
		}
	}
}

function fixOpenState(treeitem) {//fix container state
	if (treeitem.getElementsByTagName('treeitem').length == 0) {
		treeitem.removeAttribute('open');
		treeitem.removeAttribute('container');
	} else {
		treeitem.setAttribute('open', "true");
		treeitem.setAttribute('container', "true");
	}
}


const INSERT = 0;
const REMOVE = 1;
const MOVE = 2;
var undoHistory = [];//undo stack
var redoHistory = [];//redo stack
function Action(type, items, parents, nexts) {
	this.type = type;
	this.treeitems = items;
	this.nextTreeitems = nexts ? nexts : [];
	this.parents = parents ? parents : [];
}
function undo() {
	if (!undoHistory.length)
		return;
	
	if (redoHistory.length == 0) {
		document.getElementById('redo_item').disabled = false;
	}

	var action = undoHistory.pop();
	if (action.type == INSERT) {
		removeElements(action);
	} else if (action.type == REMOVE || action.type == MOVE) {
		insertElements(action);
	}

	if (undoHistory.length == 0) {
		document.getElementById('undo_item').disabled = true;
	}
	redoHistory.push(action)
}
function redo() {
	if (!redoHistory.length)
		return;

	if (undoHistory.length == 0) {
		document.getElementById('undo_item').disabled = false;
	}
	var action = redoHistory.pop();
	if (action.type == INSERT || action.type == MOVE) {
		insertElements(action);
	} else if (action.type == REMOVE) {
		removeElements(action);
	}

	if (redoHistory.length == 0) {
		document.getElementById('redo_item').disabled = true;
	}
	undoHistory.push(action);
}
function addAction(action) {
	if (undoHistory.length == 0) {
		document.getElementById('undo_item').disabled = false;
	}

	undoHistory.push(action);
	redoHistory = [];
}

function insertElements(action) {
	for (var i = 0; i < action.treeitems.length; i++) {
		var item = action.treeitems[i];
		if (item.parentNode) 
			var preparentItem = item.parentNode.parentNode;
		var nextItem = action.nextTreeitems[i];
		var parentItem = action.parents[i];

		if (item.parentNode) {//diference between REMOVE and move on redo
			action.nextTreeitems[i] = item.nextSibling;
			action.parents[i] = item.parentNode.parentNode;
		}
		if (nextItem) {
			parentItem.target.insertBefore(item.target, nextItem.target);
			parentItem.lastChild.insertBefore(item, nextItem);
		} else {
			parentItem.target.appendChild(item.target);
			parentItem.lastChild.appendChild(item);
		}
		fixOpenState(item);
		if (preparentItem) fixOpenState(preparentItem);
		if (item.parentNode && item.parentNode.parentNode) fixOpenState(item.parentNode.parentNode);
	}
}

function removeElements(action) {
	//var action = new Action(REMOVE, treeitems, [], []);
	var treeitems = action.treeitems;
	
	for (var i = 0; i < treeitems.length; i++) {
		var treeitem = treeitems[i];
		if (treeitem.target == getTargetDocument().documentElement) {
			continue;
		}
		action.nextTreeitems[i] = treeitem.nextSibling;
		action.parents[i] = treeitem.parentNode.parentNode;

		treeitem.target.parentNode.removeChild(treeitem.target);
		treeitem.parentNode.removeChild(treeitem);

		fixOpenState(action.parents[i]);
	}
	return action;
}

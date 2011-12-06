//A sub-class of SerializableObject can define deserializer by implementing "onDeserialize" function 
//each sub-classes have to deserialize their own properties of SerializableObject in the function by using an argument "serializedObject"
function SerializableObject(json) { }

SerializableObject.prototype._deserialize = function(serializedObject) {
	if (this.__proto__._deserialize)
		this.__proto__._deserialize(serializedObject);
	this.onDeserialized(serializedObject);
}

SerializableObject.prototype.onDeserialized = function (serializedObject) { }

SerializableObject.prototype.deserialize = function(serializedObject) {
	for (var i in serializedObject) {
		this[i] = serializedObject[i];
	}
	this._deserialize(serializedObject);
}



//[public abstract]
function Project(json) {
	this.directory = "";
	this.name = "";
	this.fileTreeRdf = <root>jpieowiofw</root>;
}

Project.prototype = new SerializableObject();
Project.prototype.onDeserialized = function(json) { }

//FirefoxExtensionProject
function FirefoxExtensionProject() { 

}

FirefoxExtensionProject.prototype = new Project();
FirefoxExtensionProject.prototype.onDeserialized = function(json) { }



//HTML5Project
function HTML5Project() { 
	this.ProjectType = "HTML5Project";

}

HTML5Project.prototype = new Project();
HTML5Project.prototype.onDeserialized = function (json) { }



var so = new FirefoxExtensionProject();
so.deserialize({name:"XULPIX", directory:"C:\\", b:{c:32}});

alert(JSON.stringifyAll(so));


//XULRunnerProject
function XULRunnerProject() {

}
XULRunnerProject.prototype = new Project();


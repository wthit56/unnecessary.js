Node.prototype.cloneNode = function (deep) {
	// node is a Text node...
	if (this instanceof Text) {
		// ...so create a new Text node with the same data
		return document.createTextNode(this.data);
	}
	// node is not a Text node...
	else {
		// ...so clone the node

		// create a new element with the same tagName
		var clone = document.createElement(this.tagName);

		// loop through each attribute
		for (var i = 0; i < this.attributes.length; i++) {
			// add each attribute to the newly created clone node
			clone.setAttribute(this.attributes[i].nodeName, this.attributes[i].nodeValue);
		}

		// deep parameter is truthy...
		if (deep) {
			// ...so clone each child node into the newly created clone node
			
			// loop through each child node
			for (var i = 0; i < this.childNodes.length; i++) {
				// deeply clone each child node and add to the newly created clone node
				clone.appendChild(this.childNodes[i].cloneNode(deep));
			}
		}

		// return the resulting cloned node
		return clone;
	}
};
// https://developer.mozilla.org/en-US/docs/CSS/CSS_Reference#Selectors

document.querySelectorAll = (function () {
	return function (selectors) {
		console.group(selectors);
		{
			selectors = selectors.split(/\s*,\s*/g);
			var i = 0, c, l = selectors.length;
			while (i < l) {
				console.group(selectors[i]);
				{
					c = selectors[i] = new String(selectors[i]);

					console.log("select elements...");
					c.replace(
						/((?:(?:\*|([a-zA-Z0-9-]*))\|)?\*)|(?:\s*(?:(\+)|(~)|(>))\s*)|(\s+)|(?:(?:(\.)|(#))?([a-zA-Z0-9-]+(?!\|)))|(\[([a-zA-Z0-9-]+((=)|(~=)|(\|=)|(\^=)|(\$=)|(\*=))?)\])/g,
						function handle(match, any, anyNamespace, adjacent, sibling, child, descendant, isClass, isID, name, attr, attrName, attrValue, attrIncludesWhitespace, attrIncludesHyphens, attrStartsWith, attrEndsWith, attrIncludes) {
							if (any) {
								console.log(
									"any element" +
									(
										(anyNamespace == null) ? ""
											: " (" + (
												anyNamespace.length > 0 ? "namespace: " + anyNamespace
													: "no namespace"
											) + ")"
									)
								);
							}
							else if (adjacent) { console.log("move to adjacent..."); }
							else if (sibling) { console.log("move to sibling..."); }
							else if (child) { console.log("move to child..."); }
							else if (descendant) { console.log("move to descendant..."); }
							else if (name) {
								if (isClass) { console.log("with class: ", name); }
								else if (isID) { console.log("with id: ", name); }
								else { console.log("with tagName: ", name); }
							}
							else if (attr) {
								
							}
						}
					);
				}
				console.groupEnd();

				i++;
			}
		}
		console.groupEnd();
	}
})();

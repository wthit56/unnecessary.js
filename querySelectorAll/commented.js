// https://developer.mozilla.org/en-US/docs/CSS/CSS_Reference#Selectors
document.querySelectorAll = (function () {

	{ // requirements
		var failed = false;
		if (!document.getElementsByClassName) {
			console.error("Cannot find document.getElementsByClassName");
			failed = true;
		}
		if (!document.getElementsByTagName) {
			console.error("Cannot find document.getElementsByTagName");
			failed = true;
		}
		if (!document.getElementsByTagNameNS) {
			console.error("Cannot find document.getElementsByTagNameNS");
			failed = true;
		}

		if (failed) { return; }
	}

	var attr = (function () {
		var attr = {
			name: /([a-zA-Z0-9-]+)/,
			value: /([~\|\^\$\*])?\=(?:(["'])([\W\w]*?)\3|(\S*))/
		};
		attr.find = new RegExp("\\[" + attr.name.source + "(?:" + attr.value.source + ")?\\]");

		attr.matchMap = {
			"": "exact",
			"~": "whitespace-separated",
			"|": "hyphen-separated",
			"^": "starts-with",
			"$": "ends-with",
			"*": "includes"
		};
		attr.replace = function (match, name, valueMatch, quote, value, unquotedValue) {
			this.attributes.push({
				type: attribute,
				name: name,
				value: (value != null) ? value : unquotedValue,
				match: attr.matchMap[(valueMatch == null) ? "" : valueMatch]
			});
		};

		return attr;
	})();

	var find = new RegExp(
		attr.find.source
	, "g");
	console.log("find: ", find);

	return function (selectors) {
		console.group(selectors);

		selectors.replace(/([\W\w]*?(?:(["'])[\W\w]*?\2))*?(?:,|$)/g, function (match) {
			console.group(match);
			console.groupEnd();
		});
		
		console.groupEnd();
	};


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
						/(\[([a-zA-Z0-9-]+)(([\~\|\^\$\*])=(?:(["'])([\W\w]*?)\9)|\S*)?\])|((?:(?:\*|([a-zA-Z0-9-]*))\|)?\*)|(?:\:\:?([a-z-]+))|(?:\s*(?:(\+)|(~)|(>))\s*)|(\s+)|(?:(?:(\.)|(#))?([a-zA-Z0-9-]+(?!\|)))/g,
						function handle(match, attr, attrName, attrValue, attrIncludesWhitespace, attrIncludesHyphens, attrStartsWith, attrEndsWith, attrIncludes, any, anyNamespace, pseudo, adjacent, sibling, child, descendant, isClass, isID, name) {
							console.log(arguments);

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
							else if (pseudo) { console.log("move to pseudo (" + pseudo + ")"); }
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

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
		if (!window.Replacer) {
			console.error("Cannot find Replacer");
			failed = true;
		}

		if (failed) { return; }
	}

	var parse = Replacer.aggregate(
		{ // attribute
			find: /\[([a-zA-Z0-9-]+)(?:([~\|\^\$\*]|)\=(?:(["'])([\W\w]*?)\3|([^\s\]]*)))?\]/g,
			replace: (function () {
				function replace(match, name, valueMatch, quote, value, unquotedValue) {
					if (!current.attributes) { current.attributes = []; }

					var config = { name: name };

					value = (value != null) ? value : unquotedValue;
					if (value != null) { config.value = value; }

					valueMatch = replace.matchMap[valueMatch];
					if (valueMatch != null) { config.match = valueMatch; }

					console.log("attribute: ", config);
					current.attributes.push(config);
				};
				replace.matchMap = {
					"": "exact",
					"~": "whitespace-separated",
					"|": "hyphen-separated",
					"^": "starts-with",
					"$": "ends-with",
					"*": "includes"
				};

				return replace;
			})()
		},
		{ // any
			find: /(?:(\S*)\|)?\*/,
			replace: function (match, namespace) {
				current.any = true;
				console.log("<*> (any element)");

				if (namespace != null) {
					current.namespace = namespace;
					if (namespace === "") { console.log("of no namespace"); }
					else { console.log("of namespace: \"" + namespace + "\""); }
				}
			}
		},
		{ // class, id, element, pseudo
			find: /([\.#])?([a-zA-Z0-9-]+)/,
			replace: (function () {
				function replace(match, type, name) {
					if (type == null) {
						current.tagName = name;
						console.log("<" + name + ">");
					}
					else {
						type = replace.typeMap[type];

						if (type === "class") {
							if (current.classes == null) {
								if (current.class != null) {
									current.classes = [current.class, name];
									delete current.class;
								}
								else { current.class = name; }
							}
							else { current.classes.push(name); }
						}
						else if (type === "id") {
							current.id = name;
						}

						console.log("has " + type + ": " + name);
					}
				};
				replace.typeMap = {
					".": "class",
					"#": "id"
				};

				return replace;
			})()
		},
		{ // combinators
			find: /\s*([\+~>]|\s)\s*/,
			replace: (function () {
				function replace(match, type) {
					type = replace.typeMap[type];
					current.moveTo = { relation: type };
					current = current.moveTo;

					console.log("move to " + type + "...");
				};
				replace.typeMap = {
					" ": "descendant",
					"+": "adjacent",
					"~": "sibling",
					">": "child"
				};

				return replace;
			})()
		},
		{ // pseudo
			find: /::?([a-zA-Z0-9-]+)(?:\(([^(]*)\))?/,
			replace: function (match, type, parameter) {
				var config = { type: type };
				if (parameter != null) { config.parameter = parameter; }

				if (current.pseudos == null) {
					if (current.pseudo == null) { current.pseudo = config; }
					else {
						current.pseudos = [current.pseudo, config];
						delete current.pseudo;
					}
				}
				else {
					current.pseudos.push(config);
				}

				console.log("pseudo: ", config);
			}
		}
	);

	var findSelectors = /((?:[\W\w]*?(?:(["'])[\W\w]*?\2)?)*?)(?:,\s*|$)/g;

	var current, parsed;

	return function (selectors) {
		console.group(selectors);

		parsed = [];

		selectors.replace(findSelectors, function (match, selector) {
			if (match.length === 0) { return; }

			console.group(selector);

			current = {};
			parsed.push(current);

			parse(selector);

			console.groupEnd();
		});

		console.groupEnd();

		return parsed;
	};
})();

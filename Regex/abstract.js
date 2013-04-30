window.Regex = (function () {
	var find = /([\W\w]*?)(?:(\\c([A-Z])|\\0([0-9]+)|\\(\d)|(\\x([0-9a-fA-F]{2})|\\u([0-9a-fA-F]{4}))|(\\[\W\w]))|(\[(\^)?([^\]]+)\])|(\((?:\?([:=!]))?|(\)))|((\^)|(\$))|(((\*)|(\+)|(\{(\d+)(?:,(\d*))?\}))|(\?))|(\.)|(\|)|$)/g;
	var findCharClass = /([\W\w]*?)(?:(?:\\(?:(x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4}))|([^\]])))|(-)|$)/g,
		group = /\((?:\?([:=!]))[(]+\)/g;

	var index, found;
	function Regex(source, flags) {
		if (source instanceof RegExp) {
			this.global = source.global;
			this.ignoreCase = source.ignoreCase;
			this.multiline = source.multiline;

			source = source.source;
		}
		else if (typeof (source) === "string") {
			this.global = (source.indexOf("g") !== -1);
			this.ignoreCase = (source.indexOf("i") !== -1);
			this.multiline = (source.indexOf("m") !== -1);
		}

		this.source = source;

		index = -1;

		this.parents = [];
		this.parts = [];
		this.groups = [];

		console.group(source);
		{
			while (true) {
				found = find.exec(source);
				if (found) {
					if (found.index == index) { break; }
					else {
						index = found.index;
						handleMatch.apply(this, found);
					}
				}
				else {
					break;
				}
			}
			find.lastIndex = 0;
			found = null;
		}

		if (this.parents.length > 0) {
			var i, l;
			for (i = 0, l = this.parents.length; i < l; i++) {
				if (this.parents[i].type === "group") {
					throw new Error("Unclosed group(s).");
				}
			}
			this.parts = this.parents[0];
			this.parents.splice(0);
		}
		this.parents = null;

		// console.log(JSON.stringify(this.parts, null, "	"));

		console.groupEnd();
	};

	var handleMatch = (function () {
		var slice = Array.prototype.slice;
		var index, found;

		return function handleMatch(match,
			pre,
			escaped, control, octal, groupRef,
				charRef, charRefShort, charRefLong,
				escChar,
			charClass, not, chars,
			group, openType, close,
			anchor, start, end,
			modifier,
				repeat, repeat0Plus, repeat1Plus,
					spec, specFrom, specTo,
				optional,
			nonNewline,
			or
		) {
			if (pre) {
				this.parts.push(pre);
			}

			if (escaped) {
				var e = { type: "escaped" };
				if (control) { e.control = control; }
				else if (octal) { e.octal = octal; }
				else if (groupRef) { e.groupRef = groupRef; }
				else if (charRef) {
					e.charRef = true;
					e.value = charRefShort || charRefLong;
				}
				else if (escChar) {
					e.character = escChar;
				}
				this.parts.push(e);
			}

			else if (charClass) {
				var c = { type: "charClass", not: !!not, chars: "", escaped: "" };
				this.parts.push(c);

				findCharClass.lastIndex = 0;
				index = -1;
				while (true) {
					found = findCharClass.exec(chars);
					if (!found || found.index === index) { break; }
					else { index = found.index; }
					handleCharClass.apply(c, found);
				}
				found = null;

				charClassRef = c;
				c.chars = c.chars.replace(findRanges, replaceRanges);
				charClassRef = null;
			}

			else if (group) {
				if (close) {
					if (this.parents.length < 1) {
						throw new Error("Cannot close group; no group open.");
					}
					this.parts = this.parents.pop();
				}
				else {
					var g = [];
					g.type = "group";
					switch (openType) {
						case "!":
							g.negative = true;
							// fallthrough; non-capturing negative lookahead
						case "=":
							g.lookahead = true;
							// fallthrough; non-capturing lookahead
						case ":":
							g.nonCapturing = true;
							break;
						default:
							this.groups.push(g);
							g.id = this.groups.length;
					}

					this.parts.push(g);
					this.parents.push(this.parts);
					this.parts = g;
				}
			}
			else if (anchor) {
				var a = { type: "anchor" };
				if (start) { a.start = true; }
				else if (end) { a.end = true; }
				this.parts.push(a);
			}
			else if (modifier) {
				if (this.parts.length >= 0) {
					part = makeObject(this.parts, -1);
					if (repeat) {
						if (spec) {
							part.repeat = +specFrom;
							// "" => 0
							// null => 0

							if (specTo != null) {
								if (specTo !== "") {
									if (specFrom != specTo) {
										part.repeat = { from: part.repeat, to: +specTo, greedy: true };
									}
								}
								else {
									part.repeat = new Number(part.repeat);
									part.repeat.greedy = true;
								}
							}
						}
						else {
							var from;
							if (repeat0Plus) {
								from = 0;
							}
							else if (repeat1Plus) {
								from = 1;
							}

							from = part.repeat = new Number(from);
							from.greedy = true;
						}
					}
					else if (optional) {
						// part.repeat is only an Object when there is a "from" and "to" specified
						if (part.repeat && (part.repeat instanceof Object)) {
							part.repeat.greedy = false;
						}
						else {
							part.optional = true;
						}
					}
				}
				else {
					throw new SyntaxError("No match to modify.");
				}
			}
			else if (nonNewline) {
				this.parts.push({ type: "non-newline" });
			}
			else if (or) {
				if (this.parts.type == "choice") {
					var next = [];
					next.type = "choice";
					next.either = this.parts.either;

					this.parts.either.push(next);
					this.parts = next;
				}
				else {
					var previous = this.parts.splice(0, this.parts.length);
					var next = [];

					var either = [previous, next];
					either.type = "either";

					previous.type = "choice";
					previous.either = either;

					next.type = "choice";
					next.either = either;

					this.parents.push(this.parts);

					this.parts.splice(0, 0, either);
					this.parts = next;
				}
			}
		};
	})();

	var makeObject = (function () {
		var part;

		return function makeObject(parts, index) {
			index = (parts.length + index) % parts.length;
			part = parts[index];

			if (!(part instanceof Object)) {
				if (part.length > 1) {
					parts[index] = part.substring(0, part.length - 1);
					part = new String(part.substring(part.length - 1));
					parts.splice(index + 1, 0, part);
				}
				else { part = parts[index] = new String(part); }
			}

			return part;
		};
	})();

	var findCharClass = /(\\(?:c([A-Z])|(0\d+)|(x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4}))|([^\]])))|([\W\w])/g;
	function handleCharClass(match,
		escaped, control, octal,
			charRef, short, long,
			escChar,
		character
	) {
		if (escaped) {
			if (charRef) {
				this.chars += String.fromCharCode(parseInt(short || long, 16));
			}
			else if (octal) {
				this.chars += String.fromCharCode(parseInt(octal, 8));
			}
			else if (escChar) {
				this.escaped += escChar;
			}
		}
		else if (character) {
			this.chars += character;
		}
		/*
		//if (
		//	!dash &&
		//	(this.chars.length >= 3) &&
		//	(this.chars[this.chars.length - 2] === "-") &&
		//	(typeof (this.chars[this.chars.length - 3]) === "string") &&
		//	(typeof (this.chars[this.chars.length - 1]) === "string")
		//) {
		//	var r = { type: "range", from: -1, to: -1 };
		//	r.to = this.chars.pop().charCodeAt(0);
		//	this.chars.pop(); // remove dash
		//	r.from = this.chars.pop().charCodeAt(0);

		//	if (r.to < r.from) {
		//		throw new SyntaxError("Range out of order in character class [" + charClass + "].");
		//	}
		//	else {
		//		this.chars.push(r);
		//	}
		//}
		*/
	}

	var findRanges = /([\W\w])-([\W\w])/g;
	var charClassRef;
	function replaceRanges(match, from, to) {
		if (from === to) { return from; }
		else {
			if (!charClassRef.ranges) {
				charClassRef.ranges = [];
			}

			if (from > to) {
				throw new SyntaxError("Range out of order in character class.");
			}

			charClassRef.ranges.push({ from: from, to: to });
			return "";
		}
	}

	return Regex;
})();

window.Regex = (function () {
	var find = /([\W\w]*?)(?:(\\c([A-Z])|\\0([0-9]+)|\\(\d)|(\\x([0-9a-fA-F]{2})|\\u([0-9a-fA-F]{4}))|(\\[\W\w]))|(\[(\^)?([^\]]+)\])|(\((?:\?([:=!]))?|(\)))|((\^)|(\$))|(((\*)|(\+)|(\{(\d+)(?:,(\d*))?\}))|(\?))|(\.)|(\|)|$)/g;
	var findCharClass = /([\W\w]*?)(?:(?:\\(?:(x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4}))|([^\]])))|(-)|$)/g,
		group = /\((?:\?([:=!]))[(]+\)/g;

	function Regex(source, flags) {
		source = source.source;

		var index = -1;
		var found;

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
		}

		if (this.parents.length > 0) { throw new Error("Unclosed group."); }

		//console.log(JSON.stringify(this.parts, null, "	"));

		console.groupEnd();
	};

	var slice = Array.prototype.slice;
	function handleMatch(match,
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
			var c = { type: "charClass", not: !!not, chars: [] };
			this.parts.push(c);

			var findCharClass = /(\\(?:c([A-Z])|(0\d+)|(x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4}))|([^\]])))|(-)|([\W\w])/g;
			function handleCharClass(match,
				escaped, control, octal,
					charRef, short, long,
					escChar,
				dash,
				character
			) {
				if (escaped) {
					if (charRef) {
						this.chars.push(String.fromCharCode(parseInt(short || long, 16)));
					}
					else if (octal) {
						this.chars.push(String.fromCharCode(parseInt(octal, 8)));
					}
					else if (escChar) {
						this.chars.push({ type: "escaped", character: escChar });
					}
				}
				else if (dash) {
					this.chars.push(dash);
				}
				else if (character) {
					this.chars.push(character);
				}

				if (
					!dash &&
					(this.chars.length >= 3) &&
					(this.chars[this.chars.length - 2] === "-") &&
					(typeof (this.chars[this.chars.length - 3]) === "string") &&
					(typeof (this.chars[this.chars.length - 1]) === "string")
				) {
					var r = { type: "range", from: -1, to: -1 };
					r.to = this.chars.pop().charCodeAt(0);
					this.chars.pop(); // remove dash
					r.from = this.chars.pop().charCodeAt(0);

					if (r.to < r.from) {
						throw new SyntaxError("Range out of order in character class [" + charClass + "].");
					}
					else {
						this.chars.push(r);
					}
				}
			}

			var index = -1, found;
			while (true) {
				found = findCharClass.exec(chars);
				if (!found || found.index === index) { break; }
				else { index = found.index; }
				handleCharClass.apply(c, found);
			}
		}
		else if (group) {
			if (close) {
				if (this.parents.length <= 0) {
					throw new Error("Cannot close group; no group open.");
				}
				this.parts = this.parents.pop();
			}
			else {
				var g = { type: "group", parts: [] };
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
				this.parts = g.parts;
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
					// part.repeat is only an Object when there is a "from" and "to"
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
			console.log("any character except new-line characters [^\\n\\r]");
		}
		else if (or) {
			console.log("or...");
		}
	}

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

	return Regex;
})();

//var testGen = new Regex(/^_{}!{,}a*b+c{2}?[^a-zA-Z0-9a-f\x0000]{3,}(e\b(z?)){,4}(?:f){5,6}(?=g)(?!h)?|.[\b]\cM\n\1\0\0123\x0f\u0AaF$/);

var testGen = new Regex(/0*?1+?2{2}?3{3,}?4{4,4}?5{5,6}?/);
console.dir(testGen.parts);

testGen = new Regex(/0*1+2{2}3{3,}4{4,4}5{5,6}/);
console.dir(testGen.parts);

//new Regex(/[abc][^abc][a-c][^a-c][a^c][abc-][-abc][^abc-][^-abc][\cM\n\1\0\0123\x2B\u01D0\b\n]/);
//new Regex(/[abc][^abc][a-c][^a-c][a^c][\x10-\uFFFF]/);


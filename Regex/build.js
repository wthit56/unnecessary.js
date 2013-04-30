if (!Regex) { throw new Error("Regex not loaded."); }


Regex.prototype.build = (function () {
	function Regex_build() {
		function run(input) {
			if (input != this.input) {
				this.lastIndex = 0;
				this.input = input;
			}

			var found, match = "";
			for (var i = 0, p, l = this.parts.length; i < l; i++) {
				p = this.parts[i];
				found = p.run.call(this);
				if (found === false) {
					if (p.optional) { continue; }
					else {
						this.lastIndex++;
						if (this.lastIndex > this.input.length) {
							this.input = null;
							return null;
						}
						i = -1;
						match = "";
					}
				}
				else if (found) {
					match += found;
				}
			}

			return match;
		}

		for (var i = 0, p, l = this.parts.length; i < l; i++) {
			p = this.parts[i];
			if (p.type) {
				p.run = runners[p.type](p);
			}
			if (p.repeat) {
				var r = runners["repeat"](p);
				r.original = p.run;
				p.run = r;
			}
		}

		this.run = run;

		return this;
	};

	var runners = {
		charClass: (function () {
			var i, r, l;
			var code;
			function check(input) {
				if (this.chars && this.chars.indexOf(input) != -1) {
					return true;
				}
				else if (this.ranges && (this.ranges.length > 0)) {
					for (var i = 0, r, l = this.ranges.length; i < l; i++) {
						r = this.ranges[i];
						if ((r.from <= input) && (r.to >= input)) {
							return true;
						}
					}
				}

				return false;
			}

			return function runners_charClass(part) {
				return function runners_charClass() {
					var char = this.input[this.lastIndex];
					if (check.call(part, char)) {
						this.lastIndex++;
						return char;
					}
					else {
						return false;
					}
				};
			};
		})(),

		repeat: function (part) {
			var run = part.run,
				repeat = part.repeat,
				times = 0,
				from = part.from, to = part.to,
				found, match,
				l;

			return function runners_repeat() {
				l = this.input.length, times = 0, match = "";
				while (true) {
					found = run.call(this);
					if (found === false) { break; }
					else {
						match += found;
						if (this.lastIndex >= l) { break; }
					}

					times++;
					if ((to != null) && (times == to)) {
						return match;
					}
				}

				if (
					((from != null) && (times < from)) ||
					((repeat != null) && (times < repeat))
				) {
					return false;
				}
				else {
					return match;
				}
			};
		}
	};

	return Regex_build;
})();

(function () {
	var _ = this,
		c, d,
		N = "number", B = "boolean", S = "string";

	_.equal = function equal(a, b) {
		c = typeof (a);
		d = typeof (b);

		if (c != d) {
			switch (c) {
				case N:
				case B:
					if (!isNaN(b)) {
						a = +a;
						b = +b;
						return a == b;
					}
			}

			switch (d) {
				case N:
				case B:
					if (!isNaN(a)) {
						a = +a;
						b = +b;
						return a == b;
					}
			}

			if (
				(c === S) ||
				(d === S)
			) {
				a = "" + a;
				b = "" + b;
				return a == b;
			}

			return;
		}

		return a == b;
	};

	_.notEqual = function notEqual(a, b) {
		return !equal(a, b);
	};


	_.strictEqual = function strictEqual(a, b) {
		return (
			(typeof (a) === typeof (b)) &&
			(a == b)
		);
	};

	_.notStrictEqual = function notStrictEqual(a, b) {
		return (
			(typeof (a) !== typeof (b)) ||
			(a != b)
		);
	};

})();

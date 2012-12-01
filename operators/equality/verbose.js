var equal = (function () {
	var a_type, b_type;
	var NUMBER = "number",
		BOOLEAN = "boolean",
		STRING = "string";

	return function equal(a, b) {
		a_type = typeof (a);
		b_type = typeof (b);

		if (a_type != b_type) {
			switch (a_type) {
				case NUMBER:
				case BOOLEAN:
					if (!isNaN(b)) {
						a = +a;
						b = +b;
						return a == b;
					}
			}

			switch (b_type) {
				case NUMBER:
				case BOOLEAN:
					if (!isNaN(a)) {
						a = +a;
						b = +b;
						return a == b;
					}
			}

			if (
				(a_type === STRING) ||
				(b_type === STRING)
			) {
				a = "" + a;
				b = "" + b;
				return a == b;
			}

			return;
		}

		return a == b;
	};
})();

function notEqual(a, b) {
	return !equal(a, b);
}


function strictEqual(a, b) {
	return (
		(typeof (a) === typeof (b)) &&
		(a == b)
	);
}

function notStrictEqual(a, b) {
	return (
		(typeof (a) !== typeof (b)) ||
		(a != b)
	);
}

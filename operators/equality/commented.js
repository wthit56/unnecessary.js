function equal(a, b) {
	// operands are not of the same type...
	if (typeof (a) !== typeof (b)) {
		// ...so convert the values to ones compatible with each other
		if (
			(
		// "a" is a number or boolean...
				((typeof (a) === "number") || (typeof (a) === "boolean")) &&
		// ...and "b" can be converted to a number...
				(!isNaN(b))
			) ||
		// ...or "b" is a number or boolean...
			(
				((typeof (b) === "number") || (typeof (b) === "boolean")) &&
		// ...and "a" can be converted to a number...
				(!isNaN(a))
			)
		) {
			// ...so convert both values into numbers
			a = +a;
			b = +b;
			// compare the converted values
			return a == b;
		}
		else if (
		// "a" or "b" is a string...
			(typeof (a) === "string") || (typeof (b) === "string")
		) {
			// ...so convert both to a string
			a = "" + a;
			b = "" + b;
			// compare the converted values
			return a == b;
		}
	}
	// "a" and "b" are objects...
	else if (
		(typeof (a) === "object") && (typeof (b) === "object")
	) {
		// ...so check to see if both "a" and "b" point to the same object
		return a == b;
	}
	// "a" and "b" are not objects, but are of the same type
	else {
		// compare values
		return a == b;
	}
}

function notEqual(a, b) {
	return !equal(a, b);
}


function strictEqual(a, b) {
	if (
	// "a" and "b" are of the same type...
		(typeof (a) === typeof (b)) &&
	// ...and are of equal value...
		(a == b)
	) {
		// ...so return true
		return true;
	}
	else {
		// ...otherwise return false
		return false;
	}
}

function notStrictEqual(a, b) {
	if (
	// "a" and "b" are not of the same type...
		(typeof (a) !== typeof (b)) ||
	// ...or are not of the same value
		(a != b)
	) {
		// ...so return true
		return true;
	}
	else {
		// ...otherwise return false
		return false;
	}
}
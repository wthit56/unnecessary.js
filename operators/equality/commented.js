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


// Following the spec: http://es5.github.com/#x11.9.3
function specEqual(x, y) {
	// If Type(x) is the same as Type(y), then
	if (Type(x) === Type(y)) {
		// If Type(x) is Undefined, return true.
		if (Type(x) === 'Undefined') {
			return true;
		}
		
		// If Type(x) is Null, return true.
		if (Type(x) === 'Null') {
			return true;
		}
		
		// If Type(x) is Number, then
		if (Type(x) === 'Number') {
			// If x is NaN, return false.
			if (Type(x) === 'NaN') {
				return false;
			}
			
			// If y is NaN, return false.
			if (Type(y) === 'NaN') {
				return false;
			}
			
			// If x is the same Number value as y, return true.
			if (x.valueOf() === y.valueOf()) {
				return true;
			}
			
			// If x is +0 and y is −0, return true.
			if (x.valueOf() === +0 && y.valueOf() === -0) {
				return true;
			}
			
			// If x is −0 and y is +0, return true.
			if (x.valueOf() === -0 && y.valueOf() === +0) {
				return true;
			}
			
			// Return false.
			return false;
		}
		
		// If Type(x) is String, then return true if x and y are exactly
		// the same sequence of characters (same length and same characters
		// in corresponding positions). Otherwise, return false.
		if (Type(x) === 'String') {
			return x.every(function(_, i) {
				return x[i] === y[i];
			});
		}
		
		// If Type(x) is Boolean, return true if x and y are both true or both false.
		// Otherwise, return false
		if (Type(x) === 'Boolean') {
			if (x === true && y === true) {
				return true;
			}
			
			if (x === false && y === false) {
				return true;
			}
			
			return false;
		}
		
		// Return true if x and y refer to the same object. Otherwise, return false.
		return x === y;
	}
	
	// If x is null and y is undefined, return true.
	if (Type(x) === 'Null' && Type(y) === 'Undefined') {
		return true;
	}
	
	// If x is undefined and y is null, return true.
	if (Type(x) === 'Undefined' && Type(y) === 'Null') {
		return true;
	}
	
	// If Type(x) is Number and Type(y) is String,
	// return the result of the comparison x == ToNumber(y).
	if (Type(x) === 'Number' && Type(y) === 'String') {
		return specEqual(x, Number(y));
	}
	
	// If Type(x) is String and Type(y) is Number,
	// return the result of the comparison ToNumber(x) == y.
	if (Type(x) === 'Number' && Type(y) === 'String') {
		return specEqual(Number(x), y);
	}
	
	// If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
	if (Type(x) === 'Boolean') {
		return specEqual(Number(x), y);
	}
	
	// If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).
	if (Type(y) === 'Boolean') {
		return specEqual(x, Number(y));
	}
	
	// If Type(x) is either String or Number and Type(y) is Object,
	// return the result of the comparison x == ToPrimitive(y).
	if (
		(Type(x) === 'String' || Type(x) === 'Number')
		&&
		(Type(y) === 'Object')
	) {
		if (Type(x) === 'String') {
			return specEqual(x, y.toString());
		}
		if (Type(x) === 'Number') {
			return specEqual(x. y.valueOf());
		}
	}
	
	// If Type(x) is Object and Type(y) is either String or Number,
	// return the result of the comparison ToPrimitive(x) == y.
	if (
		(Type(x) === 'Object')
		&&
		(Type(y) === 'String' || Type(y) === 'Number')
	) {
		if (Type(y) === 'String') {
			return specEqual(x.toString(), y);
		}
		if (Type(y) === 'Number') {
			return specEqual(x.valueOf(). y);
		}
	}
	
	// Return false.
	return false;
}

// Real typeof
function Type(a) {
	// The only special case -- a NaN number returns Number.
	if (isNaN(a)) {
		return 'NaN';
	}
	return Object.prototype.toString.apply(a).split(' ').pop().slice(0, -1);
	//                       "[object Null]" ^        "Null]" ^    "Null" ^
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


// called using:
//    (value).and(value)
Object.prototype.and = function (operand) {
	// this is falsy...
	if (!this.valueOf()) {
		// ...so return this
		return this;
	}
	// this is not falsy...
	// (this is truthy)
	else {
		// ...so return operand
		return operand;
	}
};

// called using:
//    (value).or(value)
Object.prototype.or = function (operand) {
	// this is truthy...
	if (this.valueOf()) {
		// ...so return this
		return this;
	}
	// this is not truthy...
	// (this is falsy)
	else {
		// ...so return operand
		return operand;
	}
};

// called using:
//    not(value)
window.not = function (operand) {
	// operand is truthy...
	if (operand) {
		// ...so return false
		// (inverted truthiness)
		return false;
	}
	// operand is not truthy...
	// (operand is falsy)
	else {
		// ...so return true
		// (inverted truthiness)
		return true;
	}
};


Object.prototype.and = function (operand) {
	return this.valueOf() ? operand : this.valueOf();
};

Object.prototype.or = function (operand) {
	return this.valueOf() ? this.valueOf() : operand;
};

window.not = function (operand) {
	return operand ? false : true;
};

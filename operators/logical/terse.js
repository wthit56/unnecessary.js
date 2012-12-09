(function () {

	var _, V = "valueOf";
	
	Object.prototype.and = function (operand) {
		_ = this[V]();
		return _ ? operand : _;
	};

	Object.prototype.or = function (operand) {
		_ = this[V]();
		return _ ? _ : operand;
	};

	window.not = function (operand) {
		return operand ? false : true;
	};

})();
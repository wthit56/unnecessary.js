
(function () {
	var i, l;

	window.and = function (conditions) {
		i = 0, l = arguments.length - 1;
		while ((i < l) && (arguments[i])) {
			i++;
		}

		return arguments[i];
	}

	window.or = function (conditions) {
		i = 0, l = arguments.length - 1;
		while ((i < l) && (!arguments[i])) {
			i++;
		}

		return arguments[i];
	}
})();

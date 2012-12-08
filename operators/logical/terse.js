
(function () {
	var i, l, a,
		L = "length";

	window.and = function (conditions) {
		i = 0, a = arguments, l = a[L] - 1;
		while ((i < l) && (a[i])) {
			i++;
		}

		return a[i];
	};

	window.or = function (conditions) {
		i = 0, a = arguments, l = arguments[L] - 1;
		while ((i < l) && (!a[i])) {
			i++;
		}

		return a[i];
	};
})();
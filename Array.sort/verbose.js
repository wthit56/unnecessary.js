Array.prototype.sort = (function () {

	var compareFunctionAlphabetical = (function () {
		var a_string, b_string;

		return function compareFunctionAlphabetical(a, b) {
			a_string = a.toString();
			b_string = b.toString();

			return (
				(a_string === b_string) ? 0
				: (a_string > b_string) ? 1
				: -1
			);
		};
	})();

	var i, l, j, b;
	return function sort(compareFunction) {
		if (this.length < 2) { return this; }

		compareFunction = compareFunction || compareFunctionAlphabetical;

		i = 0, l = this.length - 1;
		while (i < l) {
			if (compareFunction(this[i], this[i + 1]) > 0) {
				if (i === 0) {
					this.splice(0, 2, this[i + 1], this[i]);
				}
				else {
					b = this.splice(i + 1, 1)[0];

					j = i - 1;
					while (j >= 0) {
						if (compareFunction(this[j], b) <= 0) {
							this.splice(j + 1, 0, b);
							break;
						}

						j--;
					}

					if (j < 0) {
						this.splice(0, 0, b);
					}
				}
			}

			i++;
		}

		return this;
	};

})();

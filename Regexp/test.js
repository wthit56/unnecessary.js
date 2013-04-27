var test = (function () {
	var match;

	return function test(regex, input) {
		match = input.match(regex);

		console.log(JSON.stringify(regex.source), ">", JSON.stringify(input), "==", null);
	};
})();
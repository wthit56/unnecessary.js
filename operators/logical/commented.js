function and(conditions){
	var i = 0, l = arguments.length;
	while (i < l) {
		// argument is a truthy value...
		if (arguments[i]) {
			// ...so do nothing
		}

		// argument is a falsy value...
		if (!arguments[i]) {
			// ...so return argument
			return arguments[i];
		}

		i++;
	}

	// no falsy value have been found,
	//    so return last argument
	return arguments[l - 1];
}

function or(conditions) {
	var i = 0, l = arguments.length;
	while (i < l) {
		// argument is a truthy value...
		if (arguments[i]) {
			// ...so return argument
			return arguments[i];
		}

		// argument is falsy
		if (!arguments[i]) {
			// ...so do nothing
		}

		i++;
	}

	// no truthy value has been found,
	//    so return last argument
	return arguments[l - 1];
}

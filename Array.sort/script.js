var sort = (function () {
	// This is the default comparison method.
	var compareStringFunction = (function () {
		var aS, bS;
		return function compareStringFunction(a, b) {

			// Convert a and b to strings
			aS = a.toString(); bS = b.toString();

			return (
				(aS == bS) ? // If the strings are the same,
					0 : 		//	return 0 (the items are next to each other, so do nothing).
					(aS > bS) ? // If a's string is greater than b's,
						1 : 	//	return 1 (a should be after b);
						-1		// Else, return -1 (a should be before b).
			);
			// The way JavaScript compares 2 strings is to check each character one at a time,
			//	and whichever is higher in the ASCII table wins.
			//	(ASCII is a big table of letters, numbers and symbols,
			//		each with a number associated with it.
			//		These numbers are used to determine whether
			//		one character comes before or after another character.)

			// So for example, the lowercase character "a" is number 97 in the ASCII Table.
			//	And the lowercase "b" is number 98.
			//	Therefore, "b" is greater than "a".
			// You can see the full ASCII Table at http://www.asciitable.com/

			// There are some oddities that occur because of this method of compaison.
			//	One obvious example is the following:
			//	Which should come first: 10 or 5?
			//		Obviously we would expect 5 to come first,
			//			with 10 being the larger number.
			//		Remember though, the numbers are converted to strings
			//			and then compared, one character at a time.
			//		So which comes first: 1 or 5?
			//			1, of course.
			//		So which of the strings comes first: "10" or "5"?
			//			10.
			//	This means that if you are sorting an array of numbers,
			//		a simple .sort() won't give you accurate results.
			//		Instead you will have to pass in your own compareFunction.
			//	This will be a function that takes 2 arguments, and returns a number.
			//		So if we want to compare two numbers, we can do something like this:
			
			//  [10, 5].sort(function(a, b){
			//      return a - b;
			//  }); // returns [5, 10];
			//
			//	If a 0 is returned, the items are equal in greatness,
			//		and should be next to each other in the resulting sorted array.
			//		If a positive number is returned, b should be before a.
			//		And if a negative number is returned, a should be before b.
		};
	})();

	// And here's the actual sort function.
	return function sort(compareFunction) {
		var array = this;

		// If there are less than 2 items in the array, no sorting is required.
		if (array.length < 2) { return array; }

		// If a compareFunction has not been provided,
		//	the default string comparison (above) is used instead.
		compareFunction = compareFunction || compareStringFunction;

		// This will loop infinitely until something inside the loop stops it.
		for (var i = 0, l = array.length - 1; i < l; i++) {
			//	-1 means current item should be before the next item;
			//		this is already the case, so we can simply continue.
			//	0 means current item is equal to the next item;
			//		this means they should be next to each other in the array.
			//		Again, they are, and so we continue.
			//	1 means the current item should be after the next item;
			//		here we need to swap round the current item with the next one.
			//		This can cause errors.
			//			If the next item should be even earlier in the array,
			//				this would never be checked for.
			//			For this reason we need to remember to loop backward
			//				through the array and do these checks.

			// Call the compareFunction, passing in the current item and the next item in the array.
			// If the current item should be after the next item:
			if (compareFunction(array[i], array[i + 1]) > 0) {
				// Swap the current and next items' positions in the array.
				array.splice(i, 2, array[i + 1], array[i]);

				// Loop back through the array from the current position
				for (var j = i; j > 0; j--) {
					// Call the compareFunction, passing in the current item and the previous item.
					// If the current item should be before the next item:
					if (compareFunction(array[j], array[j - 1]) < 0) {
						// Swap the current and next items' positions in the array.
						array.splice(j - 1, 2, array[j], array[j - 1]);
					}
					// Otherwise:
					else {
						// Stop looping back through the array
						break;
					}
				}
			}
		}

		// return the now sorted array
		return array;
	};

})();

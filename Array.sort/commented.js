Array.prototype.sort = function sort(compareFunction) {

	// less than 2 items in the array...
	if (this.length < 2) {
		// ...so no sorting is necessary
		return this;
	}


	// no compareFunction has been passed in...
	if (compareFunction == null) {
		// ...so use default alphabetical comparison
		compareFunction = function (a, b) {
			// a is alphabetically after b
			if (a.toString() > b.toString()) {
				// a should be to the right of b
				return 1;
			}
			// a is alphabetically before b
			else if (a.toString() < b.toString()) {
				// a should be to the left of b
				return -1;
			}
			// a is alphabetically the same as b
			else if (a.toString() === b.toString()) {
				// a and b are equal;
				//	therefore ordering shouldn't change
				return 0;
			}
		};
	}


	// starting at the first item
	var i = 0;
	// loop through all items, with a buffer of 1 item to the right
	while (i + 1 < this.length) {

		// compare the current item ("i") to the next item ("i+1")
		var ordering = compareFunction(this[i], this[i + 1]);

		// item "i" should be left of "i+1"...
		if (ordering < 0) {
			// ...so do nothing
			// item "i" is already to the left of "i+1"
		}

		// item "i" is equal to "i+1"...
		if (ordering == 0) {
			// ...so do nothing
		}

		// item "i" should be right of item "i+1"...
		if (ordering > 0) {
			// ...so remove item "i+1"
			//    splice returns the removed items in an array;
			//    as we are removing one item there will be one item in the returned array,
			//    so we'll retreive this one item and store it for use later
			var b = this.splice(i + 1, 1)[0];

			// item "i" is the first in the array...
			if (i === 0) {
				// ...so insert item "b" at the beginning
				this.splice(0, 0, b);
			}
			// item "i" is not the first in the array
			else {
				// item "i+1" has a different item to it's left now
				//    so starting with the previous item...
				var j = i - 1;
				// ...loop back through the items until we reach the first item
				while (j >= 0) {
					// compare the current item ("j") with the stored "b" item
					var ordering = compareFunction(this[j], b);

					// item "j" should be left of item "b",
					//    or "j" is equal to item "b"...
					//    we have found where item "b" should be positioned
					if (ordering <= 0) {
						// ...so insert item "b" to the right of item "j"
						this.splice(j + 1, 0, b);
						// as we've found the item's sorted position,
						//    we can break out of the reverse loop
						break;
					}

					// if item "j" should be right of item "b"...
					// the loop will continue to the left of item "j"
					// ...so do nothing

					// move on to the next item to the left in the array
					j--;
				}

				// no more items to check...
				if (j < 0) {
					// ...so insert item "b" at the beginning
					this.splice(0, 0, b);
				}
			}
		}

		// move on to the next item to the right in the array
		i++;
	}


	// return the now sorted array
	return this;

};

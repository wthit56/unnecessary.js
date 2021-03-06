// Replacer hasn't already been loaded...
if (!window.Replacer) {
	// ...so create Replacer object
	window.Replacer = (function () {
		// creates a function that will return the input string after replace
		function Replacer(find, replace) {
			var fn = function (input) {
				return input.replace(fn.find, fn.replace);
			}

			// add properties to the function.
			// these properties are live, meaning they can be changed, 
			//    and the functionality of the Replacer function will change.
			fn.find = find;
			fn.replace = replace;

			return fn;
		}

		// aggregates multiple Replacer-like objects into one Replacer function
		Replacer.aggregate = (function () {

			// for use in building the aggregate function
			var i, l, current_replacer; // Replacer loop
			var last_index; // last Replacer group index
			var find, replace;

			// creates aggregate Replacer function
			//    from list of Replacer-like objects
			function Replacer_aggregate(replacers) {
				// replacers (first argument) is an Array...
				if (replacers instanceof Array) {
					// ...so use the array as the arguments and pass in
					//    to new Replacer_aggregate call
					return Replacer_aggregate.apply(this, replacers);
				}

				var findA = [], // Array of all find patterns
					replaceA = {}; // indexed replace functions

				// reset variables for loop
				i = 0, l = arguments.length, last_index = 1;
				// loop through each argument index
				while (i < l) {
					// store current Replacer for later use
					current_replacer = arguments[i];

					// store the find pattern for later use
					find = (
					// current find is a string-pattern...
						(typeof (current_replacer.find) === "string")
					// ...so insert backslash for every character;
					//    this will ensure the resulting Regex pattern matches the 
					//    string exactly
							? generateFindStringPattern(current_replacer.find)
					// current find is not a string-pattern, 
					//    so assume it is a Regex-pattern.
					// fix the Regex group-references in the pattern 
					//    using the last index as the group offset
							: fixRegexGroups(current_replacer.find.source, last_index)
					);

					// store the replace function for later use
					replace = (
					// current replace is a string...
						(typeof (current_replacer.replace) === "string")
					//		...and current replace is an empty string...
							? ((current_replacer.replace === "")
					//			...so use the empty-string replace function
								? replaceStringFunction.empty
					//			...and current replace is not an empty string,
					//				so create a new replace function based on the 
					//				replace string
								: replaceStringFunction(current_replacer.replace))
					//		current replace is not a string,
					//			so assume it is a function.
					//		use the current replace function
							: current_replacer.replace
					);

					// find the current find's number of groups
					//    and set to the replace's groups property
					replace.groups = groups(current_replacer.find);

					// add the find pattern to the Array
					findA.push(find);
					// insert the replace function to the last group index
					replaceA[last_index] = replace;
					// last index should now be the one after the current find's groups
					last_index += 1 + replace.groups;
					// last index + current Replacer identifier group + current Replacer groups

					// move on to next Replacer
					i++;
				}

				// create new find-pattern based on aggregated find-patterns
				find = new RegExp("(" + findA.join(")|(") + ")", "g");
				// /(pattern1)|(pattern2)|(patternN...)/g
				// the global flag is required to find each Replacer's target in turn
				// store the original find-patterns Array
				find.base = findA;

				// create new replace function based on aggregated replace functions
				replace = (function () {
					// variables for use in replace function index loop
					var index, // stores the current replace function index
						args; // stores a set of arguments to send to replace function

					// this function will be called each time a match is found
					return function () {
						// loop through each index (property) of replace function index object
						for (index in replaceA) {
							// the corresponding group index has found a match...
							if (arguments[index] !== undefined) {
								// ...so send relevant arguments to the 
								//    original replace function

								// convert the index to a number
								index = +index;

								// create a slice of the arguments relating to the 
								//    current replace function
								args = Array.prototype.slice.call(arguments,
								// from: index
									index,
								// to: index + Replacer identifier group + Replacer find-pattern group count
									index + 1 + replaceA[index].groups
								);
								// add "extra" arguments to arguments list
								args.push(
								// index of match
									arguments[arguments.length - 2],
								// input of Replacer function call
									arguments[arguments.length - 1]
								);
								// this results in the same arguments passed in to a regular
								//    replacer function call, and so the replacer function 
								//    will behave the same as before it was included in the 
								//    aggregate Replacer function

								// apply these arguments to the original replace function
								//    and return the results
								return replaceA[index].apply(this, args);
							}
						}
					};
				})();

				// create a new Replacer function
				var fn = function (input) {
					return input.replace(fn.find, fn.replace);
				};
				// attach new find-pattern as a property
				fn.find = find;
				// attach new replace function as a property
				fn.replace = replace;
				// attach the replace function index as the base to the new replace function
				fn.replace.base = replaceA;
				// attach setFlags method
				fn.setFlags = setFlags;

				// return new Replacer function
				return fn;
			};

			// finds the number of groups returned by a pattern
			var groups = (function () {
				// temp store for generated Regex
				var groupsRegex;

				return function groups(find) {
					// find pattern is a string...
					if (typeof (find) === "string") {
						// ...so return 0
						return 0;
						// string patterns cannot have groups
					}
					// otherwise, assume find pattern is Regex

					// create new Regex that will always find a match
					groupsRegex = new RegExp("$|" + find.source);
					// run new Regex against an empty string
					// the length includes the number of groups plus the match itself
					return groupsRegex.exec("").length - 1;
					// the match is not counted as a group
				};
			})();

			// fixes the groups with the new pattern offset
			var fixRegexGroups = (function () {
				var replace = Replacer(/(\\)([1-9])/g, function (match, left, groupIndex) {
					// calculate new groupIndex
					groupIndex = (+groupIndex + replace.offset);

					// the new groupIndex greater than
					//    last Regex group-reference index allowed...
					if (groupIndex > 9) {
						// ...so throw an error
						throw new Error("Replacer.aggregate fixRegexGroups failed: fixed groupIndex was greater than 9. Source: " + find);
					}

					// return new group-reference
					return left + groupIndex;
				});

				return function fixRegexGroups(find, offset) {
					// set desired group offset for later use
					replace.offset = offset;
					// call Replacer function on the find-pattern
					return replace(find);
				};
			})();

			// set the flags on aggregated Replacer
			//    to be added as a property on the resulting Replacer
			function setFlags(flags) {
				// store find's base for later use
				var base = this.find.base;
				// create a new find from the original's source, 
				//    setting the flags as specified
				this.find = new RegExp(this.find.source, flags);
				// attach the old find's base as a property
				this.find.base = base;

				// return Replacer
				return this;
			}

			// generates a Regex pattern based on a given string-pattern
			var generateFindStringPattern = Replacer(
			// find characters that should be escaped for the Regex pattern
				new RegExp(
					"(\\" + ("\\^$*+?.(=)!|{,}[]".split("").join("|\\")) + ")",
					"g"
				),
				function (match, escaped) {
					// add escape character for Regex pattern
					return "\\" + match;
				}
			);

			// creates a function to generate the replace string
			//    based on a string find-pattern
			var replaceStringFunction = (function () {
				// $$	inserts dollar ($) character
				// $&	inserts entire match
				// $`	inserts input to the left of the match
				// $'	inserts input to the right of the match

				// find Regex: matches each special string (see above)
				var find = /\$(?:(\$)|(&)|(`)|(')|(\d+))/g,
				// replace function: replaces special strings with corresponding data
					replace = function (match, dollar, all, before, after, group) {
						return (
							dollar ? "$"
							: before ? args.input.substring(0, args.offset)
							: after ? args.input.substring(args.offset + args.match.length)
							: group ? ((args[group] != null) ? args[group] : match)
							: args.match // defualt OR all
						);
					},
				// stores arguments for use in replace function
					args;

				// sets up args and returns replaced string
				function generateReplacement(inputArgs, replaceString) {
					// store arguments for use in replace function
					args = inputArgs;
					// adds properties to the args Array for easy access in replace function
					args.match = args[0];
					args.offset = args[args.length - 2];
					args.input = args[args.length - 1];

					return replaceString.replace(find, replace);
				}

				// creates a replace function based on given replace-string
				function replaceStringFunction(replaceString) {
					// replace function
					var fn = function () {
						return generateReplacement(arguments, replaceString);
					};
					// the original replace-string
					fn.base = replaceString;
					// add toString property for the console to use as a 'summary'
					fn.toString = function () {
						return this.base + "\n" + Function.prototype.toString.call(this);
					};

					return fn;
				};

				// replace-function for an empty string-replace
				replaceStringFunction.empty = (function () {
					function empty() { return ""; };
					empty.base = "";
					empty.toString = function () { return "[empty string]"; }
					return empty;
				})();

				return replaceStringFunction;
			})();

			return Replacer_aggregate;
		})();

		return Replacer;
	})();
}